export interface MostPlayedGame {
  id: string;
  name: string;
  image_url: string;
  playtime_minutes: number;
  playtime_2weeks: number;
  external_id: number;
  last_played_at: string;
  created_at: string;
}

export interface MostPlayedResponse {
  total_count: number;
  games: MostPlayedGame[];
}
