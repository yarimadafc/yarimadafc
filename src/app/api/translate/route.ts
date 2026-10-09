import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import translate from 'google-translate-api-x';

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const [resEn, resRu] = await Promise.all([
      translate(text, { from: 'az', to: 'en' }),
      translate(text, { from: 'az', to: 'ru' })
    ]);

    return NextResponse.json({
      en: resEn.text,
      ru: resRu.text
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
