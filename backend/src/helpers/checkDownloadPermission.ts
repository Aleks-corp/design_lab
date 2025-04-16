import { IUser } from "src/types/user.type";
import User from "../models/user";

export const checkDownloadPermission = async (user: IUser) => {
  const now = new Date();
  const dailyLimit = 2;
  const permission = {
    allowed: false,
    reason: "Not allowed to download",
  };

  if (!user || user.subscription === "free") {
    return permission;
  }

  if (user.orderReference === "registrationSale") {
    const resetDate = user.lastDownloadReset || user.createdAt || now;
    const isNewDay =
      !user.lastDownloadReset ||
      now.toDateString() !== new Date(resetDate).toDateString();

    if (isNewDay) {
      user.dailyDownloadCount = 0;
      user.lastDownloadReset = now;
    }

    if (user.dailyDownloadCount >= dailyLimit) {
      return {
        allowed: false,
        reason: "Daily download limit reached (2 per day)",
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

    return { allowed: true, reason: "" };
  }

  return { allowed: true, reason: "" };
};
