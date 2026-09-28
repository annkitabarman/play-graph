import { getSteamDashBoard, syncSteam } from "../apis/steam.api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import CurrentOrLastPlayGame from "./CurrentOrLastPlayedGame";
import StatsCard from "./StatsCard";
import PlaytimePieChart from "../charts/PlaytimePieChart";
import GenreBarChart from "../charts/GenreBarChart";

export default function SteamConnectedHome() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["steam", "dashboard"],
    queryFn: getSteamDashBoard,
  });
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: syncSteam,
    onSuccess: () => {
      // Refresh dashboard data after sync
      // We'll invalidate the query here
      queryClient.invalidateQueries({
        queryKey: ["steam", "dashboard"],
      });
    },
  });

  if (isLoading) {
    return <div>Loading your gaming activity.</div>;
  }

  if (isError) {
    return <div>Failed to load dashboard: {error.message}</div>;
  }

  return (
    <div className="min-h-screen px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {syncMutation.isPending ? "Syncing..." : "Sync Steam"}
          </button>
        </div>
        <div className="my-5">
          <CurrentOrLastPlayGame />
        </div>

        {/* Stats */}
        <div className="grid gap-5 lg:grid-cols-3 items-start">
          {/* Left side - cards */}
          <div className="grid gap-5 md:grid-cols-2 lg:col-span-2">
            <StatsCard
              header="Games"
              value={data.total_games}
              icon="🎮"
              note="games in your library"
            />

            <StatsCard
              header="Total Playtime"
              value={`${(data.total_play_time_minutes / 60).toFixed(1)}h`}
              icon="⏱"
              note={`${data.total_play_time_minutes.toLocaleString()} minutes played`}
            />
          </div>
        </div>

        <div className="my-5 flex w-full items-stretch gap-5">
          {/* Genre chart */}
          <div className="min-w-0 flex-1">
            <div className="h-full w-full rounded-2xl border border-violet-500/20 bg-[#171238] p-5">
              <h3 className="mb-2 text-sm font-semibold tracking-wider text-violet-200">
                Genres played
              </h3>

              <GenreBarChart data={data.top_genres} />
            </div>
          </div>

          {/* Playtime chart */}
          <div className="w-[240px] shrink-0">
            <div className="h-full w-full rounded-2xl border border-violet-500/20 bg-[#171238] p-5">
              <h3 className="mb-2 text-sm font-semibold tracking-wider text-violet-200">
                Playtime Distribution
              </h3>

              <PlaytimePieChart
                data={data.playtime_distribution}
                totalGames={data.total_games}
              />
            </div>
          </div>
        </div>

        {/* Activity section */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Gaming Overview</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Your Steam activity at a glance
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-zinc-500">Games</p>

              <p className="mt-1 text-2xl font-semibold">{data.total_games}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Playtime</p>

              <p className="mt-1 text-2xl font-semibold">
                {(data.total_play_time_minutes / 60).toFixed(1)}h
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Average per game</p>

              <p className="mt-1 text-2xl font-semibold">
                {data.total_games > 0
                  ? (
                      data.total_play_time_minutes /
                      data.total_games /
                      60
                    ).toFixed(1)
                  : "0"}
                h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
