export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if the file is extremely small or SVG, in which case bypass compression
    if (file.type === 'image/svg+xml' || file.size < 500 * 1024) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return reject(new Error('Failed to read image'));
      img.src = e.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      // Keep original dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Use WebP with 0.95 quality for maximum preservation while reducing byte size substantially
      const dataUrl = canvas.toDataURL('image/webp', 0.95);
      resolve(dataUrl);
    };

    img.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
