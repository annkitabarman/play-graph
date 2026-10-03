import { getCurrentlyPlaying } from "../apis/steam.api";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { STEAM_URL } from "../assets/constants/urls";
export default function CurrentOrLastPlayGame() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["steam", "currently-playing"],
    queryFn: getCurrentlyPlaying,
    refetchInterval: 60_000,
  });

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-[#121021] p-5">
        <div className="animate-pulse">
          <div className="mb-4 h-3 w-24 rounded bg-white/10" />
          <div className="h-7 w-48 rounded bg-white/10" />
          <div className="mt-3 h-3 w-32 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-[#121021] p-5">
        <p className="text-sm text-red-400">Failed to load current game</p>
        <p className="mt-1 text-xs text-white/40">{error.message}</p>
      </div>
    );
  }

  if (!data?.game) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-[#121021] p-5">
        <div className="flex min-h-[190px] items-center justify-center">
          <div className="text-center">
            <History className="mx-auto h-8 w-8 text-violet-400/50" />

            <p className="mt-3 text-sm font-medium text-white/70">
              No recent games
            </p>

            <p className="mt-1 text-xs text-white/35">
              Start playing a game to see your activity here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalMinutes = Math.floor(data.elapsed_seconds / 60);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-violet-500/30 bg-[#171238] shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      {/* Top accent */}
      <div className="absolute left-0 right-0 top-0 z-10 h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

      <div className="flex min-h-[190px]">
        {/* LEFT — Details */}
        <div className="relative flex min-w-0 flex-1 flex-col justify-between p-5">
          <div>
            {/* Status */}
            <div className="flex items-center gap-2">
              {data?.playing && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pink-400" />
                </span>
              )}

              {!data?.playing && (
                <History className="h-4 w-4 text-violet-400" />
              )}

              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-pink-300">
                {data?.playing ? "Currently playing" : "Last played"}
              </span>
            </div>

            {/* Game name */}
            <div className="group/game relative mt-5 w-fit">
              <a
                href={`${STEAM_URL}/${data.game?.app_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-bold tracking-tight text-white transition hover:text-cyan-300"
              >
                {data.game.game_name}
              </a>

              {/* Tooltip */}
              <div
                className="pointer-events-none absolute left-0 top-full z-50 mt-2
               whitespace-nowrap rounded-lg border border-violet-500/20
               bg-[#171322] px-3 py-1.5 text-xs text-violet-200
               opacity-0 shadow-xl transition-opacity duration-200
               group-hover/game:opacity-100"
              >
                Go to Steam page
              </div>
            </div>

            {/* Playing time */}
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wider text-white/35">
                {data?.playing ? "Playing" : "Played"} for
              </p>

              <p className="mt-1 text-lg font-semibold text-violet-300">
                {formattedTime}
              </p>
            </div>
          </div>

          {/* Footer */}
          {data?.playing && (
            <div className="mt-5 flex items-center gap-2">
              <span className="rounded-full border border-pink-400/20 bg-pink-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-pink-300">
                Live
              </span>

              <span className="text-xs text-white/30">Steam</span>
            </div>
          )}
        </div>

        {/* RIGHT — Game Image */}
        <div className="relative w-[50%] min-w-[180px] overflow-hidden">
          <img
            src={data.game.image_url}
            alt={data.game.game_name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {/* Gradient blending image into card */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#171238] via-[#171238]/40 to-transparent" />

          {/* Image bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#171238]/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}
