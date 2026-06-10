export interface PlaySession {
  id: string;
  title: string;
  date: string;
  playtime: string;
}

export type GameStatus = 'playing' | 'backlog' | 'completed' | 'dropped';

export interface Game {
  id: string;
  title: string;
  subtitle?: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  averageRating: number;
  metascore: number;
  genre: string;
  status: GameStatus;
  platform: string[];
  image: string;
  progress: number; // 0 to 100
  playtime: number; // in hours
  achievementsTotal: number;
  achievementsUnlocked: number;
  deaths: number;
  level: number;
  journal: string;
  gallery: string[];
  sessions: PlaySession[];
  lastPlayed?: string; // e.g. "2M AGO" or "2 HOURS AGO"
}

export interface ActivityFeedItem {
  id: string;
  gameId: string;
  type: 'session' | 'achievement' | 'backlog';
  gameTitle: string;
  gameImage: string;
  title: string;
  subtitle: string;
  description: string;
  timestamp: string;
  tags?: string[];
  rarity?: string;
}
