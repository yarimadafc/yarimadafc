-- Yarımada FK — site statistics (visits, shop orders, registrations) for the admin panel.
-- Run once in Supabase -> SQL Editor -> New query -> Run. Safe to re-run.
-- Only ADDS a table and three read functions; no existing table is changed.
-- Needs member_profiles (2026-10-10_members.sql) to exist.

create table if not exists public.site_events (
  id         bigint generated always as identity primary key,
  kind       text not null check (kind in ('view', 'order')),
  path       text,
  label      text,            -- product title for orders
  visitor_id text,            -- random id kept in the visitor's browser (no personal data)
  referrer   text,            -- referring site (host only)
  created_at timestamptz not null default now()
);
create index if not exists site_events_created_idx on public.site_events (created_at);
create index if not exists site_events_kind_created_idx on public.site_events (kind, created_at);

-- Written and read only by the server (service role); the public keys have no access.
alter table public.site_events enable row level security;
revoke all on public.site_events from anon, authenticated;
grant all on public.site_events to service_role;

-- Time series per day / week / month (Baku time).
create or replace function public.site_stats(p_bucket text, p_from timestamptz, p_to timestamptz)
returns table (bucket date, views bigint, visitors bigint, orders bigint, registrations bigint)
language plpgsql stable security definer set search_path = public
as $$
declare
  b text := case when p_bucket in ('day', 'week', 'month') then p_bucket else 'day' end;
begin
  return query
  with s as (
    select generate_series(
      date_trunc(b, p_from at time zone 'Asia/Baku'),
      date_trunc(b, (p_to - interval '1 second') at time zone 'Asia/Baku'),
      ('1 ' || b)::interval
    ) as k
  ),
  e as (
    select date_trunc(b, created_at at time zone 'Asia/Baku') as k,
           count(*) filter (where kind = 'view') as v,
           count(distinct visitor_id) filter (where kind = 'view') as u,
           count(*) filter (where kind = 'order') as o
    from site_events
    where created_at >= p_from and created_at < p_to
    group by 1
  ),
  r as (
    select date_trunc(b, created_at at time zone 'Asia/Baku') as k, count(*) as n
    from member_profiles
    where created_at >= p_from and created_at < p_to
    group by 1
  )
  select s.k::date, coalesce(e.v, 0), coalesce(e.u, 0), coalesce(e.o, 0), coalesce(r.n, 0)
  from s left join e on e.k = s.k left join r on r.k = s.k
  order by s.k;
end;
$$;

-- Totals for a period (unique visitors counted over the whole period, not summed per day).
create or replace function public.site_totals(p_from timestamptz, p_to timestamptz)
returns table (views bigint, visitors bigint, orders bigint, registrations bigint)
language sql stable security definer set search_path = public
as $$
  select
    (select count(*) from site_events where kind = 'view' and created_at >= p_from and created_at < p_to),
    (select count(distinct visitor_id) from site_events where kind = 'view' and created_at >= p_from and created_at < p_to),
    (select count(*) from site_events where kind = 'order' and created_at >= p_from and created_at < p_to),
    (select count(*) from member_profiles where created_at >= p_from and created_at < p_to);
$$;

-- Most visited pages (kind 'view') or most ordered products (kind 'order').
create or replace function public.site_top(p_kind text, p_from timestamptz, p_to timestamptz, p_limit int default 10)
returns table (name text, total bigint)
language sql stable security definer set search_path = public
as $$
  select coalesce(case when p_kind = 'order' then label else path end, '—') as name, count(*) as total
  from site_events
  where kind = p_kind and created_at >= p_from and created_at < p_to
  group by 1
  order by 2 desc, 1
  limit least(greatest(p_limit, 1), 50);
$$;

revoke all on function public.site_stats(text, timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.site_totals(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.site_top(text, timestamptz, timestamptz, int) from public, anon, authenticated;
grant execute on function public.site_stats(text, timestamptz, timestamptz) to service_role;
grant execute on function public.site_totals(timestamptz, timestamptz) to service_role;
grant execute on function public.site_top(text, timestamptz, timestamptz, int) to service_role;
