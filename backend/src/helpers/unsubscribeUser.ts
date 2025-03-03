import "dotenv/config";
import axios from "axios";
import { IUser } from "src/types/user.type";

const requestType = "REMOVE";
const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT || "";
const merchantPassword = process.env.WFP_MERCHANT_PASSWORD || "";
const WFP_API_URL =
  process.env.WFP_API_URL || "https://api.wayforpay.com/regularApi";

export const unsubscribeUser = async (user: IUser) => {
  const payload = {
    requestType,
    merchantAccount,
    merchantPassword,
    orderReference: user.orderReference,
  };
  try {
    const response = await axios.post(WFP_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error unsubscribe from WayForPay subscription:", error);
    return error;
  }
};
