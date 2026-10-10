import { createClient } from '@supabase/supabase-js';
import translate from 'google-translate-api-x';

// Stored translations of admin-entered content (table `translations`: source -> en, ru).
// Filled automatically when the admin saves, read by the public site when the language changes.

export type Lang = 'en' | 'ru';

const BRAND = /Yar[ıiIİ]mada/g;
const MARK = '[[1]]';
const protect = (t: string) => t.replace(BRAND, MARK);
const restore = (t: string) => t.split(MARK).join('Yarımada');

export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !url.startsWith('http')) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function machineTranslate(text: string, to: Lang): Promise<string | null> {
  try {
    const res = await translate(protect(text), { from: 'az', to });
    return res?.text ? restore(res.text) : null;
  } catch {
    return null;
  }
}

// Fields whose values are free text written by the admin (names are deliberately excluded).
const FIELDS: Record<string, string[]> = {
  news: ['title_az', 'content_az', 'category'],
  matches: ['tournament'],
  standings: ['tournament_name'],
  teams: ['league', 'description'],
  players: ['position'],
  coaches: ['role', 'bio'],
  leadership: ['position', 'bio'],
  achievements: ['title', 'description'],
  coach_courses: ['title', 'description'],
  videos: ['title'],
  products: ['title', 'description', 'colors'],
  transfers: ['transfer_type'],
  hero_slides: ['title', 'subtitle'],
};

const isText = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 1 && !/^(https?:|data:|\/)/.test(v.trim()) && /[A-Za-zƏəİıÖöÜüŞşÇçĞğ]/.test(v);

/** Collect the translatable strings from an admin write. Long text is split into paragraphs (as rendered). */
export function collectTexts(table: string, payload: unknown, filters: [string, unknown][] = []): string[] {
  const rows = Array.isArray(payload) ? payload : payload ? [payload] : [];
  const out = new Set<string>();
  const push = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(push);
    if (!isText(v)) return;
    v.split(/\n+/).map(p => p.trim()).filter(p => p.length > 1).forEach(p => out.add(p.slice(0, 1500)));
  };
  for (const row of rows as Record<string, unknown>[]) {
    if (table === 'site_images') {
      const key = String(row.section_key ?? filters.find(([c]) => c === 'section_key')?.[1] ?? '');
      if (!/(_bg|_img|_ids)$/.test(key) && !key.startsWith('quick_')) push(row.image_url);
      continue;
    }
    (FIELDS[table] || []).forEach(f => push(row[f]));
  }
  return [...out];
}

/** Translate texts that are not stored yet and save them. Never throws. */
export async function translateAndStore(texts: string[]): Promise<number> {
  const db = serviceClient();
  if (!db || texts.length === 0) return 0;
  try {
    const { data: existing, error } = await db.from('translations').select('source').in('source', texts);
    if (error) return 0; // table missing -> feature disabled
    const have = new Set((existing || []).map((r: { source: string }) => r.source));
    const todo = texts.filter(t => !have.has(t)).slice(0, 40);
    const rows: { source: string; en: string | null; ru: string | null }[] = [];
    for (let i = 0; i < todo.length; i += 5) {
      const chunk = todo.slice(i, i + 5);
      const results = await Promise.all(chunk.map(async t => ({ source: t, en: await machineTranslate(t, 'en'), ru: await machineTranslate(t, 'ru') })));
      rows.push(...results.filter(r => r.en || r.ru));
    }
    if (rows.length) await db.from('translations').upsert(rows, { onConflict: 'source' });
    return rows.length;
  } catch {
    return 0;
  }
}
