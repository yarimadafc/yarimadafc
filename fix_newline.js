const fs = require('fs');
let content = fs.readFileSync('src/app/news/[id]/page.tsx', 'utf-8');
content = content.replace(/{news\.content_az\?\.split\('[\s\S]*?'\)\.map/m, "{news.content_az?.split('\\n').map");
fs.writeFileSync('src/app/news/[id]/page.tsx', content);
