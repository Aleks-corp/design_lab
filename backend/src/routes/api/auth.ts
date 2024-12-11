import express from "express";

import { authController } from "../../controllers/index";
import { usersSchemas } from "../../schemas/index";
import { validateBody } from "../../decorators/index";
import { authenticateToken } from "../../middlewares/index";

const {
  usersRegSchema,
  usersLoginSchema,
  usersUpdateSubscriptionSchema,
  usersVerifySchema,
  passwordResetSchema,
  changePasswordSchema,
} = usersSchemas;

const {
  register,
  login,
  logout,
  getCurrent,
  updateUserSubscription,
  getVerification,
  resendVerify,
  forgotPassword,
  resetPassword,
  changePassword,
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

authRouter.patch(
  "/",
  authenticateToken,
  validateBody(usersUpdateSubscriptionSchema),
  updateUserSubscription
);

export default authRouter;
