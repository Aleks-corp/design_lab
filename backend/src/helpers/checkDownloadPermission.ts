import { IUser } from "src/types/user.type";
import User from "../models/user";
import { userSubscriptionConst } from "src/constants/usersConstants";

export const resetLimitedDownload = async (user: IUser) => {
  if (
    user.orderReference === "registrationSale" ||
    user.subscription === userSubscriptionConst.SALE
  ) {
    const now = new Date();
    const lastReset = user.lastDownloadReset || user.createdAt;

    const msInDay = 1000 * 60 * 60 * 24;
    const msSinceReset = now.getTime() - new Date(lastReset).getTime();

    if (msSinceReset >= msInDay) {
      const missedDays = Math.floor(msSinceReset / msInDay);

      const nextResetDate = new Date(lastReset);
      nextResetDate.setDate(nextResetDate.getDate() + missedDays);

      await User.findByIdAndUpdate(user._id, {
        dailyDownloadCount: 0,
        lastDownloadReset: nextResetDate,
      });

      user.dailyDownloadCount = 0;
      user.lastDownloadReset = nextResetDate;
    }
  }
  return user;
};

export const checkDownloadPermission = async (user: IUser) => {
  const now = new Date();
  const dailyLimit = 2;

  if (!user || user.subscription === userSubscriptionConst.FREE) {
    return {
      allowed: false,
      reason: "Not allowed to download",
    };
  }

  if (
    user.orderReference === "registrationSale" ||
    user.subscription === userSubscriptionConst.SALE
  ) {
    const lastReset = user.lastDownloadReset || user.createdAt;
    const msInDay = 1000 * 60 * 60 * 24;
    const msSinceReset = now.getTime() - new Date(lastReset).getTime();

    if (msSinceReset >= msInDay) {
      const missedDays = Math.floor(msSinceReset / msInDay);

      const nextResetDate = new Date(lastReset);
      nextResetDate.setDate(nextResetDate.getDate() + missedDays);

      user.dailyDownloadCount = 0;
      user.lastDownloadReset = nextResetDate;
    }

    if (user.dailyDownloadCount >= dailyLimit) {
      return {
        allowed: false,
        reason: "Daily download limit reached (2 per day)",
        dailyDownloadCount: user.dailyDownloadCount,
      };
    }

    user.dailyDownloadCount += 1;

    await User.findByIdAndUpdate(
      user._id,
      {
        dailyDownloadCount: user.dailyDownloadCount,
        lastDownloadReset: user.lastDownloadReset,
      },
      { new: true }
    );

    return {
      allowed: true,
      reason: "",
      dailyDownloadCount: user.dailyDownloadCount,
    };
  }

  return {
    allowed: true,
    reason: "",
    dailyDownloadCount: undefined,
  };
};
