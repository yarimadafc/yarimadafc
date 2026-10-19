'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncVersion } from '@/lib/siteSync';

// For pages rendered on the server: re-renders them when the admin changes content (like the client pages do).
export default function SyncRefresh() {
  const router = useRouter();
  const sync = useSyncVersion();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    router.refresh();
  }, [sync, router]);
  return null;
}
