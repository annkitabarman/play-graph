import { BACKEND_URL } from "../assets/constants/urls";

export async function getSteamDashBoard() {
  const response = await fetch(`${BACKEND_URL}/steam/dashboard`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to load dashboard.");

  return response.json();
}

export async function syncSteam(timezone: string) {
  const response = await fetch(`${BACKEND_URL}/steam/sync`, {
    method: "POST",
    credentials: "include",
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
  const response = await fetch(`${BACKEND_URL}/steam/currently-playing`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to get currently playing game.");

  return response.json();
}

export async function getMostPlayedGames() {
  const response = await fetch(`${BACKEND_URL}/steam/most-played`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to get recently played games.");

  return response.json();
}

export async function getDailyPlayTime() {
  const response = await fetch(`${BACKEND_URL}/steam/daily-play-time`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to get daily play time.");
  return response.json();
}

export async function getLastSynced() {
  const response = await fetch(`${BACKEND_URL}/steam/last-synced`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to get last synced time.");
  return response.json();
}

export async function getSteamProfileDetails() {
  const response = await fetch(`${BACKEND_URL}/steam/profile`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to get profile details.");

  return response.json();
}
