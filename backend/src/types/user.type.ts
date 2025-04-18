import { ObjectId } from "mongoose";

export type UserSubscription = "free" | "sale" | "member" | "admin";

export interface IUser {
  _id: string | ObjectId;
  name: string;
  email: string;
  phone?: string;
  subscription: UserSubscription;
  status?: string;
  amount?: number;
  mode?: string;
  password: string;
  ip: string;
  orderReference: string;
  regularDateEnd?: Date;
  lastPayedStatus?: string;
  lastPayedDate?: Date;
  substart: Date;
  subend: Date;
  dailyDownloadCount?: number;
  lastDownloadReset?: Date;
  token?: string;
  verificationToken: string;
  verify: boolean;
  resetPasswordToken: string;
  resetPasswordExpires: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserReg {
  name: string;
  email: string;
  password: string;
  phone: string;
  ip: string;
}

export interface IUserLog {
  email: string;
  password: string;
}
