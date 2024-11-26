import { Request, Response, NextFunction } from "express";

export type CtrlFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const ctrlWrapper = (ctrl: CtrlFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default ctrlWrapper;
