import { Request } from "express";

export interface CustomUserRequest<T> extends Request {
  entity?: T;
}
