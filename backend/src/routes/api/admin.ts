import express from "express";

// import { usersSchemas } from "../../schemas/index";
import { validateBody } from "../../decorators/index";
import { authenticateToken } from "../../middlewares/index";
import adminController from "src/controllers/adminController";

// const { usersUpdateSubscriptionSchema } = usersSchemas;
const {
  getAllUser,
  updateUsersSubscription,
  updateUserSubscription,
  getUnpublishedPosts,
  getUnpublishedPostById,
} = adminController;

const adminRouter = express.Router();
adminRouter.get("/users", authenticateToken, getAllUser);

adminRouter.patch(
  "/user",
  authenticateToken,
  // validateBody(usersUpdateSubscriptionSchema),
  updateUserSubscription
);

adminRouter.patch(
  "/users",
  authenticateToken,
  // validateBody(usersUpdateSubscriptionSchema),
  updateUsersSubscription
);

adminRouter.get("/posts", authenticateToken, getUnpublishedPosts);

adminRouter.get("/post/:postId", authenticateToken, getUnpublishedPostById);

export default adminRouter;
