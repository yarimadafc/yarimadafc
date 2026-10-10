import { compressImage, type ImageQuality } from '@/lib/imageCompress';
import { toast } from '@/lib/adminDb';

// One upload path for the whole admin panel: compress -> /api/upload -> public URL.
// Throws with a readable message (and shows it as a toast) so a failed upload is never silent.
export async function uploadImage(file: File, quality: ImageQuality = 'normal'): Promise<string> {
  try {
    if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|svg|heic|avif)$/i.test(file.name)) {
      throw new Error('Yalnız şəkil faylı seçin.');
    }
    const image = await compressImage(file, quality);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      throw new Error(data.error || (res.status === 401 ? 'Sessiya bitib, yenidən daxil olun.' : res.status === 413 ? 'Şəkil çox böyükdür.' : `Yükləmə alınmadı (HTTP ${res.status})`));
    }
    toast('success', 'Şəkil yükləndi');
    return data.url as string;
  } catch (e) {
    const message = (e as Error)?.message || 'Şəkil yüklənmədi';
    toast('error', message);
    throw new Error(message);
  }
}

/** Convenience for <input type="file" onChange>: uploads the first file, resets the input. */
export async function uploadFromInput(e: React.ChangeEvent<HTMLInputElement>, quality: ImageQuality = 'normal'): Promise<string | null> {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return null;
  try {
    return await uploadImage(file, quality);
  } catch {
    return null;
  }
}
