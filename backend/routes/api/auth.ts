import express from "express";

import { authController } from "../../controllers/index";
import { usersSchemas } from "../../schemas/index";
import { validateBody } from "../../decorators/index";
import { authenticateToken } from "../../middlewares/index";

const { usersSchema, usersUpdateSubscriptionSchema, usersVerifySchema } =
  usersSchemas;

const {
  register,
  login,
  logout,
  getCurrent,
  updateUserSubscription,
  getVerification,
  resendVerify,
} = authController;

const authRouter = express.Router();

authRouter.post("/signup", validateBody(usersSchema), register);
authRouter.post("/login", validateBody(usersSchema), login);
authRouter.post("/logout", authenticateToken, logout);
authRouter.get("/current", authenticateToken, getCurrent);
authRouter.get("/verify/:verificationToken", getVerification);
authRouter.post("/verify", validateBody(usersVerifySchema), resendVerify);

authRouter.patch(
  "/",
  authenticateToken,
  validateBody(usersUpdateSubscriptionSchema),
  updateUserSubscription
);

export default authRouter;
