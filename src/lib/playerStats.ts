import { isFinished, isYarimada, sameTeam, type AnyMatch } from '@/lib/matchUtils';

// Player statistics are derived from the match line-ups the admin fills in
// (matches.yarimada_lineup: one entry per player with goals / assists / minutes),
// so the numbers always match the published games. On top of that the admin can add numbers per
// player (players.stat_* — admin -> Komandalar -> Heyət statistikası), e.g. games before the site existed.

export const MANUAL_STAT_FIELDS = ['stat_games', 'stat_starts', 'stat_goals', 'stat_assists', 'stat_minutes', 'stat_yellow', 'stat_red'] as const;
export type ManualStatField = typeof MANUAL_STAT_FIELDS[number];

/** A game typed in by the admin for one player (players.match_log), e.g. games before the site existed. */
export interface ManualMatch {
  id: string;
  date: string | null;
  opponent: string;
  score: string;
  goals: number;
  assists: number;
  minutes: number;
  starter?: boolean;
}

/** A players row (select '*, teams(name)'); stat_* / match_log columns may be missing before the SQL update. */
export interface ManualStatsPlayer {
  id: string;
  name: string;
  jersey_number?: number | null;
  position?: string | null;
  teams?: { name?: string | null } | null;
  [field: string]: unknown;
}

export interface LineupEntry {
  id: string;            // players.id, or "manual_..." for a name typed in by hand
  name: string;
  number?: string | number | null;
  position?: string | null;
  is_starting?: boolean;
  played?: boolean;
  goals?: number;
  assists?: number;
  minutes?: number | null;
  events?: string[];     // 'yellow_card' | 'red_card' | 'injury' (+ legacy 'goal')
}

export interface PlayerMatchLine {
  matchId: string;
  date: string | null;
  opponent: string;
  opponentLogo: string | null;
  score: string;
  goals: number;
  assists: number;
  minutes: number;
  starter: boolean;
  /** 'match' = from a game's line-up (Oyunlar), 'manual' = typed in under Futbolçu Statistikası */
  source: 'match' | 'manual';
}

