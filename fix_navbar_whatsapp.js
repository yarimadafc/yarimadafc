const fs = require('fs');
let file = 'src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHref = `href="https://wa.me/994554477467?text=Salam,%20Akademiyaya%20qeydiyyatdan%20keçmək%20istəyirəm."`;
const newHref = `href={\`https://wa.me/\${(settings?.phone || '994554477467').replace(/[^0-9]/g, '')}?text=Salam,%20Akademiyaya%20qeydiyyatdan%20keçmək%20istəyirəm.\`}`;
content = content.replace(new RegExp(oldHref.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'g'), newHref);

fs.writeFileSync(file, content, 'utf8');
