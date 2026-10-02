import type { MostPlayedGame } from "../../types/steam.types";

interface Props {
  game: MostPlayedGame;
  rank: number;
}

function formatHours(minutes: number) {
  return `${(minutes / 60).toFixed(1)}h`;
}

export default function MostPlayedGameRow({ game, rank }: Props) {
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
          <p className="truncate text-sm font-bold text-white">{game.name}</p>

          <p className="mt-1 text-xs text-violet-300">
            {formatHours(game.playtime_2weeks)} last 2 weeks
          </p>

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
