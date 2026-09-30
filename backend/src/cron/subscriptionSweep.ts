import cron from "node-cron";
import User from "../models/user";
import { checkSubscriptionStatus } from "../helpers/CheckSubscriptionStatus";
import { userSubscriptionConst } from "../constants/usersConstants";

/**
 * Subscription status is otherwise only re-checked when the affected user
 * makes an authenticated request themselves (throttled) or an admin
 * triggers a manual check. If someone never logs back in after a failed
 * recurring charge, their access stays stale ("member" with an expired
 * subend) indefinitely. This sweep force-checks every member/trial whose
 * paid period has already ended, so access reflects reality even without
 * that user visiting the site.
 */
const sweepExpiredSubscriptions = async () => {
  const now = new Date();
  const staleUsers = await User.find({
    subscription: {
      $in: [userSubscriptionConst.MEMBER, userSubscriptionConst.SALE],
    },
    subend: { $ne: null, $lte: now },
  });

  if (staleUsers.length === 0) return;

  console.log(`🔁 Subscription sweep: checking ${staleUsers.length} user(s)`);
  for (const user of staleUsers) {
    try {
      await checkSubscriptionStatus(user, true);
    } catch (error) {
      console.error(`Subscription sweep failed for user ${user._id}:`, error);
    }
  }
};

export const scheduleSubscriptionSweep = () => {
  // Every 30 minutes.
  cron.schedule("*/30 * * * *", () => {
    sweepExpiredSubscriptions().catch((error) => {
      console.error("Subscription sweep run failed:", error);
    });
  });
};
