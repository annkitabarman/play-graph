import { useState } from "react";

import { useAuth } from "@clerk/react";

import { useQuery } from "@tanstack/react-query";

import { ArrowDown, Search } from "lucide-react";

import { getMostPlayedGames } from "../apis/steam.api";

import type { MostPlayedResponse } from "../types/steam.types";

import MostPlayedGameRow from "../components/most-played/MostPlayedGameRow";

type SortBy = "name" | "mostPlayed" | "recentlyPlayed" | "recentlyAdded";

export default function Library() {
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState<SortBy>("mostPlayed");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { getToken, isLoaded, isSignedIn } = useAuth();

  const { data, isLoading, isError } = useQuery<MostPlayedResponse>({
    queryKey: ["steam", "most-played"],

    queryFn: () => getMostPlayedGames(getToken),

    enabled: isLoaded && isSignedIn,
  });

  const filteredGames = data?.games
    ?.filter((game) => game.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;

        case "mostPlayed":
          comparison = a.playtime_minutes - b.playtime_minutes;
          break;

        case "recentlyPlayed":
          comparison =
            new Date(a.last_played_at ?? 0).getTime() -
            new Date(b.last_played_at ?? 0).getTime();
          break;

        case "recentlyAdded":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  if (!isLoaded) {
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

  if (!isSignedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0924] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-9 w-48 animate-pulse rounded bg-violet-500/20" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-violet-500/10" />
          </div>

          {/* Games skeleton */}
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
              <h1 className="text-3xl font-bold">Library</h1>

              <p className="mt-2 text-sm text-violet-300">
                All your games at one place
              </p>
            </div>

            <span className="text-sm text-violet-400">
              {data.total_count} games
            </span>
          </div>

          {/* Search + Sort */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games..."
                className="w-full rounded-xl border border-violet-500/20 bg-[#171238] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-violet-400/50 focus:border-violet-400/40"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-violet-400">Sort by</span>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="appearance-none rounded-full border border-violet-500/15 bg-[#171238]/80 py-2.5 pl-4 pr-10 text-sm text-violet-100 outline-none transition-all duration-200 hover:cursor-pointer hover:border-violet-400/30 hover:bg-[#1a1540] focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10"
                >
                  <option value="mostPlayed">Most Played</option>

                  <option value="name">Name</option>

                  <option value="recentlyPlayed">Recently Played</option>

                  <option value="recentlyAdded">Recently Added</option>
                </select>

                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="m6 8 4 4 4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Sort direction */}
              <button
                type="button"
                onClick={() =>
                  setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-[#171238] text-violet-300 transition-all duration-200 hover:cursor-pointer hover:border-violet-400/40 hover:bg-[#1d1748] hover:text-white"
                title={sortDirection === "asc" ? "Ascending" : "Descending"}
              >
                <ArrowDown
                  size={17}
                  className={`transition-transform duration-300 ease-out ${
                    sortDirection === "asc" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Games */}
        <div className="space-y-3">
          {filteredGames?.map((game, index) => (
            <MostPlayedGameRow
              key={game.id}
              game={game}
              rank={index + 1}
              showLastPlayed={true}
            />
          ))}

          {/* No search results */}
          {filteredGames?.length === 0 && (
            <div className="rounded-xl border border-violet-500/10 bg-[#171238] px-6 py-12 text-center">
              <Search size={28} className="mx-auto mb-3 text-violet-400/50" />

              <p className="text-sm font-medium text-violet-200">
                No games found
              </p>

              <p className="mt-1 text-xs text-violet-400/60">
                Try a different search term.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
