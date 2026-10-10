-- ============================================================================
-- Yarımada FK — per-game statistics typed in by the admin
-- (admin -> Futbolçu Statistikası -> click a player -> "Oyun əlavə et").
-- Each player gets a list of games: [{ id, date, opponent, score, goals, assists, minutes }].
-- Only ADDS a column; nothing is deleted. Safe to run again.
-- ============================================================================
alter table public.players add column if not exists match_log jsonb not null default '[]'::jsonb;

notify pgrst, 'reload schema';
