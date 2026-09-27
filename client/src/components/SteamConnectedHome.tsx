import { getSteamDashBoard, syncSteam } from "../apis/steam.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
          <p className="mb-2 text-sm font-medium text-violet-400">PLAYGRAPH</p>

          <h1 className="text-4xl font-bold tracking-tight">
            Your Gaming Activity
          </h1>

          <p className="mt-2 text-zinc-400">A snapshot of your gaming life.</p>
          <button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {syncMutation.isPending ? "Syncing..." : "Sync Steam"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Total Games */}
          <div className="relative overflow-hidden rounded-[20px] border border-violet-500/30 bg-[#171238] px-5 py-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            {/* Neon top border */}
            <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-cyan-400 to-violet-500" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-base font-medium text-violet-300">Games</p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/5">
                <span className="text-lg">🎮</span>
              </div>
            </div>

            {/* Value */}
            <p className="mt-5 text-4xl font-bold tracking-tight text-white">
              {data.total_games}
            </p>

            <p className="mt-1 text-sm text-violet-300">
              games in your library
            </p>
          </div>

          {/* Total Playtime */}
          <div className="relative overflow-hidden rounded-[20px] border border-violet-500/30 bg-[#171238] px-5 py-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            {/* Neon top border */}
            <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-pink-500 to-fuchsia-400" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-base font-medium text-violet-300">
                Total playtime
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/5">
                <span className="text-lg">⏱</span>
              </div>
            </div>

            {/* Value */}
            <p className="mt-5 text-4xl font-bold tracking-tight text-white">
              {(data.total_play_time_minutes / 60).toFixed(1)}h
            </p>

            <p className="mt-1 text-sm text-violet-300">
              {data.total_play_time_minutes.toLocaleString()} minutes played
            </p>
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
