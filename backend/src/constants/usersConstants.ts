import { UserSubscription } from "src/types/user.type";

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

export const emailRegexp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

// export const passRegexp = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/; not  correct
export const passRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export default { userSubscription, emailRegexp };
