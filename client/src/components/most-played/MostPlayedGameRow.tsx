import type { MostPlayedGame } from "../../types/steam.types";
import { STEAM_URL } from "../../constants/urls";

interface Props {
  game: MostPlayedGame;
  rank: number;
  showLastPlayed?: boolean;
}

function formatHours(minutes: number) {
  return `${(minutes / 60).toFixed(1)}h`;
}

function formatLastPlayed(lastPlayedAt: string | null) {
  if (!lastPlayedAt) {
    return "Never";
  }

  return new Date(lastPlayedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MostPlayedGameRow({
  game,
  rank,
  showLastPlayed = false,
}: Props) {
  const progress =
    game.playtime_minutes > 0
      ? Math.min((game.playtime_2weeks / game.playtime_minutes) * 100, 100)
      : 0;

  return (
    <div className="rounded-xl border border-violet-500/15 bg-[#19143f] px-4 py-3 transition hover:border-violet-400/30">
      <div className="flex items-center gap-4">
        {/* Rank */}
        <span className="w-7 shrink-0 text-sm font-semibold text-violet-400">
          {String(rank).padStart(2, "0")}
        </span>

        {/* Game image */}
        <img
          src={game.image_url}
          alt={game.name}
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />

        {/* Game info */}
        <div className="min-w-0 flex-1">
          <div className="group/game relative w-fit max-w-full">
            <a
              href={`${STEAM_URL}/${game.external_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm font-bold text-white transition hover:text-cyan-300"
            >
              {game.name}
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

          <div className="mt-1 flex items-center gap-3 text-xs">
            <p className="text-violet-300">
              {formatHours(game.playtime_2weeks)} last 2 weeks
            </p>

            {showLastPlayed && game.last_played_at && (
              <>
                <span className="h-3 w-px bg-white/10" />

                <p className="text-white/35">
                  Last played {formatLastPlayed(game.last_played_at)}
                </p>
              </>
            )}
          </div>

          {/* Progress */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#29245a]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Total playtime */}
        <div className="w-16 shrink-0 text-right">
          <p className="text-sm font-bold text-white">
            {formatHours(game.playtime_minutes)}
          </p>

          <p className="mt-1 text-[11px] text-violet-400">total</p>
        </div>
      </div>
    </div>
  );
}
