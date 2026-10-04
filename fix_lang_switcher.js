const fs = require('fs');
let file = 'src/components/LangSwitcher.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ useRouter, usePathname, Link \} from '@\/i18n\/routing';/, 'import { useRouter, usePathname } from \'@/i18n/routing\';');

// Replace the Link component with native <a>
const oldLink = `<Link
              key={l}
              href={pathname || '/'}
              locale={l}
              onClick={() => setOpen(false)}
              className={\`block text-center py-2 md:py-2.5 text-[13px] md:text-sm font-bold tracking-wider transition-colors \${locale === l ? 'bg-[#0a1628] text-[var(--ks-kinpaku)]' : 'text-[#0a1628] hover:bg-gray-100'}\`}
            >
              {l.toUpperCase()}
            </Link>`;

const newLink = `<a
              key={l}
              href={\`/\${l}\${pathname === '/' ? '' : pathname}\`}
              onClick={() => setOpen(false)}
              className={\`block text-center py-2 md:py-2.5 text-[13px] md:text-sm font-bold tracking-wider transition-colors \${locale === l ? 'bg-[#0a1628] text-[var(--ks-kinpaku)]' : 'text-[#0a1628] hover:bg-gray-100'}\`}
            >
              {l.toUpperCase()}
            </a>`;

content = content.replace(oldLink, newLink);

fs.writeFileSync(file, content, 'utf8');
