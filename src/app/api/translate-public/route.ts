import { NextRequest, NextResponse } from 'next/server';
import { machineTranslate, serviceClient } from '@/lib/contentTranslate';

// Translations for the public language switcher.
// GET  ?lang=en|ru  -> every stored translation (admin content, translated on save)
// POST {texts,to}   -> translate text not stored yet (stored ones first, then machine translation; kept in memory only,
//                     so anonymous visitors cannot write into the database)
const MAX_TEXTS = 25;
const MAX_LEN = 1500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 90;

const memory = new Map<string, string>();
const hits = new Map<string, { count: number; resetAt: number }>();

function allowed(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) { hits.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return true; }
  entry.count += 1;
  return entry.count <= MAX_REQUESTS;
}

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang');
  if (lang !== 'en' && lang !== 'ru') return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  const db = serviceClient();
  const map: Record<string, string> = {};
  if (db) {
    const { data } = await db.from('translations').select(`source, ${lang}`).not(lang, 'is', null).limit(5000);
    (data || []).forEach((r: any) => { if (r[lang]) map[r.source] = r[lang]; });
  }
  return NextResponse.json({ translations: map }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (!allowed(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const { texts, to } = await request.json();
    if (!Array.isArray(texts) || (to !== 'en' && to !== 'ru')) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
    const list: string[] = [...new Set(texts.slice(0, MAX_TEXTS).map((t: unknown) => String(t ?? '').slice(0, MAX_LEN)))];
    const result: Record<string, string> = {};
    const db = serviceClient();

    let missing = list.filter(t => {
      const hit = memory.get(`${to}\u0000${t}`);
      if (hit) result[t] = hit;
      return !hit;
    });

    if (db && missing.length) {
      const { data } = await db.from('translations').select(`source, ${to}`).in('source', missing);
      (data || []).forEach((r: any) => { if (r[to]) { result[r.source] = r[to]; memory.set(`${to}\u0000${r.source}`, r[to]); } });
      missing = missing.filter(t => !result[t]);
    }

    for (let i = 0; i < missing.length; i += 5) {
      const chunk = missing.slice(i, i + 5);
      const out = await Promise.all(chunk.map(t => machineTranslate(t, to)));
      out.forEach((tr, idx) => {
        if (!tr) return;
        result[chunk[idx]] = tr;
        if (memory.size > 5000) memory.clear();
        memory.set(`${to}\u0000${chunk[idx]}`, tr);
      });
    }
    return NextResponse.json({ translations: result });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
