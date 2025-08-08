import { ApiError } from "../helpers/index";
import { NextFunction, Request, Response } from "express";

const isEmptyBodyStatus = (req: Request, res: Response, next: NextFunction) => {
  if (!Object.keys(req.body).length) {
    return next(ApiError(400, "missing fields"));
  } else {
    next();
  }
};

export default isEmptyBodyStatus;
