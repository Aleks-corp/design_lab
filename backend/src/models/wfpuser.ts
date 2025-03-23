import { Schema, model, Model } from "mongoose";
import { handleUpdateValidator, handlerSaveError } from "./hooks";

import { IWFPUser } from "../types/wfpuser.type";

type IWFPUserModelType = Model<IWFPUser>;

const wfpUserSchema = new Schema<IWFPUser, IWFPUserModelType>(
  {
    PaymentOrder: { type: String },
    PaymentTime: { type: Date },
    Sum: { type: String },
    Currency: { type: String },
    Periodicity: { type: String },
    Card: { type: String },
    Product: { type: String },
    Email: { type: String },
    Phone: { type: String },
    Telegram: { type: String },
    ExpirationDate: { type: Date },
    Status: { type: String },
  },
  { versionKey: false, timestamps: true }
);

wfpUserSchema.post("save", handlerSaveError);

wfpUserSchema.pre("findOneAndUpdate", handleUpdateValidator);
wfpUserSchema.post("findOneAndUpdate", handlerSaveError);

const WFPUser = model<IWFPUser, IWFPUserModelType>("wfpuser", wfpUserSchema);
export default WFPUser;
