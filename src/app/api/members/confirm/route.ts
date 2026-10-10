import { NextRequest, NextResponse } from 'next/server';
import { clientIp, findMemberByEmail, memberAdminDb, tooManyRequests } from '@/lib/memberServer';
import { validEmail } from '@/lib/memberValidation';

// Accounts created while "Confirm email" was on in Supabase can not log in until confirmed.
// Email confirmation is not used on this site, so such an account is confirmed here on login.
export async function POST(request: NextRequest) {
  if (tooManyRequests(`confirm:${clientIp(request.headers)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: 'Çox sayda cəhd. Bir az sonra yenidən cəhd edin.' }, { status: 429 });
  }
  const { email } = await request.json().catch(() => ({ email: '' }));
  if (typeof email !== 'string' || !validEmail(email)) return NextResponse.json({ ok: false }, { status: 400 });
  const db = memberAdminDb();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });

  const profile = await findMemberByEmail(db, email.trim().toLowerCase());
  if (!profile) return NextResponse.json({ ok: false });
  const { error } = await db.auth.admin.updateUserById(profile.user_id, { email_confirm: true });
  return NextResponse.json({ ok: !error });
}
