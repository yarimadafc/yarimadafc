-- ============================================================================
-- Yarımada FK — admin upgrades (team order, club staff, tickets, player stats)
--
-- Run once in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Only ADDS columns (if they are missing) — no table is dropped, no row is deleted.
-- Safe to run again.
-- ============================================================================

-- 1) Team order (admin -> Komandalar: up / down arrows). Shown in this order everywhere on the site.
alter table public.teams add column if not exists sort_order integer not null default 0;

-- Initial order: oldest age group first (U-13, U-12, U-11 ...), teams without a number last.
-- Runs only while every team still has sort_order = 0, so a later re-run never overwrites the admin's order.
do $$
begin
  if not exists (select 1 from public.teams where sort_order <> 0) then
    with ranked as (
      select id,
             row_number() over (
               order by nullif(regexp_replace(name, '\D', '', 'g'), '')::int desc nulls last, name
             ) as rn
      from public.teams
    )
    update public.teams t set sort_order = r.rn from ranked r where r.id = t.id;
  end if;
end $$;

-- 2) Club leadership / club staff: both live in "leadership", told apart by group_type.
--    Existing people stay in "Klub rəhbərliyi".
alter table public.leadership add column if not exists group_type text not null default 'leadership'; -- leadership | staff
create index if not exists leadership_group_type_idx on public.leadership(group_type);

-- 3) Tickets (admin -> Biletlər), per match.
alter table public.matches add column if not exists ticket_enabled boolean not null default true;
alter table public.matches add column if not exists ticket_price   text;
alter table public.matches add column if not exists ticket_note    text;
alter table public.matches add column if not exists ticket_url     text;

-- 4) Squad statistics (admin -> Komandalar -> Heyət statistikası).
--    Added on top of the numbers calculated from match line-ups.
alter table public.players add column if not exists stat_games   integer not null default 0;
alter table public.players add column if not exists stat_starts  integer not null default 0;
alter table public.players add column if not exists stat_goals   integer not null default 0;
alter table public.players add column if not exists stat_assists integer not null default 0;
alter table public.players add column if not exists stat_minutes integer not null default 0;
alter table public.players add column if not exists stat_yellow  integer not null default 0;
alter table public.players add column if not exists stat_red     integer not null default 0;

-- Let the API see the new columns right away.
notify pgrst, 'reload schema';
