import cron from "node-cron";
import crypto from "crypto";
import { formatInTimeZone } from "date-fns-tz";

import prisma from "../lib/prisma";
import redis from "../lib/redis";

import { syncSteamAccount } from "../services/steam-sync.service";
import { createDailySnapshots } from "../services/daily-snapshot.service";

export function startDailySnapshotJob() {
  console.log("Daily snapshot job registered");

  cron.schedule("* * * * *", async () => {
    const lockKey = "jobs:daily-snapshot";
    const lockValue = crypto.randomUUID();

    // Try to acquire the lock
    const acquired = await redis.set(lockKey, lockValue, {
      NX: true,
      EX: 120,
    });

    if (!acquired) {
      console.log("Daily snapshot job already running. Skipping.");
      return;
    }

    try {
      const now = new Date();

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

        const localTime = formatInTimeZone(now, user.timezone, "HH:mm");

        if (localTime !== "23:59") {
          continue;
        }

        try {
          await syncSteamAccount(user.id, steamAccount.externalId);

          await createDailySnapshots(user.id);

          console.log(`Daily snapshot created for user ${user.id}`);
        } catch (error) {
          console.error(`Daily snapshot failed for user ${user.id}:`, error);
        }
      }
    } finally {
      // Release only OUR lock
      await redis.eval(
        `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `,
        {
          keys: [lockKey],
          arguments: [lockValue],
        },
      );
    }
  });
}
