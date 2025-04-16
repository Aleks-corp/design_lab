import "dotenv/config";
import axios from "axios";
import { IUser } from "src/types/user.type";
import User from "../models/user";
import { dateBegin } from "./setDate";
import { userSubscriptionConst } from "src/constants/usersConstants";

const requestType = "STATUS";
const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT || "";
const merchantPassword = process.env.WFP_MERCHANT_PASSWORD || "";
const WFP_API_URL =
  process.env.WFP_API_URL || "https://api.wayforpay.com/regularApi";

export const checkSubscriptionStatus = async (user: IUser) => {
  if (user.subscription === userSubscriptionConst.ADMIN) {
    return user;
  }
  if (!user.orderReference) {
    return user;
  }
  const newDateTime = new Date().getTime();
  if (
    user.subscription === userSubscriptionConst.SALE &&
    user.orderReference === "registrationSale" &&
    user.subend &&
    newDateTime > user.subend.getTime()
  ) {
    user.subscription = userSubscriptionConst.FREE;
    user.orderReference = "";
    user.substart = null;
    user.subend = null;
    await User.findByIdAndUpdate(user._id, {
      subscription: user.subscription,
      orderReference: user.orderReference,
      subend: user.subend,
      substart: user.substart,
    });
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
        if (data.lastPayedStatus === "Declined") {
          user.subscription = userSubscriptionConst.FREE;
        }
        if (data.lastPayedStatus === "Approved") {
          user.subscription = userSubscriptionConst.MEMBER;
        }
        user.lastPayedStatus = data.lastPayedStatus;
        user.lastPayedDate = new Date(parseInt(data.lastPayedDate + "000"));
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
          lastPayedStatus: user.lastPayedStatus,
          lastPayedDate: user.lastPayedDate,
        });
        return user;
      }
      if (data.status === "Created") {
        user.subscription = userSubscriptionConst.FREE;
        user.status = data.status;
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      } else {
        user.subscription = userSubscriptionConst.FREE;
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
  if (user.subend && newDateTime > user.subend.getTime()) {
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
        if (data.lastPayedStatus === "Declined") {
          user.subscription = userSubscriptionConst.FREE;
        }
        if (data.lastPayedStatus === "Approved") {
          user.subscription = userSubscriptionConst.MEMBER;
        }
        user.lastPayedStatus = data.lastPayedStatus;
        user.lastPayedDate = new Date(parseInt(data.lastPayedDate + "000"));
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
          lastPayedStatus: user.lastPayedStatus,
          lastPayedDate: user.lastPayedDate,
        });
        return user;
      }
      if (data.status === "Suspended") {
        user.subscription = userSubscriptionConst.FREE;
        user.status = "Suspended";
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      }
      if (data.status === "Removed") {
        user.subscription = userSubscriptionConst.FREE;
        user.status = "Removed";
        user.lastPayedStatus = "";
        user.lastPayedDate = null;
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
          lastPayedDate: user.lastPayedDate,
          lastPayedStatus: user.lastPayedStatus,
        });
        return user;
      }
      if (data.status === "Completed") {
        user.subscription = userSubscriptionConst.FREE;
        user.status = "Completed";
        user.lastPayedStatus = "";
        user.lastPayedDate = null;
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
          lastPayedDate: user.lastPayedDate,
          lastPayedStatus: user.lastPayedStatus,
        });
        return user;
      }
      if (data.status === "Created") {
        user.subscription = userSubscriptionConst.FREE;
        user.status = "Created";
        await User.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      }
      if (!data.status) {
        user.subscription = userSubscriptionConst.FREE;
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
  }
  if (user.lastPayedStatus === "Declined") {
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
        if (data.lastPayedStatus === "Declined") {
          user.subscription = userSubscriptionConst.FREE;
        }
        if (data.lastPayedStatus === "Approved") {
          user.subscription = userSubscriptionConst.MEMBER;
        }
        user.lastPayedStatus = data.lastPayedStatus;
        user.lastPayedDate = new Date(parseInt(data.lastPayedDate + "000"));
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
          lastPayedStatus: user.lastPayedStatus,
          lastPayedDate: user.lastPayedDate,
        });
        return user;
      }
    } catch (error) {
      console.error("Error checking WayForPay subscription:", error);
    }
    return user;
  }
  return user;
};
