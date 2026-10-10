'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AnyMatch, isLiveMatch, matchStart, normalizeMatch } from '@/lib/matchUtils';
import { useSyncVersion } from '@/lib/siteSync';
import { ageOf } from '@/lib/teamOrder';

const FEATURED_AGES = [13, 12];

const GRACE_MS = 3 * 60 * 60 * 1000; // keep a match "current" for 3h after kick-off

// Picks the match to feature: live first, then the one flagged "is_hero", then the nearest upcoming.
export function useNextMatch() {
  const [match, setMatch] = useState<AnyMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const sync = useSyncVersion();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from('matches')
        .select('*')
        .neq('status', 'finished')
        .order('match_date', { ascending: true })
        .limit(30);
      if (cancelled) return;
      const rows = (data || []).map(normalizeMatch);
      const now = Date.now();
      const current = (m: AnyMatch) => {
        const s = matchStart(m);
        return !s || s.getTime() + GRACE_MS >= now;
      };
      const pick =
        rows.find(isLiveMatch) ||
        rows.find(m => m.is_hero && current(m)) ||
        rows.find(current) ||
        null;
      setMatch(pick);
      setLoading(false);
    }
    load();
    // refresh so admin changes (start / score / finish) appear without reloading the page
    const id = setInterval(load, 20000);
    return () => { cancelled = true; clearInterval(id); };
  }, [sync]);

  return { match, loading };
}

/** Most recent finished match (for the "last result" card) — the U-13 / U-12 teams first, as on the rest of the home page. */
export function useLastResult() {
  const [match, setMatch] = useState<AnyMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const sync = useSyncVersion();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'finished')
        .order('match_date', { ascending: false })
        .limit(30);
      if (cancelled) return;
      const rows = (data || []).map(normalizeMatch);
      rows.sort((a, b) => (matchStart(b)?.getTime() ?? 0) - (matchStart(a)?.getTime() ?? 0));
      setMatch(rows.find(m => FEATURED_AGES.includes(ageOf(m.tournament) ?? -1)) || rows[0] || null);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [sync]);

  return { match, loading };
}
