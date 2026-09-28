import prisma from "../lib/prisma";
import { getOwnedGames, getSteamGameDetails } from "./steam.service";

export async function syncSteamAccount(userId: string, steamId: string) {
  const steamGames = await getOwnedGames(steamId);

  let syncedGames = 0;

  for (const steamGame of steamGames) {
    const details = await getSteamGameDetails(steamGame.appid);

    const genres =
      details?.genres?.map(
        (genre: { description: string }) => genre.description,
      ) ?? [];

    const game = await prisma.game.upsert({
      where: {
        platform_externalId: {
          platform: "steam",
          externalId: String(steamGame.appid),
        },
      },
      update: {
        name: steamGame.name,
        imageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamGame.appid}/header.jpg`,
        genres: genres,
      },
      create: {
        platform: "steam",
        externalId: String(steamGame.appid),
        name: steamGame.name,
        imageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamGame.appid}/header.jpg`,
        genres: genres,
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
    games_synced: syncedGames,
  };
}
