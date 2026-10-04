import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // In production, compare with process.env.ADMIN_PASSWORD
    if (password === (process.env.ADMIN_PASSWORD || 'admin123')) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'admin_session',
        value: 'true',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 1 day
      });
      return response;
    }
    
    return NextResponse.json({ error: 'Yanlış şifrə' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}
