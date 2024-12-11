import Post from "../models/post";
import {
  ApiError,
  deleteFromS3,
  filterQuery,
  uploadToS3,
} from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";

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
      ? await Promise.all(
          files["imagefiles"].map((file) => uploadToS3(file, "post-images"))
        )
      : []
    : [];

  const downloadlink = files["downloadfile"]
    ? Array.isArray(files["downloadfile"])
      ? await uploadToS3(files["downloadfile"][0], "post-files")
      : await uploadToS3(files["downloadfile"], "post-files")
    : "";

  const kits = JSON.parse(req.body.kits);
  const filter = JSON.parse(req.body.filter);

  const post = await Post.create({
    ...body,
    kits,
    filter,
    image,
    downloadlink,
  });
  res.status(201).json({ post });
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
  const post = await Post.findById(postId);

  if (!post) {
    throw ApiError(404, "Post not found");
  }

  if (post.image && Array.isArray(post.image)) {
    await Promise.all(post.image.map((imageUrl) => deleteFromS3(imageUrl)));
  }

  if (post.downloadlink) {
    await deleteFromS3(post.downloadlink);
  }

  await Post.findByIdAndDelete(postId);

  res.json({ message: "Post deleted" });
};

export default {
  getAllPosts: ctrlWrapper(getAllPosts),
  getPostById: ctrlWrapper(getPostById),
  addPost: ctrlWrapper(addPost),
  deletePostById: ctrlWrapper(deletePostById),
  updateStatusPost: ctrlWrapper(updateStatusPost),
};
