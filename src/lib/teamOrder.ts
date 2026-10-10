'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSyncVersion } from '@/lib/siteSync';

// One team order for the whole site: the admin's order (teams.sort_order), and until the admin sets one,
// the oldest age group first (U-13, U-12, U-11 ...). Matches and standings refer to a team by its name
// (matches.tournament / standings.tournament_name), so names are compared case-insensitively.

/** "U-13" -> 13, "U13 Liqası" -> 13, "Böyüklər" -> null */
export function ageOf(name?: string | null): number | null {
  const m = String(name || '').match(/\d+/);
  return m ? Number(m[0]) : null;
}

const byAge = (a: string, b: string) =>
  (ageOf(b) ?? -1) - (ageOf(a) ?? -1) || a.localeCompare(b, 'az');

type TeamLike = { name: string; sort_order?: number | null };

/** Sorts team rows: admin order first, then age (oldest first), then name. Missing sort_order counts as 0. */
export function sortTeams<T extends TeamLike>(teams: T[]): T[] {
  return [...teams].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || byAge(a.name, b.name));
}

const key = (name: string) => name.trim().toLocaleLowerCase('az');

/** Comparator for team names in the given team order; names that are not a team go last (by age). */
export function teamNameComparator(ordered: TeamLike[]) {
  const rank = new Map(ordered.map((t, i) => [key(t.name), i]));
  return (a: string, b: string) => {
    const ra = rank.get(key(a)) ?? Infinity;
    const rb = rank.get(key(b)) ?? Infinity;
    return ra === rb ? byAge(a, b) : ra - rb;
  };
}

/** Teams in site order (reloads when the admin saves). */
export function useOrderedTeams<T extends TeamLike = TeamLike & { id: string }>(select = '*') {
  const sync = useSyncVersion();
  const [teams, setTeams] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    // select('*') + client-side sort keeps working even before the sort_order column exists
    supabase.from('teams').select(select).then(({ data }) => {
      if (cancelled) return;
      setTeams(sortTeams((data || []) as unknown as T[]));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [sync, select]);
  const compareNames = useMemo(() => teamNameComparator(teams), [teams]);
  return { teams, loading, compareNames };
}
