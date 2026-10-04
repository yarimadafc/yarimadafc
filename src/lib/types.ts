// ============================================
// Yarımada FK — Database Types
// ============================================

export interface Team {
  id: string;
  name: string;
  age_group: string;
  description?: string;
  photo_url?: string;
  created_at: string;
}

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  position?: string;
  team_id?: string;
  jersey_number?: number;
  height?: number;
  started_date?: string;
  photo_url?: string;
  games_played: number;
  games_started: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  created_at: string;
  // Joined
  team?: Team;
}

export interface Coach {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  team_id?: string;
  experience?: string;
  license?: string;
  bio?: string;
  photo_url?: string;
  created_at: string;
  // Joined
  team?: Team;
}

export interface Tournament {
  id: string;
  name: string;
  age_group?: string;
  season?: string;
  created_at: string;
}

export interface Match {
  id: string;
  date: string;
  time?: string;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  stadium?: string;
  tournament_id?: string;
  team_id?: string;
  status: 'upcoming' | 'live' | 'completed';
  report?: string;
  head_coach?: string;
  video_url?: string;
  created_at: string;
  // Joined
  tournament?: Tournament;
  team?: Team;
  events?: MatchEvent[];
  lineups?: MatchLineup[];
}

export interface MatchEvent {
  id: string;
  match_id: string;
  player_id?: string;
  event_type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  minute?: number;
  assist_player_id?: string;
  created_at: string;
  // Joined
  player?: Player;
  assist_player?: Player;
}

export interface MatchLineup {
  id: string;
  match_id: string;
  player_id: string;
  is_starter: boolean;
  created_at: string;
  // Joined
  player?: Player;
}

export interface Standing {
  id: string;
  tournament_id: string;
  team_name: string;
  position?: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
  created_at: string;
  // Joined
  tournament?: Tournament;
}

export interface News {
  id: string;
  title_az: string;
  title_ru?: string;
  title_en?: string;
  slug: string;
  content_az?: string;
  content_ru?: string;
  content_en?: string;
  excerpt_az?: string;
  excerpt_ru?: string;
  excerpt_en?: string;
  image_url?: string;
  category?: string;
  author?: string;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  published: boolean;
  published_at: string;
  created_at: string;
}

export interface MediaPhoto {
  id: string;
  url: string;
  caption?: string;
  category?: string;
  created_at: string;
}

export interface MediaVideo {
  id: string;
  youtube_url: string;
  title: string;
  category?: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  type: 'principal' | 'official' | 'partner';
  created_at: string;
}

export interface ContactInfo {
  id: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  maps_embed?: string;
}

export interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Registration {
  id: string;
  child_name: string;
  child_surname: string;
  birth_date?: string;
  parent_name: string;
  phone: string;
  whatsapp?: string;
  age_group?: string;
  branch?: string;
  note?: string;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
}

export interface TrainingSchedule {
  id: string;
  team_id: string;
  day: string;
  time: string;
  stadium?: string;
  coach_id?: string;
  created_at: string;
  // Joined
  team?: Team;
  coach?: Coach;
}

export interface HeroBanner {
  id: string;
  image_url?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ClubInfo {
  id: string;
  about_az?: string;
  about_ru?: string;
  about_en?: string;
  mission_az?: string;
  mission_ru?: string;
  mission_en?: string;
  vision_az?: string;
  vision_ru?: string;
  vision_en?: string;
  values_az?: string;
  values_ru?: string;
  values_en?: string;
  philosophy_az?: string;
  philosophy_ru?: string;
  philosophy_en?: string;
  founded_year?: number;
  updated_at: string;
}

export interface Leadership {
  id: string;
  name: string;
  role: string;
  photo_url?: string;
  bio?: string;
  sort_order: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  year?: number;
  icon_url?: string;
  created_at: string;
}

// News categories
export const NEWS_CATEGORIES = [
  'Klub xəbərləri',
  'Oyun xəbərləri',
  'Akademiya',
  'Uşaq futbolu',
  'Məşqlər',
  'Turnirlər',
  'Futbolçular',
  'Məşqçilər',
  'Rəsmi açıqlamalar',
] as const;

// Player positions
export const PLAYER_POSITIONS = [
  'Qapıçı',
  'Müdafiəçi',
  'Yarımmüdafiəçi',
  'Hücumçu',
] as const;

// Media categories
export const PHOTO_CATEGORIES = ['Oyunlar', 'Məşqlər', 'Turnirlər', 'Tədbirlər'] as const;
export const VIDEO_CATEGORIES = ['Oyun videoları', 'Qollar', 'Məşq videoları', 'Klub videoları'] as const;
