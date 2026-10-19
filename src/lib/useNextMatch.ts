'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AnyMatch, isFinished, isLiveMatch, matchStart, normalizeMatch, teamKey } from '@/lib/matchUtils';
import { useSyncVersion } from '@/lib/siteSync';
import { ageOf } from '@/lib/teamOrder';

/** Age groups featured on the home page, in this order. */
export const FEATURED_AGES = [13, 12];

const GRACE_MS = 3 * 60 * 60 * 1000; // keep a match "current" for 3h after kick-off
const REFRESH_MS = 20000;

const startOf = (m: AnyMatch) => matchStart(m)?.getTime() ?? 0;

/** Live first, then the one flagged "is_hero", then the nearest upcoming one. */
function pickNext(rows: AnyMatch[], now: number): AnyMatch | null {
  const open = rows.filter(m => !isFinished(m, now)).sort((a, b) => startOf(a) - startOf(b));
  const current = (m: AnyMatch) => {
    const s = matchStart(m);
    return !s || s.getTime() + GRACE_MS >= now;
  };
  return open.find(isLiveMatch) || open.find(m => m.is_hero && current(m)) || open.find(current) || null;
}

/** Most recent played match (marked finished, or past with a score entered). */
function pickLast(rows: AnyMatch[], now: number): AnyMatch | null {
  return rows.filter(m => isFinished(m, now)).sort((a, b) => startOf(b) - startOf(a))[0] || null;
}

// All matches, refreshed every 20 s and right after an admin save, so new scores and fixtures show up by themselves.
function useMatches() {
  const [state, setState] = useState<{ rows: AnyMatch[]; now: number; loading: boolean }>({ rows: [], now: 0, loading: true });
  const sync = useSyncVersion();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: false }).limit(300);
      if (!cancelled) setState({ rows: (data || []).map(normalizeMatch), now: Date.now(), loading: false });
    }
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => { cancelled = true; clearInterval(id); };
  }, [sync]);

  return state;
}

/** The single match for the top strip: across all teams. */
export function useNextMatch() {
  const { rows, now, loading } = useMatches();
  return { match: loading ? null : pickNext(rows, now), loading };
}

export type FeaturedTeam = { key: string; name: string; age: number | null; next: AnyMatch | null; last: AnyMatch | null };

/** Next match + last result for each featured age group (U-13, U-12), each team on its own. */
export function useFeaturedMatches() {
  const { rows, now, loading } = useMatches();
  const groups = new Map<string, AnyMatch[]>();
  rows.forEach(m => {
    const age = ageOf(m.tournament);
    if (age === null || !FEATURED_AGES.includes(age)) return;
    const key = teamKey(m.tournament);
    groups.set(key, [...(groups.get(key) || []), m]);
  });
  let teams: FeaturedTeam[] = [...groups.entries()]
    .map(([key, list]) => ({ key, name: String(list[0].tournament || '').trim(), age: ageOf(list[0].tournament), next: pickNext(list, now), last: pickLast(list, now) }))
    .sort((a, b) => FEATURED_AGES.indexOf(a.age ?? -1) - FEATURED_AGES.indexOf(b.age ?? -1));
  // no U-13 / U-12 matches yet: fall back to all matches
  if (!teams.length && rows.length) teams = [{ key: 'all', name: '', age: null, next: pickNext(rows, now), last: pickLast(rows, now) }];
  return { teams, loading };
}
