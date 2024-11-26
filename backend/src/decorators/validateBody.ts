import { Schema } from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../helpers/index";

const validateBody = (schema: Schema) => {
  const func = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(ApiError(400, error.message));
    }
    next();
  };
  return func;
};

export default validateBody;
