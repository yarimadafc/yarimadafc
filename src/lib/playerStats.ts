import { isYarimada, type AnyMatch } from '@/lib/matchUtils';

// Player statistics are derived from the match line-ups the admin fills in
// (matches.yarimada_lineup: one entry per player with goals / assists / minutes),
// so the numbers always match the published games. On top of that the admin can add numbers per
// player (players.stat_* — admin -> Komandalar -> Heyət statistikası), e.g. games before the site existed.

export const MANUAL_STAT_FIELDS = ['stat_games', 'stat_starts', 'stat_goals', 'stat_assists', 'stat_minutes', 'stat_yellow', 'stat_red'] as const;
export type ManualStatField = typeof MANUAL_STAT_FIELDS[number];

/** A players row (select '*, teams(name)'); stat_* columns may be missing before the SQL update. */
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

const counted = (m: AnyMatch) => m.status === 'finished' || m.status === 'live';

export function buildPlayerStats(matches: AnyMatch[], filter: { team?: string; season?: string } = {}, manual: ManualStatsPlayer[] = []): PlayerStat[] {
  const map = new Map<string, PlayerStat>();
  for (const m of matches) {
    if (!counted(m)) continue;
    const date = m.match_date || m.date || null;
    if (filter.team && (m.tournament || '') !== filter.team) continue;
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
      if (m.tournament && !s.teams.includes(m.tournament)) s.teams.push(m.tournament);
      s.matches.push({ matchId: m.id, date, opponent, opponentLogo, score, goals, assists, minutes, starter: !!p.is_starting });
    }
  }
  // admin-entered extras have no date, so they count for "all seasons" only
  if (!filter.season) addManualStats(map, manual, filter.team);

  const list = [...map.values()];
  list.forEach(s => s.matches.sort((a, b) => (b.date || '').localeCompare(a.date || '')));
  return list;
}

const nameKey = (name: string) => `name:${name.trim().toLocaleLowerCase('az')}`;

function addManualStats(map: Map<string, PlayerStat>, players: ManualStatsPlayer[], team?: string) {
  for (const p of players) {
    const n = (f: ManualStatField) => Math.max(0, Number(p[f]) || 0);
    if (!p?.name || MANUAL_STAT_FIELDS.every(f => n(f) === 0)) continue;
    const teamName = p.teams?.name || '';
    if (team && teamName.trim().toLocaleLowerCase('az') !== team.trim().toLocaleLowerCase('az')) continue;
    let s = map.get(p.id) || map.get(nameKey(p.name));
    if (!s) {
      s = { key: p.id, playerId: p.id, name: p.name, number: p.jersey_number != null ? String(p.jersey_number) : null, position: p.position || null, teams: [], games: 0, starts: 0, goals: 0, assists: 0, minutes: 0, yellow: 0, red: 0, matches: [] };
      map.set(p.id, s);
    }
    if (!s.playerId) s.playerId = p.id;
    if (teamName && !s.teams.includes(teamName)) s.teams.push(teamName);
    s.games += n('stat_games');
    s.starts += n('stat_starts');
    s.goals += n('stat_goals');
    s.assists += n('stat_assists');
    s.minutes += n('stat_minutes');
    s.yellow += n('stat_yellow');
    s.red += n('stat_red');
  }
}

export const byGoals = (a: PlayerStat, b: PlayerStat) => b.goals - a.goals || b.assists - a.assists || a.games - b.games || a.name.localeCompare(b.name);
export const byAssists = (a: PlayerStat, b: PlayerStat) => b.assists - a.assists || b.goals - a.goals || a.games - b.games || a.name.localeCompare(b.name);
