import { ApiError } from "../helpers/index.js";
import { NextFunction, Request, Response } from "express";

const isEmptyBody = (req: Request, res: Response, next: NextFunction) => {
  if (!Object.keys(req.body).length) {
    next(ApiError(400, "Missing fields"));
  }
  next();
};

export default isEmptyBody;
