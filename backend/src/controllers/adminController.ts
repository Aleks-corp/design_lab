import "dotenv/config";
import User from "../models/user";
import { ApiError } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";
import Post from "src/models/post";

const getAllUser = async (req: Request, res: Response) => {
  const { page = "1", limit = "50", filter = "" } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const query = filter ? { subscription: filter } : {};

  const users = await User.find(
    query,
    "_id name email subscription substart subend",
    {
      skip,
      limit: limitNumber,
    }
  );
  const totalHits = await User.countDocuments(query);

  res.json({ totalHits, users });
};

const changeUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const newUser = req.body;

  const user = await User.findByIdAndUpdate(userId, {
    ...newUser,
  });

  if (!user) {
    throw ApiError(400, "Invalid user id");
  }

  res.json({ message: "User successfully changed" });
};

const getUnpublishedPosts = async (req: Request, res: Response) => {
  const { page = "1", limit = "12" } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const currentTime = new Date();
  const query = { upload_at: { $gt: currentTime } };
  const posts = await Post.find(
    query,
    "-owner -createdAt -updatedAt -downloadlink",
    {
      skip,
      limit: limitNumber,
    }
  );
  const totalHits = await Post.countDocuments(query);

  res.json({ totalHits, posts });
};

const getUnpublishedPostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw ApiError(404);
  }
  res.json(post);
};

export default {
  changeUser: ctrlWrapper(changeUser),
  getAllUser: ctrlWrapper(getAllUser),
  getUnpublishedPosts: ctrlWrapper(getUnpublishedPosts),
  getUnpublishedPostById: ctrlWrapper(getUnpublishedPostById),
};
