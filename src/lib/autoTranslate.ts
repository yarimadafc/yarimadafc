export async function autoTranslateFields(formData: any, fieldsToTranslate: string[]) {
  const updatedData = { ...formData };
  let translatedAny = false;

  for (const field of fieldsToTranslate) {
    const azText = updatedData[`${field}_az`];
    const ruText = updatedData[`${field}_ru`];
    const enText = updatedData[`${field}_en`];

    if (azText && (!ruText || !enText)) {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: azText })
        });
        
        if (res.ok) {
          const { en, ru } = await res.json();
          if (!enText) updatedData[`${field}_en`] = en;
          if (!ruText) updatedData[`${field}_ru`] = ru;
          translatedAny = true;
        }
      } catch (err) {
        console.error('Translation error for field', field, err);
      }
    }
  }

  return { updatedData, translatedAny };
}
