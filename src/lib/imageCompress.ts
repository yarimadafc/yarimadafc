export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Return original image without ANY compression to preserve 100% quality
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
