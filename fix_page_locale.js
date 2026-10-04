const fs = require('fs');
let file = 'src/app/[locale]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('getLocalizedData')) {
  content = content.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { getLocalizedData } from '@/lib/getLocalizedData';");
}

// Replace `{lang === 'EN' ? item.title_en : lang === 'RU' ? item.title_ru : item.title_az}`
// Using regex is hard because it varies. I'll just replace the common pattern
content = content.replace(/\{lang === 'EN' \? item\.title_en : lang === 'RU' \? item\.title_ru : item\.title_az\}/g, "{getLocalizedData(item, 'title', locale)}");
content = content.replace(/\{lang === 'EN' \? item\.excerpt_en : lang === 'RU' \? item\.excerpt_ru : item\.excerpt_az\}/g, "{getLocalizedData(item, 'excerpt', locale)}");
content = content.replace(/\{lang === 'EN' \? item\.content_en : lang === 'RU' \? item\.content_ru : item\.content_az\}/g, "{getLocalizedData(item, 'content', locale)}");

// Wait, the file actually contains `{lang === 'EN' ? ... }`?
// Let's check.
fs.writeFileSync(file, content, 'utf8');
