import Post from "../models/post";
import { ApiError, filterQuery } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";

const getAllPosts = async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...query } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const validQuery = filterQuery(query);

  const posts = await Post.find(validQuery, "-owner -createdAt -updatedAt", {
    skip,
    limit: limitNumber,
  });

  const totalHits = await Post.countDocuments(validQuery);

  res.json({ totalHits, posts });
};

const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw ApiError(404);
  }
  res.json(post);
};

const addPost = async (req: Request, res: Response) => {
  if (req.user.subscription !== "admin") {
    throw ApiError(403, "No access to create POST");
  }
  const post = await Post.create({
    ...req.body,
  });

  res.status(201).json({ post });
};

const updateStatusPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { _id: userId } = req.user;
  const post = await Post.findById(postId);

  if (!post) {
    throw ApiError(404, "Post not found");
  }

  const isFavorite = post.favorites.some(
    (favoriteId) => favoriteId.toString() === userId.toString()
  );

  let updatedPost;

  if (isFavorite) {
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { favorites: userId } },
      { new: true }
    );
  } else {
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { favorites: userId } },
      { new: true }
    );
  }

  if (!updatedPost) {
    throw ApiError(404, "Post not found");
  }

  res.json({ updatedPost });
};

const deletePostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findByIdAndDelete(postId);
  if (!post) {
    throw ApiError(404);
  }
  res.json({ message: "Post deleted" });
};

export default {
  getAllPosts: ctrlWrapper(getAllPosts),
  getPostById: ctrlWrapper(getPostById),
  addPost: ctrlWrapper(addPost),
  deletePostById: ctrlWrapper(deletePostById),
  updateStatusPost: ctrlWrapper(updateStatusPost),
};
