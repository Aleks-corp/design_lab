import { Schema, model, Model } from "mongoose";
import { handleUpdateValidator, handlerSaveError } from "./hooks";

import { emailRegexp, userSubscription } from "../constants/usersConstants";
import { IUser } from "../types/user.type";
import { userStatus } from "src/constants/statusConstant";

type IUserModelType = Model<IUser>;

const userSchema = new Schema<IUser, IUserModelType>(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 18,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      match: [emailRegexp, "Please set a valid email address"],
      required: true,
    },
    phone: { type: String },
    password: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      enum: userSubscription,
      default: "free",
    },
    status: { type: String, enum: userStatus },
    amount: { type: Number },
    mode: { type: String },
    regularDateEnd: { type: Date, default: null },
    substart: {
      type: Date,
      default: null,
      required: function () {
        return this.subscription === "member";
      },
    },
    subend: {
      type: Date,
      default: null,
      required: function () {
        return this.subscription === "member";
      },
    },
    orderReference: {
      type: String,
    },
    token: {
      type: String,
    },
    verificationToken: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handlerSaveError);

userSchema.pre("findOneAndUpdate", handleUpdateValidator);
userSchema.post("findOneAndUpdate", handlerSaveError);

const User = model<IUser, IUserModelType>("user", userSchema);
export default User;
