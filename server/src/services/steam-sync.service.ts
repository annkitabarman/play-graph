import prisma from "../lib/prisma";
import {
  getOwnedGames,
  getSteamGameDetails,
  getRecentlyPlayedGames,
} from "./steam.service";

export async function syncSteamAccount(userId: string, steamId: string) {
  const ownedGames = await getOwnedGames(steamId);
  const recentlyPlayedGames = await getRecentlyPlayedGames(steamId);

  // Merge games by Steam AppID
  const gamesMap = new Map<number, (typeof ownedGames)[number]>();

  // Add owned games first
  for (const game of ownedGames) {
    gamesMap.set(game.appid, game);
  }

  // Add recently played games that aren't already in owned games
  for (const game of recentlyPlayedGames.games) {
    if (!gamesMap.has(game.appid)) {
      gamesMap.set(game.appid, game);
    }
  }

  const steamGames = [...gamesMap.values()];

  console.log(
    `Syncing ${steamGames.length} games (${ownedGames.length} owned, ${recentlyPlayedGames.total_count} recently played)`,
  );

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
        genres,
      },
      create: {
        platform: "steam",
        externalId: String(steamGame.appid),
        name: steamGame.name,
        imageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamGame.appid}/header.jpg`,
        genres,
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
