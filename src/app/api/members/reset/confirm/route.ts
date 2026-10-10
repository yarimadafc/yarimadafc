import { NextRequest, NextResponse } from 'next/server';
import { clientIp, findMemberByEmail, memberAdminDb, tooManyRequests } from '@/lib/memberServer';
import { validEmail } from '@/lib/memberValidation';
import { MAX_CODE_ATTEMPTS, hashCode, sameHash } from '@/lib/resetCode';

const WRONG = 'Kod yanlışdır və ya vaxtı bitib.';

// Step 2 of "forgot password": checks the emailed code and sets the new password.
export async function POST(request: NextRequest) {
  if (tooManyRequests(`reset-confirm:${clientIp(request.headers)}`, 10, 15 * 60_000)) {
    return NextResponse.json({ error: 'Çox sayda cəhd. Bir az sonra yenidən cəhd edin.' }, { status: 429 });
  }
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const code = typeof body.code === 'string' ? body.code.replace(/\D/g, '') : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!validEmail(email) || code.length !== 6) return NextResponse.json({ error: WRONG }, { status: 400 });
  if (password.length < 6 || password.length > 72) return NextResponse.json({ error: 'Parol ən azı 6 simvol olmalıdır.' }, { status: 400 });

  const db = memberAdminDb();
  if (!db) return NextResponse.json({ error: 'Xəta baş verdi. Yenidən cəhd edin.' }, { status: 503 });

  const member = await findMemberByEmail(db, email);
  if (!member) return NextResponse.json({ error: WRONG }, { status: 400 });

  const { data: row } = await db.from('password_reset_codes')
    .select('id, code_hash, expires_at, attempts')
    .eq('user_id', member.user_id).is('used_at', null)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (!row || new Date(row.expires_at).getTime() < Date.now()) return NextResponse.json({ error: WRONG }, { status: 400 });

  if (!sameHash(row.code_hash, hashCode(member.user_id, code))) {
    const attempts = row.attempts + 1;
    await db.from('password_reset_codes').update({ attempts, ...(attempts >= MAX_CODE_ATTEMPTS ? { used_at: new Date().toISOString() } : {}) }).eq('id', row.id);
    return NextResponse.json({ error: attempts >= MAX_CODE_ATTEMPTS ? 'Çox səhv cəhd. Yeni kod istəyin.' : WRONG }, { status: 400 });
  }

  await db.from('password_reset_codes').update({ used_at: new Date().toISOString() }).eq('id', row.id);
  const { error } = await db.auth.admin.updateUserById(member.user_id, { password, email_confirm: true });
  if (error) {
    console.error('password reset: update failed:', error.message);
    return NextResponse.json({ error: 'Xəta baş verdi. Yenidən cəhd edin.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
