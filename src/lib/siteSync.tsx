'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Admin -> public site sync. `useSyncVersion()` returns a number that increases whenever content
// may have changed; data-loading effects list it as a dependency and simply load again.
// Triggers: Supabase Realtime broadcast sent by the server after every admin write (all devices),
// BroadcastChannel from an admin tab in the same browser (instant), and returning to the tab.

const SyncContext = createContext(0);
const FOCUS_MIN_GAP = 30_000;

export function SiteSyncProvider({ children, enabled = true }: { children: React.ReactNode; enabled?: boolean }) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let last = Date.now();
    // several writes in a row (e.g. saving a team) -> one reload
    const bump = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { last = Date.now(); setVersion(v => v + 1); }, 400);
    };

    const channel = supabase.channel?.('site-sync');
    channel?.on?.('broadcast', { event: 'changed' }, bump).subscribe?.();

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('yarimada-sync');
      bc.onmessage = bump;
    } catch { /* unsupported */ }

    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - last > FOCUS_MIN_GAP) bump();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      if (timer) clearTimeout(timer);
      if (channel) supabase.removeChannel?.(channel);
      bc?.close();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled]);

  return <SyncContext.Provider value={version}>{children}</SyncContext.Provider>;
}

export const useSyncVersion = () => useContext(SyncContext);
