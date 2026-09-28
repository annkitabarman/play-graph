import { BACKEND_URL } from "../assets/constants/urls";

export async function getSteamDashBoard() {
  const response = await fetch(`${BACKEND_URL}/steam/dashboard`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to load dashboard.");

  return response.json();
}

export async function syncSteam() {
  const response = await fetch(`${BACKEND_URL}/steam/sync`, {
    method: "POST",
    credentials: "include",
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
