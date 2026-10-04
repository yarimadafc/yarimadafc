const fs = require('fs');
let file = 'src/app/[locale]/adminpanel/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import Link from 'next\/link';/, '');
content = content.replace(/import \{ usePathname, useRouter \} from 'next\/navigation';/, "import { usePathname, useRouter, Link } from '@/i18n/routing';");

// also fix the login check condition which uses document.cookie!
// if (pathname === '/adminpanel/login') will now match because next-intl usePathname strips the locale.
// wait, what about router.push('/adminpanel/login')? It works with next-intl router!

fs.writeFileSync(file, content, 'utf8');
