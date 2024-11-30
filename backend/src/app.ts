import express, { NextFunction, Request, Response } from "express";
import { Err } from "./types/error.type";
import logger from "morgan";
import cors from "cors";

import postsRouter from "./routes/api/posts";
import authRouter from "./routes/api/auth";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());
app.use(express.static("public"));

app.use("/users", authRouter);
app.use("/posts", postsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error: Err, _: Request, res: Response, next: NextFunction): void => {
  if (!error.status) {
    error.status = 500;
  }
  const { status, message } = error;
  res.status(status).json({ message });
});

export default app;
