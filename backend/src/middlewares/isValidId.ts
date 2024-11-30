import { isValidObjectId } from "mongoose";
import { ApiError } from "../helpers/index";
import { NextFunction, Request, Response } from "express";

const isValidId = (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    next(ApiError(400, `${postId} is not valid id`));
  }
  next();
};
export default isValidId;
