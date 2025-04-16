import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { nanoid } from "nanoid";
import { IUser, IUserReg } from "src/types/user.type";
import User from "../models/user";
import { ApiError, sendMail } from "src/helpers/index";
import { userSubscriptionConst } from "src/constants/usersConstants";
import { checkSubscriptionStatus } from "src/helpers/CheckSubscriptionStatus";
import { amountData } from "src/constants/amountData";
import { ObjectId } from "mongoose";
import { nextDate } from "src/helpers/setDate";
import { unsubscribeUser } from "src/helpers/unsubscribeUser";

const {
  JWT_SECRET,
  WFP_SECRET_KEY,
  WFP_MERCHANT_ACCOUNT,
  WFP_MERCHANT_DOMAIN_NAME,
  VITE_BASE_URL,
} = process.env;

export const registerService = async ({
  name,
  email,
  password,
  phone,
  orderReference,
  regularDateEnd,
  substart,
  subend,
  subscription,
}: IUserReg) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const emailText =
      subscription === userSubscriptionConst.SALE
        ? "Thank you for signing up! To complete your registration, please verify your email address by clicking the button below. As a new user, you will receive <strong>3 days of Limit Premium access</strong> after verification."
        : "Thank you for signing up! To complete your registration, please verify your email address by clicking the button below.";

    await User.create({
      name,
      email,
      phone,
      orderReference,
      regularDateEnd,
      substart,
      subend,
      subscription,
      password: hashPassword,
      verificationToken,
    });
    const maildata = await sendMail({
      email,
      verificationToken,
      path: "verify",
      text: emailText,
    });
    if (!maildata) {
      throw ApiError(400, "Email not sent");
    }
  } catch (error) {
    throw ApiError(400);
  }
};
export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "333h",
    });
    await User.findByIdAndUpdate(user._id, { token });
    return { token, updatedUser };
  } catch (error) {
    throw ApiError(400);
  }
};

export const logoutService = async (_id: ObjectId) => {
  try {
    const user = await User.findById(_id);
    if (!user) {
      throw ApiError(401, "User not found");
    }
    await User.findByIdAndUpdate(_id, { token: "" });
    return { message: "Logout successful" };
  } catch (error) {
    throw ApiError(400);
  }
};

export const verificationService = async (verificationToken: string) => {
  try {
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
    return { message: "Verification has been passed" };
  } catch (error) {
    throw ApiError(400);
  }
};

export const resendVerifyService = async (email: string) => {
  try {
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
    return { message: "Verification email sent" };
  } catch (error) {
    throw ApiError(400);
  }
};

export const forgotPasswordService = async (email: string) => {
  try {
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
  } catch (error) {
    throw ApiError(400);
  }
  return { message: "Password reset link sent to email" };
};

export const resetPasswordService = async ({
  resetToken,
  newPassword,
}: {
  resetToken: string;
  newPassword: string;
}) => {
  try {
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
    return { message: "Password reset successful" };
  } catch (error) {
    throw ApiError(400);
  }
};

export const changePasswordService = async ({
  oldPassword,
  newPassword,
  userId,
}: {
  oldPassword: string;
  newPassword: string;
  userId: ObjectId;
}) => {
  try {
    const user = await User.findById(userId);

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
    return { message: "Password successfully changed" };
  } catch {
    throw ApiError(400);
  }
};

export const createPaymentService = async ({
  data,
  userId,
}: {
  data: PaymentData;
  userId: ObjectId;
}) => {
  try {
    if (!userId) {
      throw ApiError(401, "Please login first");
    }
    await User.findByIdAndUpdate(userId, {
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
    return paymentData;
  } catch (error) {
    throw ApiError(400);
  }
};

export const paymentWebhookService = async (data: ResponseData) => {
  try {
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
          subscription: userSubscriptionConst.MEMBER,
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
    return responseData;
  } catch (error) {
    throw ApiError(400);
  }
};

export const unsubscribeWebhookService = async (user: IUser) => {
  try {
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
      return updatedUser;
    }
  } catch (error) {
    throw ApiError(400);
  }
};
