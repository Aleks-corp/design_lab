import "dotenv/config";
import User from "../models/user";
import { ApiError } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";

import { migrateFromOldBase } from "src/helpers/migrateFromOldBase";
import { registrationSale } from "src/helpers/registrationSale";
import { userSubscriptionConst } from "src/constants/usersConstants";
import {
  changePasswordService,
  createPaymentService,
  forgotPasswordService,
  loginService,
  logoutService,
  paymentWebhookService,
  registerService,
  resendVerifyService,
  resetPasswordService,
  unsubscribeWebhookService,
  verificationService,
} from "src/services/authService";
import { ObjectId } from "mongoose";
import { IUser } from "src/types/user.type";

const { FRONT_SERVER } = process.env;

const register = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw ApiError(409, "Email in use. Please Sign In.");
  }
  const migrateUserData = await migrateFromOldBase({ email, phone });
  const registerSale = registrationSale();

  await registerService({
    name,
    email,
    password,
    phone,
    orderReference: migrateUserData
      ? migrateUserData.PaymentOrder
      : registerSale.orderReference,
    regularDateEnd:
      migrateUserData && migrateUserData.Status === "ACTIVE"
        ? migrateUserData.ExpirationDate
        : null,
    substart: migrateUserData ? null : registerSale.substart,
    subend: migrateUserData ? null : registerSale.subend,
    subscription: migrateUserData
      ? userSubscriptionConst.FREE
      : userSubscriptionConst.SALE,
  });

  res.status(201).json({ message: "Thank you for signing up" });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, updatedUser } = await loginService({ email, password });

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
      dailyDownloadCount: updatedUser.dailyDownloadCount,
      createdAt: updatedUser.createdAt,
    },
  });
};

const logout = async (req: Request, res: Response) => {
  const { _id } = req.user;
  const message = await logoutService(_id as ObjectId);
  res.status(204).json(message);
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
    dailyDownloadCount,
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
      dailyDownloadCount,
      createdAt,
    });
  }
};

const getVerification = async (req: Request, res: Response) => {
  const { verificationToken } = req.params;
  const message = await verificationService(verificationToken);
  res.json(message);
};

const resendVerify = async (req: Request, res: Response) => {
  const { email } = req.body;
  const message = await resendVerifyService(email);
  res.json(message);
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const message = await forgotPasswordService(email);
  res.json(message);
};

const resetPassword = async (req: Request, res: Response) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;
  const message = await resetPasswordService({ resetToken, newPassword });
  res.json(message);
};

const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id as ObjectId;
  const message = await changePasswordService({
    oldPassword,
    newPassword,
    userId,
  });
  res.json(message);
};

const createPayment = async (req: Request, res: Response) => {
  const { data }: { data: PaymentData } = req.body;
  const userId = req.user._id as ObjectId;
  const paymentData = await createPaymentService({ data, userId });
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
  const responseData = await paymentWebhookService(data);
  res.json(responseData);
};

const paymentStatus = async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);
  res.json({ subscription: user.subscription });
};

const unsubscribeWebhook = async (req: Request, res: Response) => {
  const user = req.user;
  const updatedUser = await unsubscribeWebhookService(user);
  res.json(updatedUser);
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
