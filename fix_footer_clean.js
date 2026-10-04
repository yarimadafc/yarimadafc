const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');
content = content.replace(/const t = useTranslations\(\);/g, ''); // remove all
content = content.replace(/export default function Footer\(\) \{/, "export default function Footer() {\n  const t = useTranslations();\n  const lang = useLocale().toUpperCase();");
if (!content.includes('useLocale')) {
  content = content.replace(/import \{ useTranslations \} from 'next-intl';/, "import { useTranslations, useLocale } from 'next-intl';");
}
// the language state was removed earlier but let's be sure
content = content.replace(/const \[lang, setLang\] = useState<Lang>\('AZ'\);/g, '');
fs.writeFileSync('src/components/Footer.tsx', content, 'utf8');
