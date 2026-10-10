-- Yarımada FK — site members (registration / user panel).
-- Run once in Supabase -> SQL Editor -> New query -> Run. Safe to re-run.
-- Only ADDS a new table, a function and a trigger on auth.users; no existing table is changed or dropped.

create table if not exists public.member_profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  first_name text,
  last_name  text,
  phone      text,
  birth_date date,
  gender     text check (gender in ('male', 'female')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists member_profiles_created_at_idx on public.member_profiles (created_at desc);

-- Creates the profile automatically when someone signs up (the data comes from the sign-up form).
-- It never raises an error, so a bad value can not block the registration itself.
create or replace function public.handle_new_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  b date;
begin
  begin
    b := nullif(m->>'birth_date', '')::date;
  exception when others then
    b := null;
  end;
  insert into public.member_profiles (user_id, email, first_name, last_name, phone, birth_date, gender)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(left(m->>'first_name', 80), ''),
    nullif(left(m->>'last_name', 80), ''),
    nullif(left(m->>'phone', 40), ''),
    b,
    case when m->>'gender' in ('male', 'female') then m->>'gender' else null end
  )
  on conflict (user_id) do nothing;
  return new;
exception when others then
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_member on auth.users;
create trigger on_auth_user_created_member
  after insert on auth.users
  for each row execute function public.handle_new_member();

-- Row Level Security: a member sees and edits only their own row; the admin panel uses the server key.
alter table public.member_profiles enable row level security;

drop policy if exists "member read own" on public.member_profiles;
create policy "member read own" on public.member_profiles for select to authenticated using (auth.uid() = user_id);

drop policy if exists "member insert own" on public.member_profiles;
create policy "member insert own" on public.member_profiles for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "member update own" on public.member_profiles;
create policy "member update own" on public.member_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on public.member_profiles from anon, authenticated;
grant select on public.member_profiles to authenticated;
grant insert (user_id, email, first_name, last_name, phone, birth_date, gender) on public.member_profiles to authenticated;
grant update (first_name, last_name, phone, birth_date, gender, updated_at) on public.member_profiles to authenticated;
grant all on public.member_profiles to service_role;
