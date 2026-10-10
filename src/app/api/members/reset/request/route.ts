import { NextRequest, NextResponse } from 'next/server';
import { clientIp, memberAdminDb, tooManyRequests } from '@/lib/memberServer';
import { validEmail } from '@/lib/memberValidation';
import { CODE_TTL_MIN, hashCode, newCode, sendResetEmail } from '@/lib/resetCode';

// Step 1 of "forgot password": emails a 6-digit code. Always answers the same way whether or not
// the email has an account, so nobody can use this form to find out who is registered.
export async function POST(request: NextRequest) {
  const done = NextResponse.json({ ok: true });
  if (tooManyRequests(`reset-req:${clientIp(request.headers)}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: 'Çox sayda cəhd. Bir az sonra yenidən cəhd edin.' }, { status: 429 });
  }
  const { email } = await request.json().catch(() => ({ email: '' }));
  if (typeof email !== 'string' || !validEmail(email)) return NextResponse.json({ error: 'Email düzgün deyil.' }, { status: 400 });
  if (!process.env.RESEND_API_KEY) {
    console.error('password reset: RESEND_API_KEY is not set');
    return NextResponse.json({ error: 'Email xidməti hələ qurulmayıb. Klubla əlaqə saxlayın.' }, { status: 503 });
  }
  const db = memberAdminDb();
  if (!db) return NextResponse.json({ error: 'Xəta baş verdi. Yenidən cəhd edin.' }, { status: 503 });

  const addr = email.trim().toLowerCase();
  const { data: member } = await db.from('member_profiles').select('user_id, first_name').eq('email', addr).maybeSingle();
  if (!member?.user_id) return done;

  // at most 3 codes per account in 15 minutes
  const since = new Date(Date.now() - 15 * 60_000).toISOString();
  const { count } = await db.from('password_reset_codes').select('id', { count: 'exact', head: true }).eq('user_id', member.user_id).gte('created_at', since);
  if ((count ?? 0) >= 3) return done;

  const code = newCode();
  const now = new Date();
  await db.from('password_reset_codes').update({ used_at: now.toISOString() }).eq('user_id', member.user_id).is('used_at', null);
  const { error } = await db.from('password_reset_codes').insert({
    user_id: member.user_id,
    code_hash: hashCode(member.user_id, code),
    expires_at: new Date(now.getTime() + CODE_TTL_MIN * 60_000).toISOString(),
  });
  if (error) {
    console.error('password reset: could not store code:', error.message);
    return NextResponse.json({ error: 'Xəta baş verdi. Yenidən cəhd edin.' }, { status: 500 });
  }
  const sent = await sendResetEmail(addr, code, member.first_name);
  if (!sent.ok) console.error('password reset: email not sent:', sent.error);
  return done;
}
