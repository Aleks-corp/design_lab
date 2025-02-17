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
import { upload } from "../../middlewares/index";

const {
  getAllPosts,
  getPostById,
  addPost,
  deletePostById,
  updateStatusPost,
  postPresignedUrl,
} = postController;
const { postAddSchema, postUpdateStatusSchema } = postSchemas;

const postsRouter = express.Router();

// postsRouter.use(authenticateToken);

postsRouter.get("/", getAllPosts);
postsRouter.get("/:postId", authenticateUser, isValidId, getPostById);
postsRouter.post(
  "/generate-presigned-url",
  authenticateToken,
  postPresignedUrl
);
postsRouter.post(
  "/",
  authenticateToken,
  // upload,
  isEmptyBody,
  validateBody(postAddSchema),
  addPost
);
postsRouter.patch(
  "/",
  authenticateToken,
  isEmptyBodyStatus,
  validateBody(postUpdateStatusSchema),
  updateStatusPost
);
postsRouter.delete("/:postId", isValidId, deletePostById);

export default postsRouter;
