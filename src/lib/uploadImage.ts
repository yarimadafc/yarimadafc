import { compressImage, type ImageQuality } from '@/lib/imageCompress';
import { openImageEditor, type EditorOptions } from '@/lib/imageEditor';
import { stripFocus, withFocus } from '@/lib/imageFocus';
import { toast } from '@/lib/adminDb';

// One upload path for the whole admin panel: edit (crop + focus) -> compress -> /api/upload -> public URL.
// Throws with a readable message (and shows it as a toast) so a failed upload is never silent.
export type UploadOptions = EditorOptions & { quality?: ImageQuality };

class Cancelled extends Error {}
const isImage = (file: File) => file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|svg|heic|avif)$/i.test(file.name);
// vector / animated files would lose their quality on a canvas, so they are uploaded as they are
const editable = (file: File) => file.type !== 'image/svg+xml' && file.type !== 'image/gif';

async function send(file: File, quality: ImageQuality): Promise<string> {
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
}

async function run<T>(task: () => Promise<T>): Promise<T> {
  try {
    return await task();
  } catch (e) {
    if (e instanceof Cancelled) throw e;
    const message = (e as Error)?.message || 'Şəkil yüklənmədi';
    toast('error', message);
    throw new Error(message);
  }
}

// Accepts the old `uploadImage(file, 'high')` form as well as an options object.
const opts = (o?: ImageQuality | UploadOptions): UploadOptions => (typeof o === 'string' ? { quality: o } : o || {});

export async function uploadImage(file: File, options?: ImageQuality | UploadOptions): Promise<string> {
  const { quality = 'normal', ...editor } = opts(options);
  return run(async () => {
    if (!isImage(file)) throw new Error('Yalnız şəkil faylı seçin.');
    if (!editable(file)) return send(file, quality);
    const result = await openImageEditor(file, editor);
    if (!result) throw new Cancelled();
    return withFocus(await send(result.file ?? file, quality), result.focus);
  });
}

/** Re-opens an already uploaded picture in the editor. Only a changed crop uploads a new file. */
export async function editImageUrl(url: string, options?: ImageQuality | UploadOptions): Promise<string | null> {
  const { quality = 'normal', ...editor } = opts(options);
  try {
    return await run(async () => {
      const result = await openImageEditor(url, editor);
      if (!result) throw new Cancelled();
      if (!result.file) return withFocus(stripFocus(url), result.focus);
      return withFocus(await send(result.file, quality), result.focus);
    });
  } catch {
    return null;
  }
}

/** Convenience for <input type="file" onChange>: edits + uploads the first file, resets the input. */
export async function uploadFromInput(e: React.ChangeEvent<HTMLInputElement>, options?: ImageQuality | UploadOptions): Promise<string | null> {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return null;
  try {
    return await uploadImage(file, options);
  } catch {
    return null;
  }
}

export type GalleryUpload = { url: string; thumb: string; width: number | null; height: number | null };

/** Photo gallery upload (many files at once, no editor): high quality -> ImgBB (Supabase Storage fallback). */
export async function uploadGalleryPhoto(file: File): Promise<GalleryUpload> {
  if (!isImage(file)) throw new Error(`${file.name}: yalnız şəkil faylı seçin.`);
  const image = await compressImage(file, 'high');
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image, target: 'gallery' }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    throw new Error(data.error || (res.status === 401 ? 'Sessiya bitib, yenidən daxil olun.' : res.status === 413 ? 'Şəkil çox böyükdür.' : `Yükləmə alınmadı (HTTP ${res.status})`));
  }
  return { url: data.url, thumb: data.thumb || data.url, width: data.width ?? null, height: data.height ?? null };
}
