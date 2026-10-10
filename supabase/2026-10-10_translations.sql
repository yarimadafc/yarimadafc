-- Yarımada FK — stored EN/RU translations of admin-entered content.
-- Run once in Supabase -> SQL Editor. Safe to re-run.
create table if not exists public.translations (
  source     text primary key,          -- original Azerbaijani text
  en         text,
  ru         text,
  updated_at timestamptz not null default now()
);

alter table public.translations enable row level security;
drop policy if exists "public read" on public.translations;
create policy "public read" on public.translations for select to anon, authenticated using (true);
revoke all on public.translations from anon, authenticated;
grant select on public.translations to anon, authenticated;
grant all on public.translations to service_role;
