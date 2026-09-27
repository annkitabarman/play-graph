import prisma from "../lib/prisma";

export async function createDailySnapshots(userId: string) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

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
          snapshotDate: today,
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
        snapshotDate: today,
        recordedAt: new Date(),
      },
    });
  }

  return {
    gamesSnapshotted: games.length,
  };
}
