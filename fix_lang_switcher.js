const fs = require('fs');
let file = 'src/components/LangSwitcher.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace button with Link
const oldStr = `<button
              key={l}
              onClick={() => changeLang(l)}
              className={\`text-center py-2 md:py-2.5 text-[13px] md:text-sm font-bold tracking-wider transition-colors \${locale === l ? 'bg-[#0a1628] text-[var(--ks-kinpaku)]' : 'text-[#0a1628] hover:bg-gray-100'}\`}
            >
              {l.toUpperCase()}
            </button>`;

const newStr = `// @ts-ignore
            <Link
              key={l}
              href={pathname}
              locale={l}
              onClick={() => setOpen(false)}
              className={\`block text-center py-2 md:py-2.5 text-[13px] md:text-sm font-bold tracking-wider transition-colors \${locale === l ? 'bg-[#0a1628] text-[var(--ks-kinpaku)]' : 'text-[#0a1628] hover:bg-gray-100'}\`}
            >
              {l.toUpperCase()}
            </Link>`;

content = content.replace(oldStr, newStr);

// Add Link to imports
content = content.replace(/import \{ useRouter, usePathname \} from '@\/i18n\/routing';/, "import { useRouter, usePathname, Link } from '@/i18n/routing';");

fs.writeFileSync(file, content, 'utf8');
