import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import "dotenv/config";
import User from "../models/user";
import { ApiError, sendMail } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";

const { JWT_SECRET } = process.env;

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw ApiError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
  });
  const maildata = await sendMail({ email, verificationToken });
  console.log("maildata:", maildata);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw ApiError(401, "Non verified user");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw ApiError(401, "Email or password is wrong");
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req: Request, res: Response) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const getCurrent = async (req: Request, res: Response) => {
  if (req.user.email && req.user.subscription) {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  }
};

const updateUserSubscription = async (req: Request, res: Response) => {
  const { user, body } = req;
  if (user.subscription === body.subscription) {
    res.json({ message: "You already have this subscription" });
    return;
  }
  await User.findByIdAndUpdate(
    user._id,
    { subscription: body.subscription },
    {
      new: true,
    }
  );
  res.json({ email: user.email, subscription: body.subscription });
};

const getVerification = async (req: Request, res: Response) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw ApiError(404, "User not found");
  }
  if (user.verify) {
    throw ApiError(400, "Verification has already been passed");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
  });
  res.json({ message: "Verification successful" });
};

const resendVerify = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError(404, "User Not Found");
  }
  if (user.verify) {
    throw ApiError(400, "Verification has already been passed");
  }
  const maildata = await sendMail({
    email,
    verificationToken: user.verificationToken,
  });
  console.log("maildata:", maildata);
  res.json({ message: "Verification email sent" });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
  getVerification: ctrlWrapper(getVerification),
  resendVerify: ctrlWrapper(resendVerify),
};
