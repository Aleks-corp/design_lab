import "dotenv/config";
import axios from "axios";
import { IUser } from "src/types/user.type";
import User from "../models/user";
import { dateBegin } from "./setDate";

const requestType = "STATUS";
const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT || "";
const merchantPassword = process.env.WFP_MERCHANT_PASSWORD || "";
const WFP_API_URL =
  process.env.WFP_API_URL || "https://api.wayforpay.com/regularApi";

export const checkSubscriptionStatus = async (user: IUser) => {
  if (user.subscription === "admin") {
    return user;
  }
  if (!user.orderReference) {
    return user;
  }
  if (user.orderReference && !user.subend) {
    const payload = {
      requestType,
      merchantAccount,
      merchantPassword,
      orderReference: user.orderReference,
    };
    try {
      const { data } = await axios.post(WFP_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (data.status === "Active") {
        user.subscription = "member";
        user.status = data.status;
        user.amount = data.amount;
        user.mode = data.mode;
        if (data.nextPaymentDate) {
          user.subend = new Date(parseInt(data.nextPaymentDate + "000"));
        } else {
          user.subend = new Date(
            user.subend.setMonth(user.subend.getMonth() + 1)
          );
        }
        user.substart = dateBegin(parseInt(data.dateBegin + "000"));
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
          subend: user.subend,
          substart: user.substart,
          amount: user.amount,
          mode: user.mode,
        });
        return user;
      }
      if (data.status === "Created") {
        user.subscription = "free";
        user.status = data.status;
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      } else {
        user.subscription = "free";
        user.orderReference = "";
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          orderReference: user.orderReference,
        });
        return user;
      }
    } catch (error) {
      console.error("Error checking WayForPay subscription:", error);
    }
    return user;
  }
  const newDate = new Date();
  if (user.subend && newDate.getTime() > user.subend.getTime()) {
    const payload = {
      requestType,
      merchantAccount,
      merchantPassword,
      orderReference: user.orderReference,
    };
    try {
      const { data } = await axios.post(WFP_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.status === "Active") {
        user.subscription = "member";
        user.status = data.status;
        user.amount = data.amount;
        user.mode = data.mode;
        if (data.nextPaymentDate) {
          user.subend = new Date(parseInt(data.nextPaymentDate + "000"));
        } else {
          user.subend = new Date(
            user.subend.setMonth(user.subend.getMonth() + 1)
          );
        }
        user.substart = dateBegin(parseInt(data.dateBegin + "000"));
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
          subend: user.subend,
          substart: user.substart,
          amount: user.amount,
          mode: user.mode,
        });
        return user;
      }
      if (data.status === "Suspended") {
        user.subscription = "free";
        user.status = "Suspended";
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      }
      if (data.status === "Removed") {
        user.subscription = "free";
        user.status = "Removed";
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      }
      if (data.status === "Completed") {
        user.subscription = "free";
        user.status = "Completed";
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      }
      if (data.status === "Created") {
        user.subscription = "free";
        user.status = "Created";
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      }
    } catch (error) {
      console.error("Error checking WayForPay subscription:", error);
    }
  }
  return user;
};
