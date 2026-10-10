import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/adminGuard';

// Admin-only access to the registered site members. Needs SUPABASE_SERVICE_ROLE_KEY
// (profiles are protected by RLS and deleting an account needs the Auth admin API).
function serviceDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const db = serviceDb();
  if (!db) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY təyin olunmayıb.' }, { status: 500 });

  const { data, error } = await db.from('member_profiles').select('*').order('created_at', { ascending: false }).limit(5000);
  if (error) {
    const missing = /member_profiles|relation|schema cache/i.test(error.message);
    return NextResponse.json({ error: missing ? 'member_profiles cədvəli yoxdur. supabase/2026-10-10_members.sql faylını SQL Editor-də işlədin.' : error.message }, { status: 500 });
  }
  return NextResponse.json({ members: data ?? [] });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const db = serviceDb();
  if (!db) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY təyin olunmayıb.' }, { status: 500 });

  const { id } = await request.json().catch(() => ({ id: null }));
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Yanlış id.' }, { status: 400 });
  // deleting the Auth user also removes the profile (on delete cascade)
  const { error } = await db.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
