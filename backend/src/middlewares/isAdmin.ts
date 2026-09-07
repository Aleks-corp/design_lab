import { NextFunction, Response, Request } from "express";
import { ApiError } from "../helpers/index";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.subscription !== "admin") {
    return next(ApiError(403, "Admin access required"));
  }
  next();
};

export default isAdmin;
