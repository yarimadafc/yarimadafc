'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/track';

// Records one page view per navigation on the public site (not in the admin panel).
export default function SiteTracker() {
  const pathname = usePathname();
  const last = useRef<{ path: string; at: number } | null>(null);
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    const now = Date.now();
    if (last.current && last.current.path === pathname && now - last.current.at < 30_000) return; // ignore quick reloads
    last.current = { path: pathname, at: now };
    trackEvent('view', { path: pathname });
  }, [pathname]);
  return null;
}
