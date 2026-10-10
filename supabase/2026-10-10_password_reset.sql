-- Yarımada FK — one-time codes for "forgot password" (sent by email through Resend).
-- Run once in Supabase -> SQL Editor -> New query -> Run. Safe to re-run.
-- Only ADDS a new table; no existing table is changed. Codes are stored hashed, never in plain text.

create table if not exists public.password_reset_codes (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  code_hash  text not null,
  expires_at timestamptz not null,
  attempts   integer not null default 0,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists password_reset_codes_user_idx on public.password_reset_codes (user_id, created_at desc);

-- Only the server (service role) may read or write codes.
alter table public.password_reset_codes enable row level security;
revoke all on public.password_reset_codes from anon, authenticated;
grant all on public.password_reset_codes to service_role;
