import express from "express";
import {
  isEmptyBody,
  isEmptyBodyStatus,
  isValidId,
  authenticateToken,
  authenticateUser,
} from "../../middlewares/index";
import { validateBody } from "../../decorators/index";
import { postSchemas } from "../../schemas/index";
import { postController } from "../../controllers/index";

const {
  getAllPosts,
  getPostById,
  checkDownload,
  addPost,
  deletePostById,
  updateStatusPost,
  postPresignedUrl,
} = postController;
const { postAddSchema, postUpdateStatusSchema } = postSchemas;

const postsRouter = express.Router();

// postsRouter.use(authenticateToken);

postsRouter.get("/", authenticateUser, getAllPosts);
postsRouter.get("/:postId", authenticateUser, isValidId, getPostById);
postsRouter.get(
  "/check-download/:postId",
  authenticateToken,
  isValidId,
  checkDownload
);
postsRouter.post("/generate-presigned-url", authenticateUser, postPresignedUrl);
postsRouter.post(
  "/",
  authenticateToken,
  isEmptyBody,
  validateBody(postAddSchema),
  addPost
);
postsRouter.patch(
  "/",
  authenticateUser,
  isEmptyBodyStatus,
  validateBody(postUpdateStatusSchema),
  updateStatusPost
);
postsRouter.delete("/:postId", authenticateToken, isValidId, deletePostById);

export default postsRouter;
