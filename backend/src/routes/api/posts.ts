import express from "express";
import {
  isEmptyBody,
  isEmptyBodyStatus,
  isValidId,
  authenticateToken,
  authenticateUserExists,
  checkIfUserBlocked,
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
  updatePost,
} = postController;
const { postAddSchema, postUpdateStatusSchema, postUpdateSchema } = postSchemas;

const postsRouter = express.Router();

// postsRouter.use(authenticateToken);

postsRouter.get("/", authenticateUserExists, checkIfUserBlocked, getAllPosts);
postsRouter.get(
  "/:postId",
  authenticateUserExists,
  checkIfUserBlocked,
  isValidId,
  getPostById
);
postsRouter.get(
  "/check-download/:postId",
  authenticateToken,
  checkIfUserBlocked,
  isValidId,
  checkDownload 
);
postsRouter.patch(
  "/",
  authenticateToken,
  checkIfUserBlocked,
  isEmptyBodyStatus,
  validateBody(postUpdateStatusSchema),
  updateStatusPost
);
postsRouter.post(
  "/generate-presigned-url",
  authenticateToken,
  postPresignedUrl
);
postsRouter.post(
  "/",
  authenticateToken,
  isEmptyBody,
  validateBody(postAddSchema),
  addPost
);
postsRouter.patch(
  "/:postId",
  authenticateToken,
  isEmptyBody,
  isValidId,
  validateBody(postUpdateSchema),
  updatePost
);

postsRouter.delete("/:postId", authenticateToken, isValidId, deletePostById);

export default postsRouter;
