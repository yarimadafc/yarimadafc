const fs = require('fs');
let content = fs.readFileSync('src/app/club/page.tsx', 'utf-8');
content = content.replace(
  '<div className="absolute inset-0 bg-[#152741] flex items-center justify-center">\n               <span className="text-gray-600 font-bold uppercase tracking-widest text-sm">Klub Şəkli</span>\n            </div>',
  '<img src={aboutBg} alt="Klub Şəkli" className="absolute inset-0 w-full h-full object-cover" />'
);
fs.writeFileSync('src/app/club/page.tsx', content);
