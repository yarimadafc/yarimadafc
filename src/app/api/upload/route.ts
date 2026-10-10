import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadToImgBB } from '@/lib/imgbb';
import { requireAdmin } from '@/lib/adminGuard';

const BUCKET = 'media';
const MAX_BYTES = 8 * 1024 * 1024;
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
  'image/svg+xml': 'svg', 'image/avif': 'avif', 'image/heic': 'heic',
};

let bucketReady = false;

// Primary storage: Supabase Storage (public bucket, created on first use with the service-role key).
async function uploadToSupabase(bytes: Buffer, mime: string): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  if (!bucketReady) {
    const { data } = await db.storage.getBucket(BUCKET);
    if (!data) {
      const { error } = await db.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX_BYTES });
      if (error && !/already exists/i.test(error.message)) throw new Error(error.message);
    } else if (!data.public) {
      await db.storage.updateBucket(BUCKET, { public: true, fileSizeLimit: MAX_BYTES });
    }
    bucketReady = true;
  }

  const d = new Date();
  const path = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}.${EXT[mime] || 'jpg'}`;
  const { error } = await db.storage.from(BUCKET).upload(path, bytes, { contentType: mime, cacheControl: '31536000', upsert: false });
  if (error) throw new Error(error.message);
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  let image: unknown;
  try {
    ({ image } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Fayl oxunmadı (çox böyük ola bilər).' }, { status: 400 });
  }
  if (typeof image !== 'string' || !image) {
    return NextResponse.json({ error: 'Şəkil göndərilməyib.' }, { status: 400 });
  }

  const match = image.match(/^data:([^;]+);base64,/);
  const mime = match?.[1] || 'image/jpeg';
  const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
  if (!mime.startsWith('image/')) {
    return NextResponse.json({ error: 'Yalnız şəkil faylı yükləmək olar.' }, { status: 400 });
  }
  const bytes = Buffer.from(base64Data, 'base64');
  if (bytes.length > MAX_BYTES) {
    return NextResponse.json({ error: 'Şəkil 8 MB-dan böyükdür.' }, { status: 413 });
  }

  const errors: string[] = [];
  try {
    return NextResponse.json({ url: await uploadToSupabase(bytes, mime) });
  } catch (e) {
    errors.push(`Supabase: ${(e as Error).message}`);
  }
  // Fallback (the ImgBB account may be blocked, so it is no longer the primary store).
  if (process.env.IMGBB_API_KEY) {
    try {
      return NextResponse.json({ url: await uploadToImgBB(base64Data) });
    } catch (e) {
      errors.push(`ImgBB: ${(e as Error).message}`);
    }
  }
  console.error('Upload error:', errors.join(' | '));
  return NextResponse.json({ error: `Şəkil yüklənmədi. ${errors.join(' | ')}` }, { status: 500 });
}
