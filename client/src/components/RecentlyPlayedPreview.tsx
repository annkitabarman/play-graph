import { useQuery } from "@tanstack/react-query";
import { getRecentlyPlayedGames } from "../apis/steam.api";
export default function RecentlyPlayedPreview() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["steam", "recently-played"],
    queryFn: getRecentlyPlayedGames,
  });

  return <></>;
}
