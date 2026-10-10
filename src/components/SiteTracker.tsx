'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { trackEvent, visitorId } from '@/lib/track';
import { PRESENCE_CHANNEL } from '@/lib/presence';

// Records one page view per navigation on the public site (not in the admin panel)
// and keeps this visitor in the live "who is on the site now" list while the tab is visible.
export default function SiteTracker() {
  const pathname = usePathname();
  const last = useRef<{ path: string; at: number } | null>(null);
  const channel = useRef<RealtimeChannel | null>(null);
  const joined = useRef(false);
  const pathRef = useRef(pathname);
  const isPublic = !!pathname && !pathname.startsWith('/admin');

  useEffect(() => {
    if (!isPublic) return;
    const now = Date.now();
    if (last.current && last.current.path === pathname && now - last.current.at < 30_000) return; // ignore quick reloads
    last.current = { path: pathname, at: now };
    trackEvent('view', { path: pathname });
  }, [pathname, isPublic]);

  // live presence
  useEffect(() => {
    if (!isPublic || (navigator as Navigator & { webdriver?: boolean }).webdriver) return;
    const ch = supabase.channel?.(PRESENCE_CHANNEL, { config: { presence: { key: visitorId() } } });
    if (!ch?.subscribe) return;
    channel.current = ch;
    const since = Date.now();
    const announce = () => {
      if (!joined.current) return;
      if (document.visibilityState === 'visible') ch.track({ path: pathRef.current, since }).catch(() => {});
      else ch.untrack().catch(() => {});
    };
    ch.subscribe(status => {
      joined.current = status === 'SUBSCRIBED';
      announce();
    });
    document.addEventListener('visibilitychange', announce);
    return () => {
      document.removeEventListener('visibilitychange', announce);
      joined.current = false;
      supabase.removeChannel?.(ch);
      channel.current = null;
    };
  }, [isPublic]);

  // tell the admin which page this visitor is on now
  useEffect(() => {
    pathRef.current = pathname;
    if (joined.current && document.visibilityState === 'visible') {
      channel.current?.track({ path: pathname, since: Date.now() }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
