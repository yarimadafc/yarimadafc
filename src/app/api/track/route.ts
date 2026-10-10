import { NextRequest, NextResponse } from 'next/server';
import { clientIp, memberAdminDb, tooManyRequests } from '@/lib/memberServer';

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|lighthouse|pingdom|uptime/i;

// Stores anonymous statistics events (see lib/track.ts). Always answers 204 so it never disturbs the page.
export async function POST(request: NextRequest) {
  const ok = new NextResponse(null, { status: 204 });
  if (BOT.test(request.headers.get('user-agent') || '')) return ok;
  if (tooManyRequests(`track:${clientIp(request.headers)}`, 120, 60_000)) return ok;

  const body = await request.json().catch(() => null);
  if (!body || (body.kind !== 'view' && body.kind !== 'order')) return ok;
  const str = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
  const path = str(body.path, 200);
  if (!path || !path.startsWith('/') || path.startsWith('/admin') || path.startsWith('/api')) return ok;

  const db = memberAdminDb();
  if (!db) return ok;
  await db.from('site_events').insert({
    kind: body.kind,
    path,
    label: str(body.label, 160),
    visitor_id: str(body.visitor_id, 64),
    referrer: str(body.referrer, 120),
  });
  return ok;
}
