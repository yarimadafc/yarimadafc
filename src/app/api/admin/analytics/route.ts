import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { memberAdminDb } from '@/lib/memberServer';

// day: last 30 days, week: last 12 weeks, month: last 12 months — plus the same-length period before it.
const RANGES = {
  day: { bucket: 'day', ms: 30 * 86400_000 },
  week: { bucket: 'week', ms: 12 * 7 * 86400_000 },
  month: { bucket: 'month', ms: 365 * 86400_000 },
} as const;

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const db = memberAdminDb();
  if (!db) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY təyin olunmayıb.' }, { status: 500 });

  const key = (request.nextUrl.searchParams.get('range') || 'day') as keyof typeof RANGES;
  const range = RANGES[key] || RANGES.day;
  const to = new Date();
  const from = new Date(to.getTime() - range.ms);
  const prevFrom = new Date(from.getTime() - range.ms);
  const dayStart = new Date(to.getTime() - 86400_000);

  const [series, totals, prev, today, pages, products] = await Promise.all([
    db.rpc('site_stats', { p_bucket: range.bucket, p_from: from.toISOString(), p_to: to.toISOString() }),
    db.rpc('site_totals', { p_from: from.toISOString(), p_to: to.toISOString() }),
    db.rpc('site_totals', { p_from: prevFrom.toISOString(), p_to: from.toISOString() }),
    db.rpc('site_totals', { p_from: dayStart.toISOString(), p_to: to.toISOString() }),
    db.rpc('site_top', { p_kind: 'view', p_from: from.toISOString(), p_to: to.toISOString(), p_limit: 10 }),
    db.rpc('site_top', { p_kind: 'order', p_from: from.toISOString(), p_to: to.toISOString(), p_limit: 10 }),
  ]);
  const err = series.error || totals.error;
  if (err) {
    const missing = /site_stats|site_totals|site_events|function|schema cache/i.test(err.message);
    return NextResponse.json({ error: missing ? 'Statistika cədvəli yoxdur. supabase/2026-10-10_analytics.sql faylını SQL Editor-də işlədin.' : err.message }, { status: 500 });
  }
  return NextResponse.json({
    range: key,
    series: series.data ?? [],
    totals: totals.data?.[0] ?? null,
    previous: prev.data?.[0] ?? null,
    last24h: today.data?.[0] ?? null,
    topPages: pages.data ?? [],
    topProducts: products.data ?? [],
  });
}
