const fs = require('fs');
let file = 'src/app/[locale]/xeberler/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/export default async function NewsDetail\(\{ params \}: \{ params: Promise<\{ slug: string \}> \}\) \{/, "export default async function NewsDetail({ params }: { params: Promise<{ slug: string, locale: string }> }) {\n  const resolvedParams = await params;\n  const locale = resolvedParams.locale;\n  const slug = resolvedParams.slug;");
content = content.replace(/const resolvedParams = await params;\n  const slug = resolvedParams\.slug;/g, ""); // Remove old duplicate

if (!content.includes('getLocalizedData')) {
  content = content.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { getLocalizedData } from '@/lib/getLocalizedData';");
}

content = content.replace(/post\.title/g, "getLocalizedData(post, 'title', locale)");
content = content.replace(/post\.content/g, "getLocalizedData(post, 'content', locale)");

fs.writeFileSync(file, content, 'utf8');
