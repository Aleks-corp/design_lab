import { Schema, model } from "mongoose";

import { handleUpdateValidator, handlerSaveError } from "./hooks.js";
import { emailRegexp, userSubscription } from "../constants/usersConstants.js";

const userSchema = new Schema(
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
      minlength: 8,
      maxlength: 16,
      required: true,
    },
    subscription: {
      type: String,
      enum: userSubscription,
      default: "free",
    },
    token: {
      type: String,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handlerSaveError);

userSchema.pre("findOneAndUpdate", handleUpdateValidator);
userSchema.post("findOneAndUpdate", handlerSaveError);

const User = model("user", userSchema);
export default User;
