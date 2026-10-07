const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

// Center logo on mobile and enlarge text
content = content.replace(
  /<Link href="\/" className="flex items-center group cursor-pointer space-x-3">/g,
  `<Link href="/" onClick={() => { if(window.location.pathname === '/') window.scrollTo({top: 0, behavior: 'smooth'}) }} className="flex items-center group cursor-pointer space-x-2 md:space-x-3 absolute left-1/2 -translate-x-1/2 xl:relative xl:left-auto xl:translate-x-0">`
);

content = content.replace(
  /<span className="text-white font-black text-\[15px\] md:text-xl tracking-tighter uppercase group-hover:text-\[#d7bf7b\] transition-colors">\s*Yarımada FK\s*<\/span>/,
  `<span className="text-white font-black text-lg md:text-xl tracking-tighter uppercase group-hover:text-[#d7bf7b] transition-colors whitespace-nowrap">Yarımada FK</span>`
);

// Add scroll to top for Ana Səhifə link
content = content.replace(
  /href=\{item\.href\}/g,
  `href={item.href} onClick={(e) => { if(item.href === '/' && window.location.pathname === '/') { window.scrollTo({top: 0, behavior: 'smooth'}) } }}`
);

fs.writeFileSync('src/components/Navbar.tsx', content);
