-- Blocks accounts created straight through the public Supabase sign-up API (bypassing the site form),
-- e.g. a bare email + password with no name. The site's own sign-up (/api/members/signup) always sends
-- these fields, so real registrations are not affected.
-- Only ADDS a function and a trigger on auth.users; no table or existing row is changed.
-- Note: users added by hand in the Supabase dashboard also need first_name / last_name in their metadata.

create or replace function public.require_member_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if length(trim(coalesce(m->>'first_name', ''))) < 2
     or length(trim(coalesce(m->>'last_name', ''))) < 2
     or coalesce(m->>'gender', '') not in ('male', 'female')
     or length(regexp_replace(coalesce(m->>'phone', ''), '\D', '', 'g')) < 9
     or coalesce(m->>'birth_date', '') !~ '^\d{4}-\d{2}-\d{2}$' then
    raise exception 'Registration data is incomplete' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_require_profile on auth.users;
create trigger on_auth_user_require_profile
  before insert on auth.users
  for each row execute function public.require_member_profile();
