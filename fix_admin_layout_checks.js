const fs = require('fs');
let file = 'src/app/[locale]/adminpanel/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/pathname === '\/adminpanel\/login'/g, "pathname.includes('/adminpanel/login')");
content = content.replace(/pathname !== '\/adminpanel\/login'/g, "!pathname.includes('/adminpanel/login')");

fs.writeFileSync(file, content, 'utf8');
