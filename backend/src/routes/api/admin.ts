import express from "express";

import { usersSchemas } from "../../schemas/index";
import { validateBody } from "../../decorators/index";
import { authenticateToken, isAdmin } from "../../middlewares/index";
import adminController from "src/controllers/adminController";

const { usersUpdateSubscriptionSchema, usersCheckSubscriptionSchema } =
  usersSchemas;
const {
  getAllUser,
  updateUsersSubscription,
  updateUserSubscription,
  getUnpublishedPosts,
  getUnpublishedPostById,
  checkUsersSubscription,
  getMessageToSprt,
  updateUserBlockStatus,
} = adminController;

const adminRouter = express.Router();

adminRouter.use(authenticateToken, isAdmin);

adminRouter.get("/users", getAllUser);

adminRouter.patch(
  "/user",
  validateBody(usersUpdateSubscriptionSchema),
  updateUserSubscription
);

adminRouter.patch("/users/status-blocked", updateUserBlockStatus);

adminRouter.patch(
  "/users",
  // validateBody(usersUpdateSubscriptionSchema),
  updateUsersSubscription
);

adminRouter.patch(
  "/users/status",
  validateBody(usersCheckSubscriptionSchema),
  checkUsersSubscription
);

adminRouter.get("/posts", getUnpublishedPosts);

adminRouter.get("/post/:postId", getUnpublishedPostById);
adminRouter.post("/message", getMessageToSprt);
export default adminRouter;
