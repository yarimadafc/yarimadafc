import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Check credentials (fallback to provided defaults if env is missing)
    const adminEmail = process.env.ADMIN_EMAIL || 'nagialiyevbusiness@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Nagi2026!';

    if (email === adminEmail && password === adminPassword) {
      // Set secure cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_token', 'authenticated', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'İstifadəçi adı və ya şifrə yanlışdır.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Xəta baş verdi' }, { status: 500 });
  }
}
