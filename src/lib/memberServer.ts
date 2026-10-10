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

/** "ab***@gmail.com" — enough to recognise an address in the logs without storing it in full. */
export const maskEmail = (email: string) => email.replace(/^(.{0,2})[^@]*/, '$1***');

type AdminDb = NonNullable<ReturnType<typeof memberAdminDb>>;

/**
 * Finds a member by email. Uses member_profiles first; if the profile row is missing (account
 * created before the table/trigger existed) it looks the user up in Supabase Auth and restores the row.
 */
export async function findMemberByEmail(db: AdminDb, email: string): Promise<{ user_id: string; first_name: string | null } | null> {
  const { data: profile } = await db.from('member_profiles').select('user_id, first_name').eq('email', email).maybeSingle();
  if (profile?.user_id) return profile;

  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    const user = data.users.find(u => (u.email || '').toLowerCase() === email);
    if (user) {
      const m = (user.user_metadata || {}) as Record<string, string | undefined>;
      await db.from('member_profiles').upsert({
        user_id: user.id, email,
        first_name: m.first_name || null, last_name: m.last_name || null, phone: m.phone || null,
        birth_date: m.birth_date || null, gender: m.gender === 'male' || m.gender === 'female' ? m.gender : null,
      }, { onConflict: 'user_id', ignoreDuplicates: true });
      return { user_id: user.id, first_name: m.first_name || null };
    }
    if (data.users.length < 1000) break;
  }
  return null;
}
