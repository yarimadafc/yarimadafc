const fs = require('fs');
let file = 'src/app/[locale]/xeberler/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add locale param
content = content.replace(/export default async function NewsPage\(\{ searchParams \}: \{ searchParams: Promise<\{ category\?: string \}> \}\) \{/, "export default async function NewsPage({ searchParams, params }: { searchParams: Promise<{ category?: string }>, params: Promise<{ locale: string }> }) {\n  const resolvedParams = await params;\n  const locale = resolvedParams.locale;");

if (!content.includes('getLocalizedData')) {
  content = content.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { getLocalizedData } from '@/lib/getLocalizedData';");
}

content = content.replace(/\{lang === 'EN' \? item\.title_en : lang === 'RU' \? item\.title_ru : item\.title_az\}/g, "{getLocalizedData(item, 'title', locale)}");
content = content.replace(/\{lang === 'EN' \? item\.excerpt_en : lang === 'RU' \? item\.excerpt_ru : item\.excerpt_az\}/g, "{getLocalizedData(item, 'excerpt', locale)}");

// Wait, the page didn't have `lang`! The user's code probably didn't use `lang` here because they didn't know how to get the cookie in a server component before!
// Let's see what it actually has.
fs.writeFileSync(file, content, 'utf8');
