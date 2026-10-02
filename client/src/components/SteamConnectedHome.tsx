import { getSteamDashBoard, syncSteam } from "../apis/steam.api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import CurrentOrLastPlayGame from "./CurrentOrLastPlayedGame";
import StatsCard from "./StatsCard";
import PlaytimePieChart from "../charts/PlaytimePieChart";
import { ChartNoAxesColumn, Clock3, Gamepad2 } from "lucide-react";
import DailyPlayTimeChart from "../charts/DailyPlayTimeChart";

export default function SteamConnectedHome() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["steam", "dashboard"],
    queryFn: getSteamDashBoard,
  });

  // const {
  //   data: recentlyPlayed,
  //   isLoading: recentlyPlayedLoading,
  //   isError: recentlyPlayedError,
  // } = useQuery({
  //   queryKey: ["steam", "recently-played"],
  //   queryFn: getRecentlyPlayedGames,
  // });

  // console.log(recentlyPlayed, recentlyPlayedLoading, recentlyPlayedError);
  const queryClient = useQueryClient();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const syncMutation = useMutation({
    mutationFn: syncSteam,
    onSuccess: (response) => {
      // Refresh dashboard data after sync
      // We'll invalidate the query here
      console.log("Response", response);
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
            onClick={() => syncMutation.mutate(timezone)}
            disabled={syncMutation.isPending}
            className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {syncMutation.isPending ? "Syncing..." : "Sync Steam"}
          </button>
        </div>
        <div className="mb-5">
          <CurrentOrLastPlayGame />
        </div>

        {/* Stats */}
        <div className="grid gap-1 grid-cols-3 items-start">
          {/* Left side - cards */}
          <div className="grid gap-5 grid-cols-3 lg:col-span-3">
            <StatsCard
              header="Games"
              value={data.total_games}
              icon={Gamepad2}
              note="games in your library"
            />

            <StatsCard
              header="Total Playtime"
              value={`${(data.total_play_time_minutes / 60).toFixed(1)}h`}
              icon={Clock3}
              note={`${data.total_play_time_minutes.toLocaleString()} minutes played`}
            />
            <StatsCard
              header="Average per Game"
              value={`${(
                data.total_play_time_minutes /
                data.total_games /
                60
              ).toFixed(1)}h`}
              icon={ChartNoAxesColumn}
              note={`${Math.floor(data.total_play_time_minutes / data.total_games)} minutes per game`}
            />
          </div>
        </div>

        <div className="my-5 flex w-full items-stretch gap-5">
          {/* Genre chart */}
          <div className="min-w-0 flex-1">
            <div className="h-full w-full rounded-2xl border border-violet-500/20 bg-[#171238] p-5">
              <h3 className="mb-2 ml-12 text-sm font-semibold tracking-wider text-violet-200">
                Daily playtime
              </h3>

              <DailyPlayTimeChart />
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
      </div>
    </div>
  );
}
