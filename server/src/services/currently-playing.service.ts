import redis from "../lib/redis";
import { getCurrentlyPlaying } from "./steam.service";

function getPlayingKey(userId: string) {
  return `playgraph:playing:${userId}`;
}

export async function updateCurrentlyPlaying(userId: string, steamId: string) {
  const key = getPlayingKey(userId);

  const currentlyPlaying = await getCurrentlyPlaying(steamId);

  if (!currentlyPlaying) {
    const existing = await redis.get(key);

    if (!existing) return null;

    const session = JSON.parse(existing);

    if (!session.playing && !session.detected_at) return session;
    const detectedAt = new Date(session.detected_at).getTime();

    const playTime = Math.floor((Date.now() - detectedAt) / 1000);

    const updatedSession = {
      ...session,
      playing: false,
      session_duration: playTime,
      detected_at: null,
    };

    await redis.set(key, JSON.stringify(updatedSession));
    return updatedSession;
  }

  const existing = await redis.get(key);

  // User still playing the same game
  if (existing) {
    const session = JSON.parse(existing);

    if (session.app_id === currentlyPlaying.app_id && session.playing)
      return session;
  }

  // User playing a new game
  await redis.del(`playgraph:playing:${userId}`);

  const session = {
    app_id: currentlyPlaying.app_id,
    game_name: currentlyPlaying.game_name,
    detected_at: new Date().toISOString(),
    playing: true,
  };

  await redis.set(key, JSON.stringify(session));
  return session;
}
