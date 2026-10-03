import { BACKEND_URL } from "../assets/constants/urls";

let getTokenFn: (() => Promise<string | null>) | null = null;

export function setGetToken(fn: () => Promise<string | null>) {
  getTokenFn = fn;
}

async function authFetch(url: string, options: RequestInit = {}) {
  const token = getTokenFn ? await getTokenFn() : null;

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

export async function connectSteam() {
  const response = await authFetch(`${BACKEND_URL}/steam/connect`);

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message || "Failed to connect Steam.");
  }

  const data = await response.json();

  window.location.href = data.url;
}

export async function getSteamDashBoard() {
  const response = await authFetch(`${BACKEND_URL}/steam/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to load dashboard.");
  }

  return response.json();
}

export async function syncSteam(timezone: string) {
  const response = await authFetch(`${BACKEND_URL}/steam/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timezone }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to sync Steam");
  }

  return response.json();
}

export async function getCurrentlyPlaying() {
  const response = await authFetch(`${BACKEND_URL}/steam/currently-playing`);

  if (!response.ok) {
    throw new Error("Failed to get currently playing game.");
  }

  return response.json();
}

export async function getMostPlayedGames() {
  const response = await authFetch(`${BACKEND_URL}/steam/most-played`);

  if (!response.ok) {
    throw new Error("Failed to get recently played games.");
  }

  return response.json();
}

export async function getDailyPlayTime() {
  const response = await authFetch(`${BACKEND_URL}/steam/daily-play-time`);

  if (!response.ok) {
    throw new Error("Failed to get daily play time.");
  }

  return response.json();
}

export async function getLastSynced() {
  const response = await authFetch(`${BACKEND_URL}/steam/last-synced`);

  if (!response.ok) {
    throw new Error("Failed to get last synced time.");
  }

  return response.json();
}

export async function getSteamProfileDetails() {
  const response = await authFetch(`${BACKEND_URL}/steam/profile`);

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

export async function getSteamStatus() {
  const response = await authFetch(`${BACKEND_URL}/steam/status`);

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message || "Failed to check Steam connection.");
  }

  return response.json();
}
