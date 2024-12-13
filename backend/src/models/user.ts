import { Schema, model, Model } from "mongoose";
import { handleUpdateValidator, handlerSaveError } from "./hooks";

import { emailRegexp, userSubscription } from "../constants/usersConstants";
import { IUser } from "../types/user.type";

type IUserModelType = Model<IUser>;

const userSchema = new Schema<IUser, IUserModelType>(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 12,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      match: [emailRegexp, "Please set a valid email address"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      enum: userSubscription,
      default: "free",
    },
    substart: {
      type: Number,
      default: null,
      required: function () {
        return this.subscription === "member";
      },
    },
    subend: {
      type: Number,
      default: null,
      required: function () {
        return this.subscription === "member";
      },
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
