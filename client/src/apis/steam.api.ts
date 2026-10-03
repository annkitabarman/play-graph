import { BACKEND_URL } from "../assets/constants/urls";

type GetToken = () => Promise<string | null>;

async function authFetch(
  url: string,
  getToken: GetToken,
  options: RequestInit = {},
) {
  const token = await getToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
}

export async function connectSteam(getToken: GetToken) {
  const response = await authFetch(`${BACKEND_URL}/steam/connect`, getToken);

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message || "Failed to connect Steam.");
  }

  const data = await response.json();

  window.location.href = data.url;
}

export async function getSteamDashBoard(getToken: GetToken) {
  const response = await authFetch(`${BACKEND_URL}/steam/dashboard`, getToken);

  if (!response.ok) {
    throw new Error("Failed to load dashboard.");
  }

  return response.json();
}

export async function syncSteam(getToken: GetToken, timezone: string) {
  const response = await authFetch(`${BACKEND_URL}/steam/sync`, getToken, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timezone }),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message || "Failed to sync Steam.");
  }

  return response.json();
}

export async function getCurrentlyPlaying(getToken: GetToken) {
  const response = await authFetch(
    `${BACKEND_URL}/steam/currently-playing`,
    getToken,
  );

  if (!response.ok) {
    throw new Error("Failed to get currently playing game.");
  }

  return response.json();
}

export async function getMostPlayedGames(getToken: GetToken) {
  const response = await authFetch(
    `${BACKEND_URL}/steam/most-played`,
    getToken,
  );

  if (!response.ok) {
    throw new Error("Failed to get recently played games.");
  }

  return response.json();
}

export async function getDailyPlayTime(getToken: GetToken) {
  const response = await authFetch(
    `${BACKEND_URL}/steam/daily-play-time`,
    getToken,
  );

  if (!response.ok) {
    throw new Error("Failed to get daily play time.");
  }

  return response.json();
}

export async function getLastSynced(getToken: GetToken) {
  const response = await authFetch(
    `${BACKEND_URL}/steam/last-synced`,
    getToken,
  );

  if (!response.ok) {
    throw new Error("Failed to get last synced time.");
  }

  return response.json();
}

export async function getSteamProfileDetails(getToken: GetToken) {
  const response = await authFetch(`${BACKEND_URL}/steam/profile`, getToken);

  if (!response.ok) {
    const data = await response.json();

    const error = new Error(
      data.message || "Failed to fetch profile details.",
    ) as Error & { status?: number };

    error.status = response.status;

    throw error;
  }

  return response.json();
}

export async function getSteamStatus(getToken: GetToken) {
  const response = await authFetch(`${BACKEND_URL}/steam/status`, getToken);

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message || "Failed to check Steam connection.");
  }

  return response.json();
}
