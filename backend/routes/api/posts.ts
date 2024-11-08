import express from "express";
import {
  isEmptyBody,
  isEmptyBodyStatus,
  isValidId,
  authenticateToken,
} from "../../middlewares/index";
import { validateBody } from "../../decorators/index";
import { postSchemas } from "../../schemas/index";
import { postController } from "../../controllers/index";

const { getAllPosts, getPostById, addPost, deletePostById, updateStatusPost } =
  postController;
const { postAddSchema, postUpdateStatusSchema } = postSchemas;

const postsRouter = express.Router();

postsRouter.use(authenticateToken);

postsRouter.get("/", getAllPosts);
postsRouter.get("/:postId", isValidId, getPostById);
postsRouter.post("/", isEmptyBody, validateBody(postAddSchema), addPost);
postsRouter.patch(
  "/:postId/favorite",
  isValidId,
  isEmptyBodyStatus,
  validateBody(postUpdateStatusSchema),
  updateStatusPost
);
postsRouter.delete("/:postId", isValidId, deletePostById);

export default postsRouter;
