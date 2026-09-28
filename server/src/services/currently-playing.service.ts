import redis from "../lib/redis";
import { getCurrentlyPlaying } from "./steam.service";

function getPlayingKey(userId: string) {
  return `playgraph:playing:${userId}`;
}

export async function updateCurrentlyPlaying(userId: string, steamId: string) {
  const key = getPlayingKey(userId);

  const currentlyPlaying = await getCurrentlyPlaying(steamId);

  if (!currentlyPlaying) {
    await redis.del(key);
    return null;
  }

  const existing = await redis.get(key);

  // User still playing the same game
  if (existing) {
    const session = JSON.parse(existing);

    if (session.app_id === currentlyPlaying.app_id) return session;
  }

  // User playing a new game

  const session = {
    app_id: currentlyPlaying.app_id,
    game_name: currentlyPlaying.game_name,
    detected_at: new Date().toISOString(),
  };

  await redis.set(key, JSON.stringify(session));
  return session;
}
