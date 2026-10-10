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

  const data = await response.json();

  if (!data.success) {
    throw new Error('ImgBB upload failed: ' + JSON.stringify(data));
  }

  return data.data.display_url;
}
