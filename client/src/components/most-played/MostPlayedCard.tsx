import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { getMostPlayedGames } from "../../apis/steam.api";
import type { MostPlayedResponse } from "../../types/steam.types";
import MostPlayedGameRow from "./MostPlayedGameRow";
import { Link } from "react-router-dom";

export default function MostPlayedCard() {
  const { data, isLoading, isError } = useQuery<MostPlayedResponse>({
    queryKey: ["steam", "most-played"],
    queryFn: getMostPlayedGames,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-violet-500/20 bg-[#171238] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-violet-500/20" />

          <div className="h-5 w-24 animate-pulse rounded bg-violet-500/20" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[86px] animate-pulse rounded-xl bg-violet-500/10"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-violet-500/20 bg-[#171238] p-5 text-sm text-violet-300">
        Failed to load most played games.
      </div>
    );
  }

  const displayedGames = data.games.slice(0, 3);

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-[#171238] p-5">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Most played</h3>

        <Link
          to="/library"
          className="flex items-center gap-1 text-sm font-semibold text-cyan-400 transition hover:cursor-pointer hover:text-cyan-300"
        >
          All {data.total_count} games
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Games */}
      <div className="space-y-3">
        {displayedGames.map((game, index) => (
          <MostPlayedGameRow key={game.id} game={game} rank={index + 1} />
        ))}
      </div>

      {/* Footer */}
      <button className="mt-3 flex w-full items-center justify-center gap-2 border border-violet-500/20 py-3 text-sm font-semibold text-violet-300 transition hover:border-violet-400/40 hover:text-white hover:cursor-pointer">
        View full game library
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
