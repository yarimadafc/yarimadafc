export function getLocalizedData(item: any, field: string, locale: string) {
  if (!item) return '';
  const lang = locale.toLowerCase();
  return item[`${field}_${lang}`] || item[`${field}_az`] || item[field] || '';
}
