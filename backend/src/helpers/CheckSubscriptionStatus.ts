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
 * A recurring charge failed (expired card, insufficient funds, etc).
 * We cut premium access immediately, but deliberately do NOT cancel the
 * WayForPay regular payment order ourselves — WayForPay keeps retrying the
 * charge automatically for a while, and the order can still be "Active" on
 * their side even though the last attempt was declined. If a later retry
 * succeeds, the next Approved webhook/poll restores the user automatically
 * with no action needed. Only an explicit user "renew" action
 * (renewSubscriptionService) cancels the old order and starts a new one.
 */
export const recordDeclinedPayment = async (
  user: IUser,
  data: {
    lastPayedDate?: string;
    reasonCode?: string | number;
    reason?: string;
  }
) => {
  const isNewStreak = user.lastPayedStatus !== "Declined";
  const lastPayedMs = toMsFromSeconds(data.lastPayedDate);
  const parsedReasonCode =
    data.reasonCode !== undefined && data.reasonCode !== null && data.reasonCode !== ""
      ? Number(data.reasonCode)
      : null;

  const patch: Record<string, unknown> = {
    lastPayedStatus: "Declined",
    lastPayedDate: isNaN(lastPayedMs) ? new Date() : new Date(lastPayedMs),
    declineReasonCode:
      parsedReasonCode !== null && !isNaN(parsedReasonCode)
        ? parsedReasonCode
        : user.declineReasonCode ?? null,
    declineReason: data.reason ?? user.declineReason ?? null,
    declineAttempts: isNewStreak ? 1 : (user.declineAttempts || 0) + 1,
    declineFirstAt: isNewStreak ? new Date() : user.declineFirstAt ?? new Date(),
    lastSubCheck: new Date(),
  };

  // Only cut access when this was a renewal failure for an already-paying
  // member. A declined first-time upgrade attempt (from "free"/"sale") must
  // not touch an unrelated trial — there is no paid access to revoke yet.
  if (user.subscription === userSubscriptionConst.MEMBER) {
    patch.subscription = userSubscriptionConst.FREE;
  }

  await persist(user, patch);
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
    reasonCode?: string | number;
    reason?: string;
  }
) => {
  const now = Date.now();
  const patch: Record<string, unknown> = { lastSubCheck: new Date() };

  if (data.status === "Active") {
    if (data.lastPayedStatus === "Declined") {
      await recordDeclinedPayment(user, data);
      return;
    }

    // status "Active" + lastPayedStatus "Approved" is the normal case for a
    // renewal. A freshly created regular order whose first charge went
    // through as the initial one-time purchase (not yet a "regular"
    // auto-charge) reports lastPayedStatus as null/undefined here — WFP's
    // own recurring engine simply hasn't ticked yet, dateBegin/
    // nextPaymentDate point at the *upcoming* cycle. Either way, "Active"
    // and not explicitly "Declined" means paid and in good standing.
    const nextMs = toMsFromSeconds(data.nextPaymentDate);
    const beginMs = toMsFromSeconds(data.dateBegin);
    const lastPayedMs = toMsFromSeconds(data.lastPayedDate);

    Object.assign(patch, {
      subscription: userSubscriptionConst.MEMBER,
      status: "Active",
      lastPayedStatus: data.lastPayedStatus || "Approved",
      lastPayedDate: isNaN(lastPayedMs) ? new Date() : new Date(lastPayedMs),
      amount: data.amount,
      mode: data.mode,
      subCancelReason: null,
      declineReasonCode: null,
      declineReason: null,
      declineAttempts: 0,
      declineFirstAt: null,
      subend: isNaN(nextMs)
        ? new Date(now + 30 * 24 * 60 * 60 * 1000)
        : new Date(nextMs),
      substart: isNaN(beginMs) ? user.substart : dateBegin(beginMs),
    });
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
