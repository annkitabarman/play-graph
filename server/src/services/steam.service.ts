import axios from "axios";

const STEAM_API = "https://api.steampowered.com";

export async function getSteamProfile(steamId: string) {
  const response = await axios.get(
    `${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/`,
    {
      params: {
        key: process.env.STEAM_API_KEY,
        steamids: steamId,
      },
    },
  );

  return response.data.response.players[0];
}

export async function getOwnedGames(steamId: string) {
  const response = await axios.get(
    `${STEAM_API}/IPlayerService/GetOwnedGames/v1/`,
    {
      params: {
        key: process.env.STEAM_API_KEY,
        steamid: steamId,
        include_appinfo: true,
        include_played_free_games: true,
      },
    },
  );

  return response.data.response.games ?? [];
}

export async function getSteamGameDetails(appId: number) {
  const response = await axios.get(
    "https://store.steampowered.com/api/appdetails",
    {
      params: {
        appids: appId,
      },
    },
  );

  return response.data[appId]?.data ?? null;
}

export async function getCurrentlyPlaying(steamId: string) {
  const response = await axios.get(
    `${STEAM_API}/ISteamUser/GetPlayerSummaries/v2`,
    {
      params: {
        key: process.env.STEAM_API_KEY,
        steamIds: steamId,
      },
    },
  );

  const player = response.data.response.players?.[0];

  if (!player?.gameid) {
    return null;
  }

  return {
    app_id: Number(player.gameid),
    game_name: player.gameextrainfo,
  };
}

export async function getRecentlyPlayedGames(steamId: string) {
  const response = await axios.get(
    `${STEAM_API}/IPlayerService/GetRecentlyPlayedGames/v1/`,
    {
      params: {
        key: process.env.STEAM_API_KEY,
        steamid: steamId,
        count: 4,
      },
    },
  );

  return response.data.response.games ?? [];
}