export interface PlayerStat {
  key: string;
  playerId: string | null;
  name: string;
  number: string | null;
  position: string | null;
  teams: string[];
  games: number;
  starts: number;
  goals: number;
  assists: number;
  minutes: number;
  yellow: number;
  red: number;
  matches: PlayerMatchLine[];
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const entryGoals = (p: LineupEntry) => Number(p.goals ?? (p.events?.includes('goal') ? 1 : 0)) || 0;
export const entryAssists = (p: LineupEntry) => Number(p.assists ?? 0) || 0;
export const entryPlayed = (p: LineupEntry) =>
  p.played ?? (!!p.is_starting || entryGoals(p) > 0 || entryAssists(p) > 0 || Number(p.minutes) > 0);

/** Football season of a date: August–July, e.g. 2025-10-01 -> "2025/26". */
export function seasonOf(date?: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const start = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
  return `${start}/${String(start + 1).slice(2)}`;
}

const counted = (m: AnyMatch) => isFinished(m) || m.status === 'live';

/** Games of our teams that count for the statistics (played or live), with the same team / season filter. */
export function countedMatches(matches: AnyMatch[], filter: { team?: string; season?: string } = {}): AnyMatch[] {
  return matches.filter(m => counted(m) && (!filter.team || sameTeam(m.tournament, filter.team)) && (!filter.season || seasonOf(m.match_date || m.date) === filter.season));
}

export function buildPlayerStats(matches: AnyMatch[], filter: { team?: string; season?: string } = {}, manual: ManualStatsPlayer[] = []): PlayerStat[] {
  const map = new Map<string, PlayerStat>();
  for (const m of matches) {
    if (!counted(m)) continue;
    const date = m.match_date || m.date || null;
    if (filter.team && !sameTeam(m.tournament, filter.team)) continue;
    if (filter.season && seasonOf(date) !== filter.season) continue;
    const lineup: LineupEntry[] = Array.isArray(m.yarimada_lineup) ? m.yarimada_lineup : [];
    const homeIsUs = isYarimada(m.home_team) || !isYarimada(m.away_team);
    const opponent = homeIsUs ? m.away_team : m.home_team;
    const opponentLogo = (homeIsUs ? m.away_logo : m.home_logo) || null;
    const score = m.home_score != null && m.away_score != null ? `${m.home_score}:${m.away_score}` : '—';

    for (const p of lineup) {
      if (!p?.name || !entryPlayed(p)) continue;
      const playerId = p.id && UUID.test(p.id) ? p.id : null;
      const key = playerId || `name:${p.name.trim().toLocaleLowerCase('az')}`;
      let s = map.get(key);
      if (!s) {
        s = { key, playerId, name: p.name, number: p.number != null && p.number !== '' ? String(p.number) : null, position: p.position || null, teams: [], games: 0, starts: 0, goals: 0, assists: 0, minutes: 0, yellow: 0, red: 0, matches: [] };
        map.set(key, s);
      }
      const goals = entryGoals(p);
      const assists = entryAssists(p);
      const minutes = Number(p.minutes) || 0;
      s.games += 1;
      if (p.is_starting) s.starts += 1;
      s.goals += goals;
      s.assists += assists;
      s.minutes += minutes;
      if (p.events?.includes('yellow_card')) s.yellow += 1;
      if (p.events?.includes('red_card')) s.red += 1;
      if (m.tournament && !s.teams.some(t => sameTeam(t, m.tournament))) s.teams.push(m.tournament);
      s.matches.push({ matchId: m.id, date, opponent, opponentLogo, score, goals, assists, minutes, starter: !!p.is_starting, source: 'match' });
    }
  }
  addManualStats(map, manual, filter);
  applyCurrentDetails(map, manual);
  mergeSamePlayer(map, manual);

  const list = [...map.values()];
  list.forEach(s => s.matches.sort((a, b) => (b.date || '').localeCompare(a.date || '')));
  return list;
}

const nameKey = (name: string) => `name:${name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('az')}`;

// Line-ups keep the name / number a player had when the game was saved; show the current ones from
// Komandalar instead, so renaming a player or changing the shirt number updates every page.
function applyCurrentDetails(map: Map<string, PlayerStat>, players: ManualStatsPlayer[]) {
  const byId = new Map(players.filter(p => p?.id).map(p => [p.id, p]));
  for (const s of map.values()) {
    const p = s.playerId ? byId.get(s.playerId) : undefined;
    if (!p) continue;
    if (p.name?.trim()) s.name = p.name.trim();
    if (p.jersey_number != null) s.number = String(p.jersey_number);
    if (p.position) s.position = p.position;
  }
}

// One row per person. Line-up entries typed by name get the registered player of that name (for the profile
// link), and rows with the same full name are joined: in the academy that is the same child playing for
// two age groups (invited to the U-12 and registered in the U-13, for example).
function mergeSamePlayer(map: Map<string, PlayerStat>, players: ManualStatsPlayer[]) {
  const registered = new Map<string, ManualStatsPlayer[]>();
  players.forEach(p => { if (p?.name) registered.set(nameKey(p.name), [...(registered.get(nameKey(p.name)) || []), p]); });
  const groups = new Map<string, [string, PlayerStat][]>();
  for (const entry of map.entries()) groups.set(nameKey(entry[1].name), [...(groups.get(nameKey(entry[1].name)) || []), entry]);

  for (const [k, rows] of groups) {
    // keep the row of the player with the most games (a registered one first)
    rows.sort(([, a], [, b]) => Number(!!b.playerId) - Number(!!a.playerId) || b.games - a.games);
    const [, into] = rows[0];
    if (!into.playerId) {
      const same = registered.get(k);
      if (same?.length === 1) {
        into.playerId = same[0].id;
        into.number ??= same[0].jersey_number != null ? String(same[0].jersey_number) : null;
      }
    }
    for (const [key, s] of rows.slice(1)) {
      into.games += s.games; into.starts += s.starts; into.goals += s.goals; into.assists += s.assists;
      into.minutes += s.minutes; into.yellow += s.yellow; into.red += s.red;
      into.matches.push(...s.matches);
      s.teams.forEach(t => { if (!into.teams.some(x => sameTeam(x, t))) into.teams.push(t); });
      into.number ??= s.number;
      into.position ??= s.position;
      map.delete(key);
    }
  }
}

const num = (v: unknown) => Math.max(0, Number(v) || 0);

export function matchLogOf(p: { [field: string]: unknown }): ManualMatch[] {
  return Array.isArray(p.match_log) ? (p.match_log as ManualMatch[]).filter(e => e && typeof e === 'object') : [];
}

function addManualStats(map: Map<string, PlayerStat>, players: ManualStatsPlayer[], filter: { team?: string; season?: string }) {
  for (const p of players) {
    if (!p?.name) continue;
    const teamName = p.teams?.name || '';
    if (filter.team && !sameTeam(teamName, filter.team)) continue;
    // the stat_* totals have no date, so they count for "all seasons" only; typed-in games follow the season filter
    const n = (f: ManualStatField) => (filter.season ? 0 : num(p[f]));
    const log = matchLogOf(p).filter(e => !filter.season || seasonOf(e.date) === filter.season);
    if (MANUAL_STAT_FIELDS.every(f => n(f) === 0) && log.length === 0) continue;
    let s = map.get(p.id) || map.get(nameKey(p.name));
    if (!s) {
      s = { key: p.id, playerId: p.id, name: p.name, number: p.jersey_number != null ? String(p.jersey_number) : null, position: p.position || null, teams: [], games: 0, starts: 0, goals: 0, assists: 0, minutes: 0, yellow: 0, red: 0, matches: [] };
      map.set(p.id, s);
    }
    if (!s.playerId) s.playerId = p.id;
    if (teamName && !s.teams.some(t => sameTeam(t, teamName))) s.teams.push(teamName);
    s.games += n('stat_games');
    s.starts += n('stat_starts');
    s.goals += n('stat_goals');
    s.assists += n('stat_assists');
    s.minutes += n('stat_minutes');
    s.yellow += n('stat_yellow');
    s.red += n('stat_red');
    for (const e of log) {
      const line: PlayerMatchLine = {
        matchId: `manual-${e.id}`, date: e.date || null, opponent: e.opponent || '—', opponentLogo: null,
        score: e.score || '—', goals: num(e.goals), assists: num(e.assists), minutes: num(e.minutes), starter: !!e.starter, source: 'manual',
      };
      s.games += 1;
      if (line.starter) s.starts += 1;
      s.goals += line.goals;
      s.assists += line.assists;
      s.minutes += line.minutes;
      s.matches.push(line);
    }
  }
}

/** The statistics row of a player (rows are one per person, see mergeSamePlayer). */
export function findPlayerStat(all: PlayerStat[], player: { id: string; name?: string | null }): PlayerStat | null {
  const k = player.name ? nameKey(player.name) : '';
  return all.find(s => s.playerId === player.id) || (k ? all.find(s => nameKey(s.name) === k) : undefined) || null;
}

export const byGoals = (a: PlayerStat, b: PlayerStat) => b.goals - a.goals || b.assists - a.assists || a.games - b.games || a.name.localeCompare(b.name);
export const byAssists = (a: PlayerStat, b: PlayerStat) => b.assists - a.assists || b.goals - a.goals || a.games - b.games || a.name.localeCompare(b.name);
