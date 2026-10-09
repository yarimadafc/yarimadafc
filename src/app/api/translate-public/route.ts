import { NextRequest, NextResponse } from 'next/server';
import translate from 'google-translate-api-x';

// Public, rate-limited translation of site content (news titles, descriptions...) for the language switcher.
const MAX_TEXTS = 25;
const MAX_LEN = 600;
const CACHE_LIMIT = 5000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 90;

// "Yarımada" is the club name but also a common word (peninsula): keep it out of the translator.
const BRAND = /Yar[ıiIİ]mada/g;
const MARK = '[[1]]';
const protect = (t: string) => t.replace(BRAND, MARK);
const restore = (t: string) => t.split(MARK).join('Yarımada');

const cache = new Map<string, string>();
const hits = new Map<string, { count: number; resetAt: number }>();

function allowed(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) { hits.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return true; }
  entry.count += 1;
  return entry.count <= MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (!allowed(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const { texts, to } = await request.json();
    if (!Array.isArray(texts) || (to !== 'en' && to !== 'ru')) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
    const list: string[] = texts.slice(0, MAX_TEXTS).map((t: unknown) => String(t ?? '').slice(0, MAX_LEN));

    const result: Record<string, string> = {};
    const missing: string[] = [];
    for (const text of list) {
      const hit = cache.get(`${to}\u0000${text}`);
      if (hit !== undefined) result[text] = hit; else missing.push(text);
    }

    for (let i = 0; i < missing.length; i += 5) {
      const chunk = missing.slice(i, i + 5);
      const settled = await Promise.allSettled(chunk.map(t => translate(protect(t), { from: 'az', to })));
      settled.forEach((r, idx) => {
        const text = chunk[idx];
        if (r.status === 'fulfilled' && r.value?.text) {
          const out = restore(r.value.text);
          result[text] = out;
          if (cache.size > CACHE_LIMIT) cache.clear();
          cache.set(`${to}\u0000${text}`, out);
        }
      });
    }
    return NextResponse.json({ translations: result });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
