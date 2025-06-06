import { NextFunction, Response, Request } from "express";
import { ApiError } from "../helpers/index";

const checkIfUserBlocked = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.isBlocked) {
    throw ApiError(
      403,
      "Your account has been blocked. Please contact support."
    );
  }
  next();
};

export default checkIfUserBlocked;
