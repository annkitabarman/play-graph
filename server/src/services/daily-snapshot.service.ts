import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

import prisma from "../lib/prisma";

export async function createDailySnapshots(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get the user's current calendar date
  const localDate = formatInTimeZone(new Date(), user.timezone, "yyyy-MM-dd");

  // Convert that user's midnight into a UTC Date
  const snapshotDate = fromZonedTime(`${localDate}T00:00:00`, user.timezone);

  const games = await prisma.userGame.findMany({
    where: {
      userId,
    },
  });

  for (const userGame of games) {
    await prisma.playtimeSnapshot.upsert({
      where: {
        userId_gameId_snapshotDate: {
          userId,
          gameId: userGame.gameId,
          snapshotDate,
        },
      },

      update: {
        playtimeMinutes: userGame.playtimeMinutes,
        recordedAt: new Date(),
      },

      create: {
        userId,
        gameId: userGame.gameId,
        playtimeMinutes: userGame.playtimeMinutes,
        snapshotDate,
        recordedAt: new Date(),
      },
    });
  }

  return {
    gamesSnapshotted: games.length,
  };
}
