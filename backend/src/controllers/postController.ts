import Post from "../models/post";
import { ApiError, filterQuery } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";
import path from "path";
import "dotenv/config";

const { BASE_URL } = process.env;

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
  console.log("postId:", postId);
  const post = await Post.findById(postId);
  if (!post) {
    throw ApiError(404);
  }
  res.json(post);
};

interface PostRequest extends Request {
  body: {
    title: string;
    description: string;
    kits: string;
    filter: string;
    filesize: number;
  };
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
}

const addPost = async (req: PostRequest, res: Response): Promise<void> => {
  if (req.user.subscription !== "admin") {
    throw ApiError(403, "No access to create POST");
  }

  const { body } = req;
  const files = req.files;

  if (!files || (!files["imagefiles"] && !files["downloadfile"])) {
    console.error("No files uploaded");
    res.status(400).json({ error: "No files uploaded" });
    return;
  }

  const image = files["imagefiles"]
    ? Array.isArray(files["imagefiles"])
      ? files["imagefiles"].map(
          (file) => `${BASE_URL}/post-img/${path.basename(file.path)}`
        )
      : []
    : [];

  const downloadlink = files["downloadfile"]
    ? Array.isArray(files["downloadfile"])
      ? `${BASE_URL}/file/${path.basename(
          files["downloadfile"][0]?.path || ""
        )}`
      : `${BASE_URL}/upload/file/${path.basename(
          files["downloadfile"].path || ""
        )}`
    : "";

  const kits = JSON.parse(req.body.kits);
  const filter = JSON.parse(req.body.filter);

  try {
    const post = await Post.create({
      ...body,
      kits,
      filter,
      image,
      downloadlink,
    });
    res.status(201).json({ post });
  } catch (err) {
    console.error("Помилка при створенні посту:", err);
    console.error("Error creating post:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post" });
  }
};

const updateStatusPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.body;
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
