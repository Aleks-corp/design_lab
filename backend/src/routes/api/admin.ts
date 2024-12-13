import express from "express";

import { usersSchemas } from "../../schemas/index";
import { validateBody } from "../../decorators/index";
import { authenticateToken } from "../../middlewares/index";
import adminController from "src/controllers/adminController";

const { usersUpdateSubscriptionSchema } = usersSchemas;
const { changeUser, getAllUser, getUnpublishedPosts, getUnpublishedPostById } =
  adminController;

const adminRouter = express.Router();
adminRouter.get("/users", authenticateToken, getAllUser);

adminRouter.patch(
  "/user/:userId",
  authenticateToken,
  validateBody(usersUpdateSubscriptionSchema),
  changeUser
);

adminRouter.get("/posts", authenticateToken, getUnpublishedPosts);

adminRouter.get("/post/:postId", authenticateToken, getUnpublishedPostById);

export default adminRouter;
