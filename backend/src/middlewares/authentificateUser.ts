import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

import { NextFunction, Response, Request } from "express";
import { ctrlWrapper } from "../decorators/index";
import { ApiError } from "../helpers/index";
import User from "../models/user";

import { Document, ObjectId } from "mongoose";
import { IUser } from "../types/user.type";

export interface UserDocument extends IUser, Document {
  _id: ObjectId;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer === "Bearer" && token) {
    try {
      const jwtPayload: JwtPayload = jwt.verify(
        token,
        JWT_SECRET
      ) as JwtPayload;
      const user = (await User.findById(jwtPayload.id)) as UserDocument;
      if (user && user.token) {
        req.user = user;
      }
      next();
    } catch {
      throw ApiError(401);
    }
  }
};

export default ctrlWrapper(authenticateUser);
