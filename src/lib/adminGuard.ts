import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminAuth';

// Returns a 401 response when the request has no valid admin session, otherwise null.
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  if (await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value)) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
