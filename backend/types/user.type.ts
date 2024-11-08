import { ObjectId } from "mongoose";

export interface IUser {
  _id: string | ObjectId;
  email: string;
  password: string;
  subscription: "free" | "member" | "admin";
  token?: string;
  verificationToken: string;
  verify: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserReg {
  email: string;
  password: string;
  verify_token: string;
}
