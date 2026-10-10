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

export const GENDERS = [
  { value: 'male', label: 'Kişi' },
  { value: 'female', label: 'Qadın' },
] as const;

export type Gender = (typeof GENDERS)[number]['value'];

export function ageFromBirth(birth?: string | null, now = new Date()): number | null {
  if (!birth) return null;
  const d = new Date(birth);
  if (isNaN(d.getTime())) return null;
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

/** Returns an error message (Azerbaijani UI text) or null when the value is fine. */
export function validateBirth(birth: string): string | null {
  const d = new Date(birth);
  if (!birth || isNaN(d.getTime())) return 'Doğum tarixini seçin.';
  const age = ageFromBirth(birth);
  if (age === null || age < 0 || age > 100) return 'Doğum tarixi düzgün deyil.';
  return null;
}

export const normalizePhone = (v: string) => v.replace(/[^\d+]/g, '');
export const validPhone = (v: string) => normalizePhone(v).replace(/\D/g, '').length >= 9;
export const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Maps Supabase Auth errors to UI text that has an AZ/EN/RU dictionary entry. */
export function authErrorText(message?: string): string {
  const m = (message || '').toLowerCase();
  if (m.includes('already registered') || m.includes('already been registered')) return 'Bu email artıq qeydiyyatdan keçib. Daxil olun.';
  if (m.includes('invalid login')) return 'Email və ya parol yanlışdır.';
  if (m.includes('password') && (m.includes('least') || m.includes('weak') || m.includes('short'))) return 'Parol ən azı 6 simvol olmalıdır.';
  if (m.includes('rate limit') || m.includes('too many') || m.includes('seconds')) return 'Çox sayda cəhd. Bir az sonra yenidən cəhd edin.';
  if (m.includes('email not confirmed')) return 'Email təsdiqlənməyib.';
  if (m.includes('valid email') || m.includes('invalid email')) return 'Email düzgün deyil.';
  if (m.includes('network') || m.includes('fetch')) return 'Şəbəkə xətası. İnternetinizi yoxlayın.';
  return 'Xəta baş verdi. Yenidən cəhd edin.';
}
