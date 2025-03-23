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
import { unsubscribeUser } from "src/helpers/unsubscribeUser";
import { migrateFromOldBase } from "src/helpers/migrateFromOldBase";

const {
  JWT_SECRET,
  WFP_SECRET_KEY,
  WFP_MERCHANT_ACCOUNT,
  WFP_MERCHANT_DOMAIN_NAME,
  FRONT_SERVER,
  VITE_BASE_URL,
} = process.env;

const register = async (req: Request, res: Response) => {
  const { email, password, phone } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw ApiError(409, "Email in use. Please Sign In.");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const migrateUserData = await migrateFromOldBase({ email, phone });
  const orderReference = migrateUserData ? migrateUserData.PaymentOrder : "";
  const regularDateEnd =
    migrateUserData && migrateUserData.Status === "ACTIVE"
      ? migrateUserData.ExpirationDate
      : null;
  await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
    orderReference,
    regularDateEnd,
  });
  const maildata = await sendMail({
    email,
    verificationToken,
    path: "verify",
    text: "Thank you for signing up! To complete your registration, please verify your email address by clicking the button below.",
  });
  if (!maildata) {
    throw ApiError(400, "Email not sent");
  }
  res.status(201).json({ message: "Thank you for signing up" });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError(401, "Email or password not valid");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw ApiError(401, "Email or password not valid");
  }
  if (!user.verify) {
    throw ApiError(403, "Non verified user, please check email");
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
      phone: updatedUser.phone,
      subscription: updatedUser.subscription,
      status: updatedUser.status,
      regularDateEnd: updatedUser.regularDateEnd,
      lastPayedDate: updatedUser.lastPayedDate,
      lastPayedStatus: updatedUser.lastPayedStatus,
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
    phone,
    subscription,
    status,
    substart,
    regularDateEnd,
    lastPayedDate,
    lastPayedStatus,
    subend,
    createdAt,
  } = req.user;
  if (req.user) {
    res.json({
      _id,
      name,
      email,
      phone,
      subscription,
      status,
      regularDateEnd,
      lastPayedDate,
      lastPayedStatus,
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
    throw ApiError(400, "Verification has already been passed");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
  });
  res.json({ message: "Verification has been passed" });
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
    path: "verify",
    verificationToken: user.verificationToken,
    text: "Thank you for signing up! To complete your registration, please verify your email address by clicking the button below.",
  });
  if (!maildata) {
    throw ApiError(400, "Email not sent");
  }
  res.json({ message: "Verification email sent" });
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
    text: "You requested a password reset. Click the link below to set a new password.",
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
  const { data }: PaymentData = req.body;
  const { _id } = req.user;
  if (!_id) {
    throw ApiError(401, "Please login first");
  }
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
    returnUrl: `${VITE_BASE_URL}/users/payment-return`,
    serviceUrl: `${VITE_BASE_URL}/users/payment-webhook`,
  };
  res.json(paymentData);
};

const paymentWebhook = async (req: Request, res: Response) => {
  let data = req.body;

  const keys = Object.keys(data);
  if (keys.length === 1) {
    try {
      data = JSON.parse(keys[0]);
    } catch (error) {
      throw ApiError(400, "Invalid nested JSON");
    }
  }

  if (!data || typeof data !== "object" || !data.orderReference) {
    throw ApiError(400, "Missing orderReference");
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

  const { transactionStatus, orderReference, phone, regularDateEnd } = data;
  const arr = orderReference.split("-");
  if (transactionStatus === "Approved") {
    await User.findOneAndUpdate(
      { orderReference },
      {
        subscription: "member",
        phone,
        status: "Active",
        regularDateEnd: new Date(
          regularDateEnd.split(".").reverse().join(", ")
        ),
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

const unsubscribeWebhook = async (req: Request, res: Response) => {
  const user = req.user;
  const data = await unsubscribeUser(user);
  if (data instanceof Error) {
    throw ApiError(400, data.message);
  }
  if (data.reasonCode === 4100) {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        status: "Removed",
        regularDateEnd: null,
      },
      { new: true }
    );
    res.json(updatedUser);
    return;
  }
  res.json(user);
};
const paymentReturn = async (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Processing Payment</title>
    </head>
    <body>
        <h2>Processing your payment...</h2>
        <script>
            setTimeout(() => {
                window.location.href = "${FRONT_SERVER}/payment-success";
            }, 500);
        </script>
    </body>
    </html>
  `);
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
  unsubscribeWebhook: ctrlWrapper(unsubscribeWebhook),
  paymentReturn: ctrlWrapper(paymentReturn),
};
