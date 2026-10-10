'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/** Current signed-in site member (Supabase Auth). `loading` is true until the stored session was checked. */
export function useMember() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return { user, loading };
}

/** Signs the member out on this device (works offline too) and clears the stored session. */
export async function signOutMember() {
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
}

export * from '@/lib/memberValidation';
