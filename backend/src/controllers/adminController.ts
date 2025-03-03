import "dotenv/config";
import User from "../models/user";
import { ApiError } from "../helpers/index";
import { ctrlWrapper } from "../decorators/index";
import { Request, Response } from "express";
import Post from "../models/post";
import { nextDate } from "src/helpers/setDate";
import { ObjectId } from "mongoose";
import { checkSubscriptionStatus } from "src/helpers/CheckSubscriptionStatus";
import { IUser } from "src/types/user.type";
import sendMailToSprt from "src/helpers/sendSprtMail";

const getAllUser = async (req: Request, res: Response) => {
  const { page = "1", limit = "100", filter = "" } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const query = filter ? { subscription: filter } : {};

  const users = await User.find(
    query,
    "_id name email phone orderReference subscription status regularDateEnd substart subend",
    {
      skip,
      limit: limitNumber,
    }
  );
  const totalHits = await User.countDocuments(query);
  res.json({ totalHits, users });
};

const updateUsersSubscription = async (req: Request, res: Response) => {
  const { usersId, subscription } = req.body;
  const newDate = new Date();
  if (subscription === "free") {
    await Promise.all(
      usersId.map(async (_id: ObjectId) => {
        const user = await User.findOne({ _id });
        await User.findByIdAndUpdate(
          user._id,
          {
            subscription: subscription,
            subend: null,
            substart: null,
          },
          {
            new: true,
          }
        );
      })
    );
  }
  if (subscription === "member") {
    await Promise.all(
      usersId.map(async (id: ObjectId) => {
        const user = await User.findOne({ _id: id });
        const newSubstart = user.substart ? user.substart : newDate;
        const newSubend = !user.subend
          ? nextDate(newDate.getTime())
          : user.subend.getTime() < newDate.getTime()
          ? nextDate(newDate.getTime())
          : nextDate(user.subend.getTime());

        await User.findByIdAndUpdate(
          user._id,
          {
            subscription: subscription,
            substart: newSubstart,
            subend: newSubend,
          },
          {
            new: true,
          }
        );
      })
    );
  }

  const updatedUsers = await User.find(
    {},
    "_id name email phone orderReference subscription status regularDateEnd substart subend",
    {
      skip: 0,
      limit: 100,
    }
  );
  const totalHits = await User.countDocuments({});
  res.json({ totalHits, users: updatedUsers });
};

const updateUserSubscription = async (req: Request, res: Response) => {
  const newUser = req.body;

  const newDate = new Date();
  const { _id } = newUser;
  const newSubscription = newUser.subscription;
  const user = await User.findOne({ _id });
  if (!user) {
    throw ApiError(400, "Invalid user id");
  }
  if (newSubscription === "admin") {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        subscription: newSubscription,
      },

      {
        new: true,
      }
    ).select(
      "_id name email phone orderReference subscription status regularDateEnd substart subend"
    );
    res.json(updatedUser);
    return;
  }

  if (newSubscription === "member") {
    const newSubstart = user.substart ? user.substart : newDate;
    const newSubend = newUser.subend;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        subscription: newSubscription,
        substart: newSubstart,
        subend: newSubend,
      },
      {
        new: true,
      }
    ).select(
      "_id name email phone orderReference subscription status regularDateEnd substart subend"
    );
    res.json(updatedUser);
    return;
  }

  if (newSubscription === "free") {
    const newSubstart = null;
    const newSubend = null;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        subscription: newSubscription,
        substart: newSubstart,
        subend: newSubend,
      },
      {
        new: true,
      }
    ).select(
      "_id name email phone orderReference subscription status regularDateEnd substart subend"
    );
    res.json(updatedUser);
    return;
  }
  res.json({ message: "User not changed" });
};

const checkUsersSubscription = async (req: Request, res: Response) => {
  const { usersId } = req.body;
  await Promise.all(
    usersId.map(async (_id: ObjectId) => {
      const user = await User.findById(_id);
      const updatedUser = await checkSubscriptionStatus(user);
      return updatedUser;
    })
  );

  const updatedUsers = await User.find(
    {},
    "_id name email phone orderReference subscription status regularDateEnd substart subend",
    {
      skip: 0,
      limit: 100,
    }
  );
  const totalHits = await User.countDocuments({});
  res.json({ totalHits, users: updatedUsers });
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

const getMessageToSprt = async (req: Request, res: Response) => {
  const { message } = req.body;
  const { email } = req.user;
  if (!email || !message) {
    throw ApiError(404);
  }
  await sendMailToSprt({ email, message });
  res.json("Message sent");
};

export default {
  getAllUser: ctrlWrapper(getAllUser),
  getUnpublishedPosts: ctrlWrapper(getUnpublishedPosts),
  getUnpublishedPostById: ctrlWrapper(getUnpublishedPostById),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
  updateUsersSubscription: ctrlWrapper(updateUsersSubscription),
  checkUsersSubscription: ctrlWrapper(checkUsersSubscription),
  getMessageToSprt: ctrlWrapper(getMessageToSprt),
};
