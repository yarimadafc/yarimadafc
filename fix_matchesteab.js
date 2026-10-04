const fs = require('fs');
let file = 'src/components/MatchesTabs.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/export default function MatchesTabs[\s\S]*?\{/, "import { useTranslations, useLocale } from 'next-intl';\nexport default function MatchesTabs({ nextMatch, lastMatch }: { nextMatch: any, lastMatch: any }) {\n  const t = useTranslations();\n  const lang = useLocale().toUpperCase();");

fs.writeFileSync(file, content, 'utf8');
