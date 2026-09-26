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
    `${STEAM_API}/IPlayerService/GetOwnedGames/v2/`,
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
