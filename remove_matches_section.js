const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

content = content.replace(/import MatchesSection from '\@\/components\/home\/MatchesSection';\n/, '');
content = content.replace(/<MatchesSection \/>\n/g, '');

fs.writeFileSync('src/app/page.tsx', content);
