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
    throw ApiError(409, "Email in use. Please Sign In.");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
  });
  const maildata = await sendMail({
    email,
    verificationToken,
    path: "verify",
    text: "Click to verify your Email",
  });
  if (!maildata) {
    throw ApiError(400, "Email not sent");
  }
  res.status(201).json({
    user: {
      email: newUser.email,
    },
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError(401, "Email or password not valid.");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw ApiError(401, "Email or password not valid.");
  }
  if (!user.verify) {
    throw ApiError(403, "Non verified user, please check email.");
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      substart: user.substart,
      subend: user.subend,
    },
  });
};

const logout = async (req: Request, res: Response) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const getCurrent = async (req: Request, res: Response) => {
  const { _id, name, email, subscription, substart, subend } = req.user;
  if (req.user) {
    res.json({
      id: _id,
      name: name,
      email: email,
      subscription: subscription,
      substart: substart,
      subend: subend,
    });
  }
};

const updateUserSubscription = async (req: Request, res: Response) => {
  const { user, body } = req;
  if (user.subscription === body.subscription) {
    res.json({ message: "You already have this subscription." });
    return;
  }
  const newDate = new Date().getTime();
  const newSubscription = body.subscription;
  const newSubstart = !user.substart ? newDate : user.substart;
  const newSubend =
    !user.subend || user.subend < newDate
      ? new Date().getTime()
      : new Date(
          new Date(user.subend).setMonth(new Date(user.subend).getMonth() + 1)
        ).getTime();
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { subscription: newSubscription, substart: newSubstart, subend: newSubend },
    {
      new: true,
    }
  );
  res.json({ updatedUser });
};

const getVerification = async (req: Request, res: Response) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw ApiError(404, "User not found");
  }
  if (user.verify) {
    throw ApiError(400, "Verification has already been passed.");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "23h" });
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      substart: user.substart,
      subend: user.subend,
    },
  });
};

const resendVerify = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError(404, "User Not Found.");
  }
  if (user.verify) {
    throw ApiError(400, "Verification has already been passed.");
  }
  const maildata = await sendMail({
    email,
    path: "verify",
    verificationToken: user.verificationToken,
    text: "Click to verify your Email",
  });
  if (!maildata) {
    throw ApiError(400, "Email not sent");
  }
  res.json({ message: "Verification email sent." });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError(404, "User not found");
  }

  const resetToken = nanoid();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await User.findByIdAndUpdate(user._id, {
    ...user,
  });

  const maildata = await sendMail({
    email: user.email,
    path: "reset-password",
    verificationToken: resetToken,
    text: "You requested a password reset. Click the link to reset your password.",
  });
  if (!maildata) {
    throw ApiError(400, "Email not sent");
  }

  res.json({ message: "Password reset link sent to email" });
};

const resetPassword = async (req: Request, res: Response) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: resetToken,
  });

  if (!user) {
    throw ApiError(400, "Invalid reset token");
  }
  if (user.resetPasswordExpires < Date.now()) {
    throw ApiError(400, "Expired reset token");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = "";
  user.resetPasswordExpires = 0;
  await User.findByIdAndUpdate(user._id, {
    ...user,
  });

  res.json({ message: "Password successfully reset" });
};

const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw ApiError(401, "Old password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(user._id, {
    ...user,
  });

  res.json({ message: "Password successfully changed" });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
  getVerification: ctrlWrapper(getVerification),
  resendVerify: ctrlWrapper(resendVerify),
  forgotPassword: ctrlWrapper(forgotPassword),
  resetPassword: ctrlWrapper(resetPassword),
  changePassword: ctrlWrapper(changePassword),
};
