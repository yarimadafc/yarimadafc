import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// public static pages (detail pages are reached from these)
const PAGES = [
  '', '/news', '/club', '/history', '/transfers', '/sponsors', '/tickets', '/teams', '/stats', '/academy', '/coaches',
  '/courses', '/matches', '/standings', '/media', '/social', '/shop', '/contact', '/school', '/join', '/privacy',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(path => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '' || path === '/news' || path === '/matches' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
