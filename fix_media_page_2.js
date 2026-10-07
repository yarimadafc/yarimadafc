const fs = require('fs');
let content = fs.readFileSync('src/app/media/page.tsx', 'utf-8');
content = content.replace('mb-10 mt-20', '');
content = content.replace('<div className="min-h-screen bg-[#0a1423] pb-20">', '<div className="min-h-screen bg-[#0a1423] pt-32 pb-20">');
fs.writeFileSync('src/app/media/page.tsx', content);
