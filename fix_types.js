const fs = require('fs');

// layout.tsx
let layout = fs.readFileSync('src/app/[locale]/layout.tsx', 'utf8');
layout = layout.replace(/params: \{locale: string\};/g, 'params: Promise<{locale: string}>;');
layout = layout.replace(/params: \{locale\}/g, 'params');
layout = layout.replace(/setRequestLocale\(locale\);/g, 'const { locale } = await params;\n  setRequestLocale(locale);');
fs.writeFileSync('src/app/[locale]/layout.tsx', layout, 'utf8');

// page.tsx
let page = fs.readFileSync('src/app/[locale]/page.tsx', 'utf8');
page = page.replace(/params: \{ locale \}/g, 'params');
page = page.replace(/params: \{ locale: string \}/g, 'params: Promise<{ locale: string }>');
page = page.replace(/setRequestLocale\(locale\);/g, 'const { locale } = await params;\n  setRequestLocale(locale);');
fs.writeFileSync('src/app/[locale]/page.tsx', page, 'utf8');

// Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
if (!footer.includes('useTranslations')) {
  footer = "import { useTranslations, useLocale } from 'next-intl';\n" + footer;
}
footer = footer.replace(/const match = document\.cookie[\s\S]*?setLang\(newLang\);\n    }\n  }, \[\]\);/g, ''); // Remove the useEffect entirely
// Remove any setLang leftovers
footer = footer.replace(/setLang\([^\)]+\);/g, '');
fs.writeFileSync('src/components/Footer.tsx', footer, 'utf8');

// Navbar.tsx
let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
if (!navbar.includes('useTranslations')) {
  navbar = "import { useTranslations, useLocale } from 'next-intl';\n" + navbar;
}
navbar = navbar.replace(/const t = useTranslations\(\);/, "const t = useTranslations();\n  const locale = useLocale();");
navbar = navbar.replace(/const match = document\.cookie[\s\S]*?setLang\(newLang\);\n    }\n  }, \[\]\);/g, ''); // Remove the useEffect entirely
// Remove any setLang leftovers
navbar = navbar.replace(/setLang\([^\)]+\);/g, '');
// Replace lang={lang} if any leftover
navbar = navbar.replace(/lang=\{lang\}/g, '');
navbar = navbar.replace(/lang === 'AZ'/g, "locale === 'az'");
navbar = navbar.replace(/lang === 'EN'/g, "locale === 'en'");
navbar = navbar.replace(/lang === 'RU'/g, "locale === 'ru'");
fs.writeFileSync('src/components/Navbar.tsx', navbar, 'utf8');

console.log('Fixed types');
