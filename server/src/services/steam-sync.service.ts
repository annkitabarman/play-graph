import prisma from "../lib/prisma";
import { getOwnedGames } from "./steam.service";

export async function syncSteamAccount(userId: string, steamId: string) {
  const steamGames = await getOwnedGames(steamId);

  let syncedGames = 0;

  for (const steamGame of steamGames) {
    const game = await prisma.game.upsert({
      where: {
        platform_externalId: {
          platform: "steam",
          externalId: String(steamGame.appid),
        },
      },
      update: {
        name: steamGame.name,
        imageUrl: steamGame.img_icon_url
          ? `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${steamGame.appid}/${steamGame.img_icon_url}.jpg`
          : null,
      },
      create: {
        platform: "steam",
        externalId: String(steamGame.appid),
        name: steamGame.name,
        imageUrl: steamGame.img_icon_url
          ? `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${steamGame.appid}/${steamGame.img_icon_url}.jpg`
          : null,
      },
    });

    const playtimeMinutes = steamGame.playtime_forever ?? 0;

    await prisma.userGame.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId: game.id,
        },
      },
      update: {
        playtimeMinutes,
      },
      create: {
        userId,
        gameId: game.id,
        playtimeMinutes,
      },
    });

    syncedGames++;
  }

  return {
    gamesSynced: syncedGames,
  };
}
