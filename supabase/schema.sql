-- ============================================================================
-- Yarımada FK — Supabase schema (tables + Row Level Security)
--
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
--
-- Security model:
--   * Everyone (anon) can only READ (select).
--   * Nobody can write with the public anon key.
--   * The admin panel writes through /api/admin/db, which uses
--     SUPABASE_SERVICE_ROLE_KEY (service_role bypasses RLS).
--
-- Columns are derived from the site code (src/app/admin/components/* and the
-- public pages). Re-running this file is safe only AFTER the old tables are
-- deleted (it uses "create table", not "if not exists", on purpose so that an
-- old table with a different structure cannot be silently kept).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- (OPTIONAL) Delete the old tables first. Uncomment ONLY if you want SQL to do
-- it instead of the dashboard. THIS PERMANENTLY DELETES ALL DATA IN THEM.
-- ---------------------------------------------------------------------------
-- drop table if exists
--   public.players, public.coaches, public.teams, public.matches, public.standings,
--   public.news, public.transfers, public.videos, public.hero_slides, public.products,
--   public.sponsors, public.achievements, public.coach_courses, public.leadership,
--   public.site_images
-- cascade;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  league      text,
  age_group   text,
  description text,
  created_at  timestamptz not null default now()
);

create table public.players (
  id            uuid primary key default gen_random_uuid(),
  team_id       uuid references public.teams(id) on delete cascade,
  name          text not null,
  position      text,
  jersey_number integer,
  image_url     text,
  birth_date    date,
  created_at    timestamptz not null default now()
);
create index players_team_id_idx on public.players(team_id);

create table public.coaches (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  bio        text,
  license    text,
  image_url  text,
  team_id    uuid references public.teams(id) on delete set null,
  created_at timestamptz not null default now()
);
create index coaches_team_id_idx on public.coaches(team_id);

create table public.leadership (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  position   text,
  bio        text,
  image_url  text,
  order_num  integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.matches (
  id                uuid primary key default gen_random_uuid(),
  tournament        text,
  home_team         text not null,
  away_team         text not null,
  match_date        date,
  match_time        text,
  stadium           text,
  home_logo         text,
  away_logo         text,
  home_score        integer,
  away_score        integer,
  status            text not null default 'upcoming',   -- upcoming | live | finished
  is_hero           boolean not null default false,
  -- live timer
  timer_status      text not null default 'stopped',
  timer_started_at  timestamptz,
  elapsed_seconds   integer not null default 0,
  half_1_duration   integer not null default 45,
  halftime_duration integer not null default 15,
  half_2_duration   integer not null default 45,
  extra_time_1      integer not null default 0,
  extra_time_2      integer not null default 0,
  -- line-ups (arrays of player objects)
  yarimada_lineup   jsonb not null default '[]'::jsonb,
  away_lineup       jsonb not null default '[]'::jsonb,
  -- legacy columns: a few public pages (standings page, home "matches" blocks)
  -- still query "date"/"time". Kept nullable so those queries do not error.
  date              text,
  time              text,
  created_at        timestamptz not null default now()
);

create table public.standings (
  id              uuid primary key default gen_random_uuid(),
  tournament_name text,
  team_name       text not null,
  played          integer not null default 0,
  won             integer not null default 0,
  drawn           integer not null default 0,
  lost            integer not null default 0,
  gf              integer not null default 0,
  ga              integer not null default 0,
  points          integer not null default 0,
  created_at      timestamptz not null default now()
);

create table public.news (
  id         uuid primary key default gen_random_uuid(),
  title_az   text not null,
  content_az text,
  category   text,
  image_url  text,
  published  boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.transfers (
  id            uuid primary key default gen_random_uuid(),
  player_name   text not null,
  from_team     text,
  to_team       text,
  transfer_type text,
  date          text,          -- text on purpose: the admin form may send an empty string
  image_url     text,
  created_at    timestamptz not null default now()
);

create table public.videos (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  url            text not null,
  thumbnail_url  text,
  published_date timestamptz default now(),
  created_at     timestamptz not null default now()
);

create table public.hero_slides (
  id         uuid primary key default gen_random_uuid(),
  title      text,
  subtitle   text,
  link_url   text,
  image_url  text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  price           numeric(10,2),
  description     text,
  whatsapp_number text,
  images          text[] not null default '{}',
  colors          text[] not null default '{}',
  sizes           text[] not null default '{}',
  created_at      timestamptz not null default now()
);

create table public.sponsors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo_url   text,
  created_at timestamptz not null default now()
);

create table public.achievements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  count       text,
  description text,
  image_url   text,
  order_num   integer not null default 0,
  created_at  timestamptz not null default now()
);

create table public.coach_courses (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  video_url   text,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- Key/value store for page images and texts (section_key must be unique:
-- the admin uses upsert ... on conflict (section_key)).
create table public.site_images (
  id          uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: public read-only, no public writes
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'teams', 'players', 'coaches', 'leadership', 'matches', 'standings', 'news',
    'transfers', 'videos', 'hero_slides', 'products', 'sponsors', 'achievements',
    'coach_courses', 'site_images'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    -- explicit grants: read-only for the public keys, full access for the server key
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Check (optional): every row below must show rls_enabled = true
-- ---------------------------------------------------------------------------
-- select tablename, rowsecurity as rls_enabled from pg_tables
-- where schemaname = 'public' order by tablename;
