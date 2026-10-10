// Prepares an image for upload. Small files are sent untouched; large photos are resized
// (longest side 2000px) and re-encoded so the request stays well below the hosting body limit
// (~4.5 MB on Vercel) — big phone photos used to fail to upload.
const MAX_SIDE = 2000;
const KEEP_ORIGINAL_BYTES = 1.5 * 1024 * 1024;

const readAsDataURL = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const compressImage = async (file: File): Promise<string> => {
  if (file.size <= KEEP_ORIGINAL_BYTES || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return readAsDataURL(file);
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    // WebP keeps transparency (logos) and is small; fall back to JPEG where WebP encoding is unsupported.
    let out = canvas.toDataURL('image/webp', 0.9);
    if (!out.startsWith('data:image/webp')) out = canvas.toDataURL('image/jpeg', 0.9);
    return out;
  } catch {
    return readAsDataURL(file);
  }
};
