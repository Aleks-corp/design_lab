import "dotenv/config";
import axios from "axios";
import { IUser } from "src/types/user.type";
import User from "../models/user";
import { dateBegin } from "./setDate";
import { userSubscriptionConst } from "src/constants/usersConstants";
import { unsubscribeUser } from "./unsubscribeUser";

const requestType = "STATUS";
const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT || "";
const merchantPassword = process.env.WFP_MERCHANT_PASSWORD || "";
const WFP_API_URL =
  process.env.WFP_API_URL || "https://api.wayforpay.com/regularApi";

// How often an automatic (non-forced) status check is allowed per user.
const SUB_CHECK_THROTTLE_MS = 12 * 60 * 60 * 1000; // 12h

const toMsFromSeconds = (value?: string | number) => {
  if (value === undefined || value === null || value === "") return NaN;
  return parseInt(`${value}000`, 10);
};

const persist = async (user: IUser, patch: Record<string, unknown>) => {
  Object.assign(user, patch);
  await User.findByIdAndUpdate(user._id, patch);
};

/**
 * Recurring charge failed (not enough money on the card).
 * Cancel the WayForPay regular payment and drop the user to free,
 * keeping a reason so the profile can explain what happened.
 */
const cancelForInsufficientFunds = async (
  user: IUser,
  data: { lastPayedDate?: string }
) => {
  try {
    await unsubscribeUser(user);
  } catch (error) {
    console.error("Failed to REMOVE WayForPay regular payment:", error);
  }

  const lastPayedMs = toMsFromSeconds(data.lastPayedDate);
  await persist(user, {
    subscription: userSubscriptionConst.FREE,
    status: "Removed",
    subCancelReason: "insufficient_funds",
    lastPayedStatus: "Declined",
    lastPayedDate: isNaN(lastPayedMs) ? new Date() : new Date(lastPayedMs),
    subend: null,
    orderReference: "",
    lastSubCheck: new Date(),
  });
};

const applyWfpStatus = async (
  user: IUser,
  data: {
    status?: string;
    lastPayedStatus?: string;
    lastPayedDate?: string;
    nextPaymentDate?: string;
    dateBegin?: string;
    amount?: number;
    mode?: string;
  }
) => {
  const now = Date.now();
  const patch: Record<string, unknown> = { lastSubCheck: new Date() };

  if (data.status === "Active") {
    if (data.lastPayedStatus === "Declined") {
      await cancelForInsufficientFunds(user, data);
      return;
    }

    if (data.lastPayedStatus === "Approved") {
      const nextMs = toMsFromSeconds(data.nextPaymentDate);
      const beginMs = toMsFromSeconds(data.dateBegin);
      const lastPayedMs = toMsFromSeconds(data.lastPayedDate);

      Object.assign(patch, {
        subscription: userSubscriptionConst.MEMBER,
        status: "Active",
        lastPayedStatus: "Approved",
        lastPayedDate: isNaN(lastPayedMs) ? new Date() : new Date(lastPayedMs),
        amount: data.amount,
        mode: data.mode,
        subCancelReason: null,
        subend: isNaN(nextMs)
          ? new Date(now + 30 * 24 * 60 * 60 * 1000)
          : new Date(nextMs),
        substart: isNaN(beginMs) ? user.substart : dateBegin(beginMs),
      });
      await persist(user, patch);
      return;
    }

    // Active subscription, payment status not conclusive — keep as is.
    await persist(user, patch);
    return;
  }

  if (
    data.status === "Suspended" ||
    data.status === "Removed" ||
    data.status === "Completed" ||
    data.status === "Created"
  ) {
    Object.assign(patch, {
      subscription: userSubscriptionConst.FREE,
      status: data.status,
    });
    if (data.status === "Removed" || data.status === "Completed") {
      Object.assign(patch, { lastPayedStatus: "", lastPayedDate: null });
    }
    await persist(user, patch);
    return;
  }

  // Unknown / empty status — stop tracking this order.
  Object.assign(patch, {
    subscription: userSubscriptionConst.FREE,
    orderReference: "",
  });
  await persist(user, patch);
};

export const checkSubscriptionStatus = async (user: IUser, force = false) => {
  if (user.subscription === userSubscriptionConst.ADMIN) {
    return user;
  }
  if (!user.orderReference) {
    return user;
  }

  const now = Date.now();

  // Registration trial expiry — purely local, no WayForPay call needed.
  if (
    user.subscription === userSubscriptionConst.SALE &&
    user.orderReference === "registrationSale" &&
    user.subend &&
    now > user.subend.getTime()
  ) {
    await persist(user, {
      subscription: userSubscriptionConst.FREE,
      orderReference: "",
      substart: null,
      subend: null,
    });
    return user;
  }

  // Throttle automatic checks so a WayForPay request does not fire on every
  // authenticated API call. Admin-triggered checks pass force = true.
  if (
    !force &&
    user.lastSubCheck &&
    now - new Date(user.lastSubCheck).getTime() < SUB_CHECK_THROTTLE_MS
  ) {
    return user;
  }

  const needsRemoteCheck =
    !user.subend ||
    now > user.subend.getTime() ||
    user.lastPayedStatus === "Declined";

  if (!needsRemoteCheck) {
    // Active member with a valid next-payment date — nothing to verify,
    // just record that we looked.
    await persist(user, { lastSubCheck: new Date() });
    return user;
  }

  try {
    const { data } = await axios.post(
      WFP_API_URL,
      {
        requestType,
        merchantAccount,
        merchantPassword,
        orderReference: user.orderReference,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    await applyWfpStatus(user, data);
  } catch (error) {
    console.error("Error checking WayForPay subscription:", error);
  }

  return user;
};
