import Post from "../models/post";
import { ApiError, deleteFromS3 } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";
import { generatePresignedUrl } from "../helpers/generatePresignedUrl";
import { generateSignedGetUrl } from "src/helpers/getSignedUrl";
import { getKeyFromUrl } from "src/helpers/getKeyFromUrl";

interface Post {
  title: string;
  description: string;
  images: string[];
  downloadlink: string;
  filesize: string;
  category: string[];
  kits: string[];
  upload_at: string;
}
interface PostRequest extends Request {
  body: Post;
}

const getAllPosts = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "12",
    filter = "",
    favorites = false,
  } = req.query;
  const user = req.user;
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const currentTime = new Date();
  const favoriritesQuery =
    favorites && user ? { favorites: { $in: [user._id] } } : {};
  const filterQuery =
    filter && filter !== "All products" ? { category: { $in: [filter] } } : {};
  const uploadQuery = { upload_at: { $lte: currentTime } };
  const query = { ...filterQuery, ...uploadQuery, ...favoriritesQuery };
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
          return generateSignedGetUrl(key);
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
  const user = req.user;
  const post = await Post.findById(postId);
  if (!post) {
    throw ApiError(404);
  }
  const signedImages = await Promise.all(
    post.images.map((image: string) => {
      const key = getKeyFromUrl(image);
      return generateSignedGetUrl(key);
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
    downloadlink: "",
    upload_at: post.upload_at,
    createdAt: post.createdAt,
  };

  if (user && user.subscription !== "free") {
    const signedDownloads = await generateSignedGetUrl(
      getKeyFromUrl(post.downloadlink)
    );

    signedPost.downloadlink = signedDownloads;
  }

  res.json(signedPost);
};

const postPresignedUrl = async (req: Request, res: Response) => {
  const { files } = req.body;
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw ApiError(400, "No files provided.");
  }
  const signedUrls = [];
  for (const file of files) {
    const signedUrl = await generatePresignedUrl(file);
    signedUrls.push(signedUrl);
  }
  if (signedUrls.length < 0) {
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
  // const { body } = req;
  // const files = req.files;

  // if (!files || (!files["imagefiles"] && !files["downloadfile"])) {
  //   console.error("No files uploaded");
  //   res.status(400).json({ error: "No files uploaded" });
  //   return;
  // }

  // const image = files["imagefiles"]
  //   ? Array.isArray(files["imagefiles"])
  //     ? await Promise.all(
  //         files["imagefiles"].map((file) => uploadToS3(file, "post-images"))
  //       )
  //     : []
  //   : [];

  // const downloadlink = files["downloadfile"]
  //   ? Array.isArray(files["downloadfile"])
  //     ? await uploadToS3(files["downloadfile"][0], "post-files")
  //     : await uploadToS3(files["downloadfile"], "post-files")
  //   : "";

  // const kits = JSON.parse(req.body.kits);
  // const category = JSON.parse(req.body.category);

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
  res.status(201).json(post);
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
  addPost: ctrlWrapper(addPost),
  deletePostById: ctrlWrapper(deletePostById),
  updateStatusPost: ctrlWrapper(updateStatusPost),
  postPresignedUrl: ctrlWrapper(postPresignedUrl),
};
