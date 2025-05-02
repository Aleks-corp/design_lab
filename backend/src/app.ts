import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { Err } from "./types/error.type";
import cors from "cors";
import fs from "fs";
import path from "path";
import "dotenv/config";

import postsRouter from "./routes/api/posts";
import authRouter from "./routes/api/auth";
import adminRouter from "./routes/api/admin";
import dataRouter from "./routes/api/data";

const logPath = path.resolve("dist/logs");

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

const accessLogStream = fs.createWriteStream(path.join(logPath, "access.log"), {
  flags: "a",
});

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "combined";

app.use(morgan(formatsLogger, { stream: accessLogStream }));

app.use(
  cors({
    origin: [process.env.FRONT_SERVER, "https://secure.wayforpay.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json()); // для application/json
app.use(express.urlencoded({ extended: true })); // для application/x-www-form-urlencoded
app.use(express.static("public"));
app.use((req, res, next) => {
  console.log("📩 New Request:", req.method, req.url);
  next();
});

app.use("/users", authRouter);
app.use("/posts", postsRouter);
app.use("/admin", adminRouter);
app.use("/data", dataRouter);
app.get("/ping", (req, res) => {
  res.send("POST /pong");
});

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
