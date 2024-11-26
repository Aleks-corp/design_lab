import { isValidObjectId } from "mongoose";
import { ApiError } from "../helpers/index";
import { NextFunction, Request, Response } from "express";

const isValidId = (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(ApiError(400, `${contactId} is not valid id`));
  }
  next();
};
export default isValidId;
