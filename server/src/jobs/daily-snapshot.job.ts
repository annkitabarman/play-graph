import cron from "node-cron";
import prisma from "../lib/prisma";
import { syncSteamAccount } from "../services/steam-sync.service";
import { createDailySnapshots } from "../services/daily-snapshot.service";

export function startDailySnapshotJob() {
  console.log("Daily snapshot job registered");
  cron.schedule(
    "59 23 * * *",
    async () => {
      console.log("Running daily Steam snapshot job...");

      const users = await prisma.user.findMany({
        include: {
          connectedAccounts: {
            where: {
              platform: "steam",
            },
          },
        },
      });

      for (const user of users) {
        const steamAccount = user.connectedAccounts[0];

        if (!steamAccount) {
          continue;
        }

        try {
          // Get the latest Steam data first
          await syncSteamAccount(user.id, steamAccount.externalId);

          // Then record the end-of-day state
          await createDailySnapshots(user.id);

          console.log(`Daily snapshot created for user ${user.id}`);
        } catch (error) {
          console.error(`Daily snapshot failed for user ${user.id}:`, error);
        }
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
}
