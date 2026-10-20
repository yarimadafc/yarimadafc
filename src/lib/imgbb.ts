const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const IMGBB_API_URL = process.env.IMGBB_API_URL || 'https://api.imgbb.com/1/upload';

export async function uploadToImgBB(imageBase64: string): Promise<string> {
  if (!IMGBB_API_KEY) throw new Error('IMGBB_API_KEY is not configured');
  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY!);
  formData.append('image', imageBase64);

  const response = await fetch(IMGBB_API_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!data?.success) {
    throw new Error(data?.error?.message || `HTTP ${response.status}`);
  }

  return data.data.display_url;
}

export type ImgBBImage = { url: string; thumb: string; width: number | null; height: number | null };

/** Original-quality URL plus ImgBB's lighter "medium" copy (used for fast-loading gallery grids). */
export async function uploadToImgBBDetailed(imageBase64: string): Promise<ImgBBImage> {
  if (!IMGBB_API_KEY) throw new Error('IMGBB_API_KEY is not configured');
  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', imageBase64);

  const response = await fetch(IMGBB_API_URL, { method: 'POST', body: formData, signal: AbortSignal.timeout(45_000) });
  const data = await response.json().catch(() => null);
  if (!data?.success) throw new Error(data?.error?.message || `HTTP ${response.status}`);

  const d = data.data;
  const url: string = d.image?.url || d.url || d.display_url;
  if (!url) throw new Error('ImgBB returned no URL');
  const num = (v: unknown) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : null);
  return { url, thumb: d.medium?.url || d.display_url || url, width: num(d.width), height: num(d.height) };
}
