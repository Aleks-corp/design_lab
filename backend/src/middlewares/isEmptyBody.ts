import { ApiError } from "../helpers/index.js";
import { NextFunction, Request, Response } from "express";

const isEmptyBody = (req: Request, res: Response, next: NextFunction) => {
  if (!Object.keys(req.body).length) {
    return next(ApiError(400, "Missing fields"));
  } else {
    next();
  }
};

export default isEmptyBody;
