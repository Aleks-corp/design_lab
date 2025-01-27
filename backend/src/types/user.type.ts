import { ObjectId } from "mongoose";

export interface IUser {
  _id: string | ObjectId;
  name: string;
  email: string;
  password: string;
  subscription: "free" | "member" | "admin";
  substart: Date;
  subend: Date;
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
  verify_token: string;
}

export interface IUserLog {
  email: string;
  password: string;
}
