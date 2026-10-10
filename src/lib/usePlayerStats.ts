'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSyncVersion } from '@/lib/siteSync';
import type { AnyMatch } from '@/lib/matchUtils';

export interface PlayerInfo { id: string; name: string; image_url: string | null; position: string | null; jersey_number: number | null; team_id: string | null }

/** Loads played matches (with line-ups) and the player list once; refreshes when the admin saves. */
export function usePlayerStatsData() {
  const sync = useSyncVersion();
  const [matches, setMatches] = useState<AnyMatch[]>([]);
  const [players, setPlayers] = useState<Record<string, PlayerInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: mt }, { data: pl }] = await Promise.all([
        supabase
          .from('matches')
          .select('id, tournament, home_team, away_team, home_logo, away_logo, home_score, away_score, match_date, date, status, yarimada_lineup')
          .in('status', ['finished', 'live'])
          .order('match_date', { ascending: false }),
        supabase.from('players').select('id, name, image_url, position, jersey_number, team_id'),
      ]);
      if (cancelled) return;
      setMatches(mt || []);
      const map: Record<string, PlayerInfo> = {};
      (pl || []).forEach((p: PlayerInfo) => { map[p.id] = p; });
      setPlayers(map);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [sync]);

  return { matches, players, loading };
}

/** "U-9" < "U-10" < "U-13": sort team names by their number. */
export const byTeamNumber = (a: string, b: string) =>
  (parseInt(a.replace(/\D/g, '')) || 0) - (parseInt(b.replace(/\D/g, '')) || 0) || a.localeCompare(b);
