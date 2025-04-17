import Post from "../models/post";
import { ApiError, deleteFromS3 } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";
import { generatePresignedUrl } from "src/helpers/generatePresignedUrl";
import {
  generateSignedUrlImage,
  generateSignedUrlFile,
} from "src/helpers/getSignedUrl";
import { getKeyFromUrl } from "src/helpers/getKeyFromUrl";
import { GetPost } from "src/types/post.type";
import { checkDownloadPermission } from "src/helpers/checkDownloadPermission";

interface PostRequest extends Request {
  body: GetPost;
}

const getAllPosts = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "12",
    filter = "",
    favorites = false,
    search = "",
  } = req.query;
  const user = req.user;
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const currentTime = new Date();
  const favoritesQuery =
    user && favorites === "true" ? { favorites: { $in: [user._id] } } : {};
  const filterQuery =
    filter && filter !== "All products" ? { category: { $in: [filter] } } : {};
  const searchQuery = search
    ? { title: { $regex: search, $options: "i" } }
    : {};
  const uploadQuery = { upload_at: { $lte: currentTime } };
  const query = {
    ...filterQuery,
    ...uploadQuery,
    ...favoritesQuery,
    ...searchQuery,
  };
  const posts = await Post.find(
    query,
    "-owner -createdAt -updatedAt -downloadlink",
    {
      skip,
      limit: limitNumber,
    }
  ).sort({ upload_at: -1 });
  const totalHits = await Post.countDocuments(query);

  const signedPosts = await Promise.all(
    posts.map(async (post) => {
      const signedImages = await Promise.all(
        post.images.map((image: string) => {
          const key = getKeyFromUrl(image);
          return generateSignedUrlImage(key);
        })
      );
      return {
        ...post.toObject(),
        images: signedImages,
      };
    })
  );

  res.json({ totalHits, posts: signedPosts });
};

const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw ApiError(404);
  }
  const signedImages = await Promise.all(
    post.images.map((image: string) => {
      const key = getKeyFromUrl(image);
      return generateSignedUrlImage(key);
    })
  );

  const signedPost = {
    _id: post._id,
    title: post.title,
    description: post.description,
    kits: post.kits,
    filesize: post.filesize,
    favorites: post.favorites,
    category: post.category,
    images: signedImages,
    upload_at: post.upload_at,
  };

  res.json(signedPost);
};

const checkDownload = async (req: Request, res: Response) => {
  const user = req.user;
  const { postId } = req.params;
  const permission = await checkDownloadPermission(user);
  if (!permission.allowed) {
    throw ApiError(403, permission.reason);
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw ApiError(404);
  }
  const signedFileUrl = await generateSignedUrlFile(
    getKeyFromUrl(post.downloadlink)
  );
  res.json({
    downloadUrl: signedFileUrl,
    dailyDownloadCount: permission.dailyDownloadCount,
  });
};

const postPresignedUrl = async (req: Request, res: Response) => {
  const { files } = req.body;
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw ApiError(400, "No files provided");
  }
  const signedUrls = [];
  for (const file of files) {
    const signedUrl = await generatePresignedUrl(file);
    signedUrls.push(signedUrl);
  }
  if (signedUrls.length === 0) {
    throw ApiError(404, "Failed to generate pre-signed URL");
  }
  res.json({ signedUrls });
};

const addPost = async (req: PostRequest, res: Response): Promise<void> => {
  if (req.user.subscription !== "admin") {
    throw ApiError(403, "No access to create POST");
  }
  const {
    title,
    description,
    images,
    downloadlink,
    filesize,
    category,
    kits,
    upload_at,
  } = req.body;

  const post = await Post.create({
    title,
    description,
    images,
    downloadlink,
    filesize,
    category,
    kits,
    upload_at,
  });
  res.status(201).json({
    _id: post._id,
    title: post.title,
    description: post.description,
    images: post.images,
    filesize: post.filesize,
    favorites: post.favorites,
    category: post.category,
    kits: post.kits,
    upload_at: post.upload_at,
  });
};

const updateStatusPost = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const { _id: userId } = req.user;
  const post = await Post.findById(postId);

  if (!post) {
    throw ApiError(404, "Post not found");
  }
  if (!userId) {
    throw ApiError(404, "User not found");
  }

  const isFavorite = post.favorites.some(
    (favoriteId) => favoriteId.toString() === userId.toString()
  );

  let updatedPost: GetPost;

  if (isFavorite) {
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { favorites: userId } },
      { new: true }
    ).select("-owner -createdAt -updatedAt -downloadlink");
  } else {
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { favorites: userId } },
      { new: true }
    ).select("-owner -createdAt -updatedAt -downloadlink");
  }

  if (!updatedPost) {
    throw ApiError(404, "Post not found");
  }

  res.json(updatedPost);
};

const deletePostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);

  if (!post) {
    throw ApiError(404, "Post not found");
  }

  if (post.images && Array.isArray(post.images)) {
    await Promise.all(post.images.map((imageUrl) => deleteFromS3(imageUrl)));
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
  checkDownload: ctrlWrapper(checkDownload),
  addPost: ctrlWrapper(addPost),
  deletePostById: ctrlWrapper(deletePostById),
  updateStatusPost: ctrlWrapper(updateStatusPost),
  postPresignedUrl: ctrlWrapper(postPresignedUrl),
};
