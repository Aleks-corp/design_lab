import "dotenv/config";
import User from "../models/user";
import { ApiError } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";
import Post from "../models/post";

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

  const newDate = new Date();
  users.map(async (user) => {
    if (user.subend && newDate.getTime() > user.subend.getTime()) {
      user.subscription = "free";
      await User.findByIdAndUpdate(user._id, {
        subscription: "free",
      });
    }
  });

  res.json({ totalHits, users });
};

const changeUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const newUser = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw ApiError(400, "Invalid user id");
  }

  const newSubscription = newUser.subscription;
  if (newSubscription === "admin") {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscription: newSubscription,
      },
      {
        new: true,
      }
    );
    res.json({ updatedUser });
    return;
  }

  const newDate = new Date();
  if (newSubscription === "member") {
    const newSubstart =
      !user.subend && user.subend.getTime() < newDate.getTime()
        ? newDate
        : user.subend;
    const newSubend =
      !user.subend && user.subend.getTime() < newDate.getTime()
        ? newDate.setMonth(newDate.getMonth() + 1)
        : new Date(
            new Date(user.subend).setMonth(new Date(user.subend).getMonth() + 1)
          ).getTime();
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        subscription: newSubscription,
        substart: newSubstart,
        subend: newSubend,
      },
      {
        new: true,
      }
    );
    res.json({ updatedUser });
    return;
  }

  if (newSubscription === "free") {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscription: newSubscription,
      },
      {
        new: true,
      }
    );
    res.json({ updatedUser });
    return;
  }

  res.json({ message: "User not changed" });
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
