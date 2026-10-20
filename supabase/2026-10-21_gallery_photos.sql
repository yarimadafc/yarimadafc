-- Photo gallery ("Foto və video" page). Photos are uploaded to ImgBB (fallback: Supabase Storage),
-- only their URLs and captions are stored here. Videos stay in public.videos.
-- Only ADDS a table; no existing table or row is changed. Safe to re-run.

create table if not exists public.gallery_photos (
  id         uuid primary key default gen_random_uuid(),
  title      text,
  image_url  text not null,
  thumb_url  text,
  width      integer,
  height     integer,
  created_at timestamptz not null default now()
);

create index if not exists gallery_photos_created_at_idx on public.gallery_photos (created_at desc);

alter table public.gallery_photos enable row level security;
drop policy if exists "public read" on public.gallery_photos;
create policy "public read" on public.gallery_photos for select to anon, authenticated using (true);
revoke all on public.gallery_photos from anon, authenticated;
grant select on public.gallery_photos to anon, authenticated;
grant all on public.gallery_photos to service_role;
