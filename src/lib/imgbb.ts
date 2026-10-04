const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

export async function uploadToImgBB(imageBase64: string): Promise<string> {
  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY!);
  formData.append('image', imageBase64);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error('ImgBB upload failed: ' + JSON.stringify(data));
  }

  return data.data.display_url;
}
