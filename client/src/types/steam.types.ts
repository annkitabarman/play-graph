export interface MostPlayedGame {
  id: string;
  name: string;
  image_url: string;
  playtime_minutes: number;
  playtime_2weeks: number;
}

export interface MostPlayedResponse {
  total_count: number;
  games: MostPlayedGame[];
}
