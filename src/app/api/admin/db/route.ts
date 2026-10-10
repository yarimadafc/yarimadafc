import { NextRequest, NextResponse, after } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/adminGuard';
import { collectTexts, translateAndStore } from '@/lib/contentTranslate';
import { broadcastSiteChange } from '@/lib/siteSyncServer';

const ALLOWED_TABLES = new Set([
  'achievements', 'coach_courses', 'coaches', 'hero_slides', 'leadership', 'matches',
  'news', 'players', 'products', 'site_images', 'sponsors', 'standings', 'teams', 'transfers', 'videos',
]);
const ALLOWED_ACTIONS = new Set(['insert', 'update', 'upsert', 'delete']);

// Uses the service-role key when configured (so RLS can deny public writes); falls back to the anon key.
function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { table, action, payload, options, filters, returning } = await request.json();

    if (!ALLOWED_TABLES.has(table) || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: { message: 'Invalid table or action' } }, { status: 400 });
    }
    const eqFilters: [string, unknown][] = Array.isArray(filters) ? filters : [];
    if ((action === 'update' || action === 'delete') && eqFilters.length === 0) {
      return NextResponse.json({ error: { message: 'Filter required' } }, { status: 400 });
    }

    const client = getServerClient();
    if (!client) {
      return NextResponse.json({ error: { message: 'Database is not configured' } }, { status: 500 });
    }

    const base = client.from(table);
    let query = action === 'insert' ? base.insert(payload)
      : action === 'update' ? base.update(payload)
      : action === 'upsert' ? base.upsert(payload, options)
      : base.delete();
    for (const [column, value] of eqFilters) query = query.eq(column, value);
    const { data, error } = returning ? await query.select() : await query;

    if (error) return NextResponse.json({ data: null, error: { message: error.message } });

    // Respond immediately; notifying open sites and storing EN/RU translations happen after the
    // response (translation used to block the save for up to 9 s and froze the admin panel).
    const texts = action === 'delete' ? [] : collectTexts(table, payload, eqFilters);
    after(async () => {
      await broadcastSiteChange(table);
      if (texts.length && (await translateAndStore(texts)) > 0) await broadcastSiteChange('translations');
    });
    return NextResponse.json({ data: data ?? null, error: null });
  } catch {
    return NextResponse.json({ error: { message: 'Request failed' } }, { status: 500 });
  }
}

// Leaves room for the post-response translation work.
export const maxDuration = 60;
