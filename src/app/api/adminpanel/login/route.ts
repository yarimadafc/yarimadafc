import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Check against env variables or hardcoded values based on user feedback
    const validEmail = 'nagialiyevbusiness@gmail.com';
    const validPassword = process.env.ADMIN_PASSWORD || 'yarimada2026'; // fallback

    if (email === validEmail && password === validPassword) {
      // Set cookie using next/headers
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'E-poçt və ya şifrə yanlışdır' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}
