const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

content = content.replace(
  /<div className="flex items-center space-x-2 text-gray-500 text-xs font-bold tracking-widest uppercase">\s*Rəsmi Veb Səhifə\s*<\/div>/,
  `<div className="flex items-center space-x-2 text-gray-500 text-xs font-bold tracking-widest uppercase">
            {/* Boş buraxıldı */}
          </div>`
);

fs.writeFileSync('src/components/Navbar.tsx', content);
