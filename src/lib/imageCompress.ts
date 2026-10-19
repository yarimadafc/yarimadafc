// Prepares an image for upload. Small files are sent untouched; large photos are resized and re-encoded
// so the request stays below the hosting body limit (~4.5 MB on Vercel, base64 adds a third) — big phone
// photos used to fail to upload. Hero / background images use the "high" profile: they fill the whole
// screen, so they keep far more pixels and quality.
type Profile = { maxSide: number; keepOriginalBytes: number; quality: number; maxBytes: number };
const PROFILES: Record<'normal' | 'high', Profile> = {
  normal: { maxSide: 2000, keepOriginalBytes: 1.5 * 1024 * 1024, quality: 0.9, maxBytes: 2.5 * 1024 * 1024 },
  high: { maxSide: 3200, keepOriginalBytes: 3 * 1024 * 1024, quality: 0.95, maxBytes: 3 * 1024 * 1024 },
};
export type ImageQuality = keyof typeof PROFILES;

const readAsDataURL = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// bytes of the file behind a base64 data URL
const dataUrlBytes = (url: string) => Math.ceil(((url.length - url.indexOf(',') - 1) * 3) / 4);

// formats every browser can show; anything else (HEIC from iPhones...) is always converted
const WEB_SAFE = /^image\/(jpeg|png|webp|avif)$/;

export const compressImage = async (file: File, quality: ImageQuality = 'normal'): Promise<string> => {
  const p = PROFILES[quality];
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return readAsDataURL(file);
  if (WEB_SAFE.test(file.type) && file.size <= p.keepOriginalBytes) return readAsDataURL(file);
  try {
    const bitmap = await createImageBitmap(file);
    // already small enough: upload untouched, so the photo is never re-compressed twice
    if (WEB_SAFE.test(file.type) && file.size <= p.maxBytes && Math.max(bitmap.width, bitmap.height) <= p.maxSide) {
      bitmap.close();
      return readAsDataURL(file);
    }
    const scale = Math.min(1, p.maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    // WebP keeps transparency (logos) and is small; fall back to JPEG where WebP encoding is unsupported.
    // Quality only steps down if the file would still be too big to upload.
    let out = '';
    for (let q = p.quality; q >= 0.6; q -= 0.05) {
      out = canvas.toDataURL('image/webp', q);
      if (!out.startsWith('data:image/webp')) out = canvas.toDataURL('image/jpeg', q);
      if (dataUrlBytes(out) <= p.maxBytes) break;
    }
    return out;
  } catch {
    return readAsDataURL(file);
  }
};
