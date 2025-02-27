import express from "express";

import { authController } from "../../controllers/index";
import { usersSchemas } from "../../schemas/index";
import { validateBody } from "../../decorators/index";
import { authenticateToken } from "../../middlewares/index";

const {
  usersRegSchema,
  usersLoginSchema,
  usersVerifySchema,
  passwordResetSchema,
  changePasswordSchema,
} = usersSchemas;

const {
  register,
  login,
  logout,
  getCurrent,
  getVerification,
  resendVerify,
  forgotPassword,
  resetPassword,
  changePassword,
  createPayment,
  paymentWebhook,
  paymentStatus,
  unsubscribeWebhook,
  paymentReturn,
} = authController;

const authRouter = express.Router();

authRouter.post("/register", validateBody(usersRegSchema), register);
authRouter.post("/login", validateBody(usersLoginSchema), login);
authRouter.post("/logout", authenticateToken, logout);
authRouter.get("/current", authenticateToken, getCurrent);
authRouter.get("/verify/:verificationToken", getVerification);
authRouter.post("/verify", validateBody(usersVerifySchema), resendVerify);
authRouter.post(
  "/forgot-password",
  validateBody(usersVerifySchema),
  forgotPassword
);
authRouter.post(
  "/reset-password/:resetToken",
  validateBody(passwordResetSchema),
  resetPassword
);

authRouter.post(
  "/change-password",
  authenticateToken,
  validateBody(changePasswordSchema),
  changePassword
);

authRouter.post("/create-payment", authenticateToken, createPayment);
authRouter.post("/payment-webhook", paymentWebhook);
authRouter.post("/payment-return", paymentReturn);
authRouter.get("/payment-status", authenticateToken, paymentStatus);
authRouter.get("/unsubscribe", authenticateToken, unsubscribeWebhook);

export default authRouter;
