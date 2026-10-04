-- ============================================
-- YARIMADA FK — Supabase Database Schema
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- 1. Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age_group TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Coaches
CREATE TABLE IF NOT EXISTS coaches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  experience TEXT,
  license TEXT,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Players
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE,
  position TEXT,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  jersey_number INTEGER,
  height INTEGER,
  started_date DATE,
  photo_url TEXT,
  games_played INTEGER DEFAULT 0,
  games_started INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age_group TEXT,
  season TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Matches
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time TIME,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  stadium TEXT,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  report TEXT,
  head_coach TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Match Events
CREATE TABLE IF NOT EXISTS match_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('goal', 'yellow_card', 'red_card', 'substitution')),
  minute INTEGER,
  assist_player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Match Lineups
CREATE TABLE IF NOT EXISTS match_lineups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  is_starter BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Standings
CREATE TABLE IF NOT EXISTS standings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  position INTEGER,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. News (multi-language)
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_az TEXT NOT NULL,
  title_ru TEXT,
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  content_az TEXT,
  content_ru TEXT,
  content_en TEXT,
  excerpt_az TEXT,
  excerpt_ru TEXT,
  excerpt_en TEXT,
  image_url TEXT,
  category TEXT,
  author TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Media Photos
CREATE TABLE IF NOT EXISTS media_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Media Videos
CREATE TABLE IF NOT EXISTS media_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  type TEXT DEFAULT 'partner' CHECK (type IN ('principal', 'official', 'partner')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Contact Info (single row)
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  instagram TEXT,
  facebook TEXT,
  youtube TEXT,
  tiktok TEXT,
  maps_embed TEXT
);

-- Insert default contact row
INSERT INTO contact_info (address, phone, email) VALUES ('Bakı, Azərbaycan', '+994', 'info@yarimadafc.az');

-- 14. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. Registrations
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_name TEXT NOT NULL,
  child_surname TEXT NOT NULL,
  birth_date DATE,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  age_group TEXT,
  branch TEXT,
  note TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 16. Training Schedule
CREATE TABLE IF NOT EXISTS training_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  stadium TEXT,
  coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 17. Hero Banners
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT,
  title TEXT,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 18. Club Info (single row, multi-language)
CREATE TABLE IF NOT EXISTS club_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  about_az TEXT,
  about_ru TEXT,
  about_en TEXT,
  mission_az TEXT,
  mission_ru TEXT,
  mission_en TEXT,
  vision_az TEXT,
  vision_ru TEXT,
  vision_en TEXT,
  values_az TEXT,
  values_ru TEXT,
  values_en TEXT,
  philosophy_az TEXT,
  philosophy_ru TEXT,
  philosophy_en TEXT,
  founded_year INTEGER DEFAULT 2023,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default club info
INSERT INTO club_info (about_az, founded_year) VALUES ('Yarımada FK 2023-cü ildə Bakıda təsis edilmiş futbol akademiyasıdır.', 2023);

-- 19. Leadership
CREATE TABLE IF NOT EXISTS leadership (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 20. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS) - Allow public read
-- ============================================
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read" ON players FOR SELECT USING (true);
CREATE POLICY "Public read" ON coaches FOR SELECT USING (true);
CREATE POLICY "Public read" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public read" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read" ON match_events FOR SELECT USING (true);
CREATE POLICY "Public read" ON match_lineups FOR SELECT USING (true);
CREATE POLICY "Public read" ON standings FOR SELECT USING (true);
CREATE POLICY "Public read" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public read" ON media_photos FOR SELECT USING (true);
CREATE POLICY "Public read" ON media_videos FOR SELECT USING (true);
CREATE POLICY "Public read" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public read" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Public read" ON training_schedule FOR SELECT USING (true);
CREATE POLICY "Public read" ON hero_banners FOR SELECT USING (active = true);
CREATE POLICY "Public read" ON club_info FOR SELECT USING (true);
CREATE POLICY "Public read" ON leadership FOR SELECT USING (true);
CREATE POLICY "Public read" ON achievements FOR SELECT USING (true);

-- Public insert for forms
CREATE POLICY "Public insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON registrations FOR INSERT WITH CHECK (true);

-- Anon full access for admin (using service role in API routes)
-- For development, allow anon to do everything
CREATE POLICY "Anon full access" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON coaches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON tournaments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON match_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON match_lineups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON standings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON media_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON media_videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON sponsors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON contact_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON contact_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON training_schedule FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON hero_banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON club_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON leadership FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access" ON achievements FOR ALL USING (true) WITH CHECK (true);
