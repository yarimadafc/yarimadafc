const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

content = content.replace(
  /<a href="https:\/\/t.me\/yarimadafk.*?>.*?<\/a>/,
  `$&
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest ml-6 border-l border-gray-800 pl-6 hidden xl:block">
                Gələcəyin Çempionları Burada Yetişir!
              </span>`
);

fs.writeFileSync('src/components/Navbar.tsx', content);
