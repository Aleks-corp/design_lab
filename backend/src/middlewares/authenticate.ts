import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

import { NextFunction, Response, Request } from "express";
import { ctrlWrapper } from "../decorators/index";
import { ApiError } from "../helpers/index";
import User from "../models/user";

import { Document, ObjectId } from "mongoose";
import { IUser } from "../types/user.type";
import { checkSubscriptionStatus } from "src/helpers/CheckSubscriptionStatus";
import { resetLimitedDownload } from "src/helpers/checkDownloadPermission";

export interface UserDocument extends IUser, Document {
  _id: ObjectId;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw ApiError(401);
  }
  try {
    const jwtPayload: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = (await User.findById(jwtPayload.id)) as UserDocument;
    if (!user || !user.token) {
      throw ApiError(401);
    }
    if (user.subscription === "admin") {
      req.user = user;
      next();
    } else {
      const resetUser = await resetLimitedDownload(user);
      const updatedUser = await checkSubscriptionStatus(resetUser);
      req.user = updatedUser;
      next();
    }
  } catch {
    throw ApiError(401);
  }
};

export default ctrlWrapper(authenticateToken);
