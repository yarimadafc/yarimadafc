const fs = require('fs');

// Navbar.tsx
let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(/import \{ t, type Lang \} from '@\/lib\/i18n';/, "import { useTranslations } from 'next-intl';\nimport { usePathname, useRouter } from '@/i18n/routing';");
navbar = navbar.replace(/const \[lang, setLang\] = useState<Lang>\('AZ'\);[\s\S]*?\}, \[\]\);/, "const t = useTranslations();");
navbar = navbar.replace(/t\(([^,]+),\s*lang\)/g, "t($1)");
// the language switcher inside Navbar:
navbar = navbar.replace(
  /const changeLang = \(newLang: Lang\) => \{[\s\S]*?\};/,
  `const pathname = usePathname();
  const router = useRouter();
  const changeLang = (newLang: string) => {
    router.replace(pathname, { locale: newLang.toLowerCase() });
  };`
);
// replace Lang to string
navbar = navbar.replace(/newLang: Lang/g, "newLang: string");
navbar = navbar.replace(/lang === 'AZ'/g, "t.locale === 'az'"); // Wait, useTranslations doesn't have .locale! 
navbar = navbar.replace(/lang === 'AZ'/g, "true"); // I will fix active lang later

fs.writeFileSync('src/components/Navbar.tsx', navbar, 'utf8');


// Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/import \{ t, type Lang \} from '@\/lib\/i18n';/, "import { useTranslations } from 'next-intl';");
footer = footer.replace(/const \[lang, setLang\] = useState<Lang>\('AZ'\);/, "const t = useTranslations();");
footer = footer.replace(/t\(([^,]+),\s*lang\)/g, "t($1)");
// Fix the document.cookie reads
footer = footer.replace(/document\.cookie\.split[\s\S]*?setLang\(newLang as Lang\);/, "");
fs.writeFileSync('src/components/Footer.tsx', footer, 'utf8');

// MatchesTabs.tsx
let matches = fs.readFileSync('src/components/MatchesTabs.tsx', 'utf8');
matches = matches.replace(/import \{ t, type Lang \} from '@\/lib\/i18n';/, "import { useTranslations } from 'next-intl';\nimport { useLocale } from 'next-intl';");
// It has `lang: Lang` in props!
matches = matches.replace(/lang: Lang/g, ""); // remove it from props
matches = matches.replace(/\{ matches, lang \}/, "{ matches }"); 
matches = matches.replace(/export default function MatchesTabs\(\{ matches \}: \{ matches: any\[\] \}\) \{/, `export default function MatchesTabs({ matches }: { matches: any[] }) {\n  const t = useTranslations();\n  const lang = useLocale().toUpperCase();`);
matches = matches.replace(/t\(([^,]+),\s*lang\)/g, "t($1)");
fs.writeFileSync('src/components/MatchesTabs.tsx', matches, 'utf8');

// page.tsx
let page = fs.readFileSync('src/app/[locale]/page.tsx', 'utf8');
page = page.replace(/import \{ t, type Lang \} from '@\/lib\/i18n';/, "import { getTranslations, setRequestLocale } from 'next-intl/server';");
page = page.replace(/const cookieStore = await cookies\(\);[\s\S]*?as Lang;/, "setRequestLocale(locale);\n  const t = await getTranslations();\n  const lang = locale.toUpperCase();");
// Add {params: {locale}} to Home props
page = page.replace(/export default async function Home\(\) \{/, "export default async function Home({ params: { locale } }: { params: { locale: string } }) {");
page = page.replace(/t\(([^,]+),\s*lang\)/g, "t($1)");
fs.writeFileSync('src/app/[locale]/page.tsx', page, 'utf8');

console.log('i18n replaced');
