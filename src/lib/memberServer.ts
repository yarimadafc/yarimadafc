import { createClient } from '@supabase/supabase-js';

export function memberAdminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Small per-instance limiter (serverless instances are short-lived, so this only stops bursts).
const hits = new Map<string, number[]>();
export function tooManyRequests(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const list = (hits.get(key) || []).filter(t => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

export const clientIp = (h: Headers) => (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
