import "dotenv/config";
import axios from "axios";
import { IUser } from "src/types/user.type";
import User from "../models/user";
import { dateBegin } from "./setDate";

const WFP_MERCHANT_ACCOUNT = process.env.WFP_MERCHANT_ACCOUNT || "";
const WFP_MERCHANT_PASSWORD = process.env.WFP_MERCHANT_PASSWORD || "";
const WFP_API_URL =
  process.env.WFP_API_URL || "https://api.wayforpay.com/regularApi";

export const checkSubscriptionStatus = async (user: IUser) => {
  if (!user.orderReference) return;

  const requestType = "STATUS";
  const payload = {
    requestType,
    merchantAccount: WFP_MERCHANT_ACCOUNT,
    merchantPassword: WFP_MERCHANT_PASSWORD,
    orderReference: user.orderReference,
  };

  try {
    const { data } = await axios.post(WFP_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("data:", data);

    if (data.status === "Active" && data.nextPaymentDate) {
      user.subscription = "member";
      user.subend = new Date(parseInt(data.nextPaymentDate + "000"));
      user.substart = dateBegin(parseInt(data.dateBegin + "000"));
      await User.findByIdAndUpdate(user._id, {
        subscription: user.subscription,
        subend: user.subend,
        substart: user.substart,
      });
    } else {
      user.subscription = "free";
      await User.findByIdAndUpdate(user._id, { subscription: "free" });
    }
  } catch (error) {
    console.error("Error checking WayForPay subscription:", error);
  }
  return user;
};
