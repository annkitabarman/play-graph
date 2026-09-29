import { useQuery } from "@tanstack/react-query";
import { getDailyPlayTime } from "../apis/steam.api";

export default function DailyPlayTimeChart() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["steam", "daily-play-time"],
    queryFn: getDailyPlayTime,
  });

  console.log(data, isLoading, isError, error);
  return <></>;
}
