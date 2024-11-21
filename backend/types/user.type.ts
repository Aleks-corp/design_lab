import { ObjectId } from "mongoose";

export interface IUser {
  _id: string | ObjectId;
  name: string;
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
  name: string;
  email: string;
  password: string;
  verify_token: string;
}
