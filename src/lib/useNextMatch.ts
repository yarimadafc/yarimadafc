'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AnyMatch, isLiveMatch, matchStart, normalizeMatch } from '@/lib/matchUtils';

const GRACE_MS = 3 * 60 * 60 * 1000; // keep a match "current" for 3h after kick-off

// Picks the match to feature: live first, then the one flagged "is_hero", then the nearest upcoming.
export function useNextMatch() {
  const [match, setMatch] = useState<AnyMatch | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return { match, loading };
}
