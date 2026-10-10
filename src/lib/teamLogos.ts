'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSyncVersion } from '@/lib/siteSync';

// Club-wide logo registry: one logo per team name, stored in `site_images` as
// `team_logo:<normalized name>`. Filled from the standings admin and automatically from every
// logo uploaded for a match, so a team's crest shows everywhere (tables, fixtures, cards).

export const LOGO_PREFIX = 'team_logo:';
export const normalizeTeamName = (name?: string | null) =>
  (name || '').trim().toLocaleLowerCase('az').replace(/\s+/g, ' ');
export const teamLogoKey = (name: string) => LOGO_PREFIX + normalizeTeamName(name);

let cache: Record<string, string> = {};
let cacheVersion = -1;
let inflight: Promise<Record<string, string>> | null = null;
const listeners = new Set<(m: Record<string, string>) => void>();

async function fetchLogos(): Promise<Record<string, string>> {
  const { data } = await supabase.from('site_images').select('section_key, image_url').like('section_key', `${LOGO_PREFIX}%`);
  const map: Record<string, string> = {};
  (data || []).forEach((r: { section_key: string; image_url: string }) => {
    if (r.image_url) map[r.section_key.slice(LOGO_PREFIX.length)] = r.image_url;
  });
  return map;
}

function load(version: number) {
  if (cacheVersion === version) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetchLogos()
      .then(map => {
        cache = map;
        cacheVersion = version;
        listeners.forEach(l => l(map));
        return map;
      })
      .catch(() => cache)
      .finally(() => { inflight = null; });
  }
  return inflight;
}

/** Returns a lookup: team name -> registered logo URL (or undefined). One request shared by all logos. */
export function useTeamLogos() {
  const sync = useSyncVersion();
  const [map, setMap] = useState(cache);
  useEffect(() => {
    listeners.add(setMap);
    load(sync).then(setMap);
    return () => { listeners.delete(setMap); };
  }, [sync]);
  return (name?: string | null) => map[normalizeTeamName(name)];
}
