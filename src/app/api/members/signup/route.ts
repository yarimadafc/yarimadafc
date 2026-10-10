import { NextRequest, NextResponse } from 'next/server';
import { clientIp, memberAdminDb, tooManyRequests } from '@/lib/memberServer';
import { normalizePhone, validEmail, validPhone, validateBirth } from '@/lib/memberValidation';

// Creates the account already confirmed, so members can log in without an email confirmation step
// (independent of the "Confirm email" switch in Supabase). The profile row is created by the DB trigger.
export async function POST(request: NextRequest) {
  if (tooManyRequests(`signup:${clientIp(request.headers)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Çox sayda cəhd. Bir az sonra yenidən cəhd edin.' }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Xəta baş verdi. Yenidən cəhd edin.' }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const s = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const email = s(body.email, 120).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const first_name = s(body.first_name, 80);
  const last_name = s(body.last_name, 80);
  const gender = body.gender === 'male' || body.gender === 'female' ? body.gender : '';
  const birth_date = s(body.birth_date, 10);
  const phone = normalizePhone(s(body.phone, 25));

  const problem =
    first_name.length < 2 ? 'Adınızı yazın.'
    : last_name.length < 2 ? 'Soyadınızı yazın.'
    : !gender ? 'Cinsi seçin.'
    : validateBirth(birth_date)
    || (!validPhone(phone) ? 'Telefon nömrəsini düzgün yazın.'
    : !validEmail(email) ? 'Email düzgün deyil.'
    : password.length < 6 || password.length > 72 ? 'Parol ən azı 6 simvol olmalıdır.' : null);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const db = memberAdminDb();
  if (!db) return NextResponse.json({ error: 'fallback' }, { status: 503 }); // client falls back to normal sign-up

  const { error } = await db.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { first_name, last_name, gender, birth_date, phone },
  });
  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes('already') || m.includes('exists') || m.includes('registered')) {
      return NextResponse.json({ error: 'Bu email artıq qeydiyyatdan keçib. Daxil olun.' }, { status: 409 });
    }
    console.error('member signup:', error.message);
    return NextResponse.json({ error: 'Xəta baş verdi. Yenidən cəhd edin.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
