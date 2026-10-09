import { NextRequest, NextResponse } from 'next/server';
import { uploadToImgBB } from '@/lib/imgbb';
import { requireAdmin } from '@/lib/adminGuard';

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Remove the data:image/xxx;base64, prefix if present
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    const url = await uploadToImgBB(base64Data);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
