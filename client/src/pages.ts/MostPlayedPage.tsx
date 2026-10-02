import { useQuery } from "@tanstack/react-query";

import { getMostPlayedGames } from "../apis/steam.api";
import type { MostPlayedResponse } from "../types/steam.types";

import MostPlayedGameRow from "../components/most-played/MostPlayedGameRow";

export default function MostPlayedPage() {
  const { data, isLoading, isError } = useQuery<MostPlayedResponse>({
    queryKey: ["steam", "most-played"],
    queryFn: getMostPlayedGames,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0924] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="h-9 w-48 animate-pulse rounded bg-violet-500/20" />

            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-violet-500/10" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[86px] animate-pulse rounded-xl bg-violet-500/10"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#0d0924] px-6 py-10 text-violet-300">
        Failed to load most played games.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0924] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold">Most played</h1>

              <p className="mt-2 text-sm text-violet-300">
                Your most recently active games
              </p>
            </div>

            <span className="text-sm text-violet-400">
              {data.total_count} games
            </span>
          </div>
        </div>

        {/* Games */}
        <div className="space-y-3">
          {data.games.map((game, index) => (
            <MostPlayedGameRow key={game.id} game={game} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
