import { UserSubscription } from "../types/subscription.types";

export const emailRegexp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

export const passRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const phoneRegexp = /^\+\d+$/;

export const userSubscription: UserSubscription[] = [
  "free",
  "sale",
  "member",
  "admin",
];
export const userSubscriptionConst: Record<
  Uppercase<UserSubscription>,
  UserSubscription
> = {
  FREE: "free",
  SALE: "sale",
  MEMBER: "member",
  ADMIN: "admin",
};
