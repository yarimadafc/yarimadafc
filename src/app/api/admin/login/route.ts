import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, SESSION_MAX_AGE, createSessionToken, safeEqual } from '@/lib/adminAuth';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ success: false, message: 'Admin giriş konfiqurasiya olunmayıb.' }, { status: 503 });
    }

    const ip = clientIp(request);
    const now = Date.now();
    const entry = attempts.get(ip);
    if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
      return NextResponse.json({ success: false, message: 'Çox sayda uğursuz cəhd. Bir az sonra yenidən yoxlayın.' }, { status: 429 });
    }

    const { email, password } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || 'nagialiyevbusiness@gmail.com';

    const emailOk = await safeEqual(String(email ?? ''), adminEmail);
    const passwordOk = await safeEqual(String(password ?? ''), adminPassword);

    if (emailOk && passwordOk) {
      attempts.delete(ip);
      const response = NextResponse.json({ success: true });
      response.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
      });
      return response;
    }

    attempts.set(ip, entry && entry.resetAt > now
      ? { count: entry.count + 1, resetAt: entry.resetAt }
      : { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.json({ success: false, message: 'İstifadəçi adı və ya şifrə yanlışdır.' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, message: 'Xəta baş verdi' }, { status: 500 });
  }
}
