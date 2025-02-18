import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import "dotenv/config";
import User from "../models/user";
import { ApiError, sendMail } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";
import crypto from "crypto";
import { nextDate } from "src/helpers/setDate";
import { amountData } from "src/constants/amountData";
import { checkSubscriptionStatus } from "src/helpers/CheckSubscriptionStatus";

const {
  JWT_SECRET,
  WFP_SECRET_KEY,
  WFP_MERCHANT_ACCOUNT,
  WFP_MERCHANT_DOMAIN_NAME,
  FRONT_SERVER,
  VITE_BASE_URL,
} = process.env;

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
  const updatedUser = await checkSubscriptionStatus(user);

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "333h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      subscription: updatedUser.subscription,
      status: updatedUser.status,
      regularDateEnd: updatedUser.regularDateEnd,
      substart: updatedUser.substart,
      subend: updatedUser.subend,
      createdAt: updatedUser.createdAt,
    },
  });
};

const logout = async (req: Request, res: Response) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const getCurrent = async (req: Request, res: Response) => {
  const {
    _id,
    name,
    email,
    subscription,
    status,
    substart,
    regularDateEnd,
    subend,
    createdAt,
  } = req.user;
  if (req.user) {
    res.json({
      _id,
      name,
      email,
      subscription,
      status,
      regularDateEnd,
      substart,
      subend,
      createdAt,
    });
  }
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
  });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "333h" });
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      status: user.status,
      regularDateEnd: user.regularDateEnd,
      substart: user.substart,
      subend: user.subend,
      createdAt: user.createdAt,
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

const createPayment = async (req: Request, res: Response) => {
  const { data }: PaymemtData = req.body;
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, {
    orderReference: data.orderReference,
  });
  const secretKey = WFP_SECRET_KEY;
  const merchantAccount = WFP_MERCHANT_ACCOUNT;
  const merchantDomainName = WFP_MERCHANT_DOMAIN_NAME;
  const string = [
    merchantAccount,
    merchantDomainName,
    data.orderReference,
    data.orderDate,
    amountData.amount,
    amountData.currency,
    ...amountData.productName,
    ...amountData.productCount,
    ...amountData.productPrice,
  ].join(";");
  const hmac = crypto.createHmac("md5", secretKey);
  hmac.update(string);

  const merchantSignature = hmac.digest("hex");
  const paymentData = {
    ...data,
    ...amountData,
    merchantAccount,
    merchantDomainName,
    merchantSignature,
    returnUrl: `${FRONT_SERVER}/payment-success`,
    serviceUrl: `${VITE_BASE_URL}/users/payment-webhook`,
  };
  res.json(paymentData);
};

const paymentWebhook = async (req: Request, res: Response) => {
  console.log("Webhook received:body", req.body); // Додаємо логування
  let data = req.body;

  const keys = Object.keys(data);
  if (keys.length === 1) {
    try {
      data = JSON.parse(keys[0]);
    } catch (error) {
      console.error("❌ Помилка парсингу вкладеного JSON:", error);
      res.status(400).json({ message: "Invalid nested JSON" });
      return;
    }
  }

  console.log("✅ Розпарсений data:", data); // Парсимо вкладений JSON

  if (!data || typeof data !== "object" || !data.orderReference) {
    console.error("❌ Помилка: відсутній orderReference", data);
    res.status(400).json({ message: "Missing orderReference" });
    return;
  }

  const merchantSecret = WFP_SECRET_KEY;
  const time = Math.floor(Date.now() / 1000);
  const responseData = {
    orderReference: data.orderReference,
    status: "accept",
    time: time,
    signature: crypto
      .createHmac("md5", merchantSecret)
      .update(`${data.orderReference};accept;${time}`)
      .digest("hex"),
  };

  console.log("✅ Відповідь мерчанту:", responseData); //log

  const { transactionStatus, orderReference, phone, regularDateEnd } = data;
  const arr = orderReference.split("-");
  if (transactionStatus === "Approved") {
    await User.findOneAndUpdate(
      { orderReference },
      {
        subscription: "member",
        phone,
        status: "Active",
        regularDateEnd,
        substart: new Date(parseInt(arr[1])),
        subend: nextDate(parseInt(arr[1])),
      }
    );
    console.log("✅ Оплата підтверджена для", orderReference); //Log
  }
  res.json(responseData);
};

const paymentStatus = async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);
  res.json({ subscription: user.subscription });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  getVerification: ctrlWrapper(getVerification),
  resendVerify: ctrlWrapper(resendVerify),
  forgotPassword: ctrlWrapper(forgotPassword),
  resetPassword: ctrlWrapper(resetPassword),
  changePassword: ctrlWrapper(changePassword),
  createPayment: ctrlWrapper(createPayment),
  paymentWebhook: ctrlWrapper(paymentWebhook),
  paymentStatus: ctrlWrapper(paymentStatus),
};
