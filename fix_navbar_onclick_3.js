const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

// Just remove all onClick={(e) => { if(item.href === '/' && window.location.pathname === '/') { window.scrollTo({top: 0, behavior: 'smooth'}) } }}
content = content.split("onClick={(e) => { if(item.href === '/' && window.location.pathname === '/') { window.scrollTo({top: 0, behavior: 'smooth'}) } }}").join("");

// Add it properly to desktop link
content = content.replace(
  /<Link\s*href=\{item\.href\}\s*className="text-white hover:text-\[#d7bf7b\] transition-colors font-bold text-xs uppercase tracking-widest"/,
  `<Link\n                    href={item.href}\n                    className="text-white hover:text-[#d7bf7b] transition-colors font-bold text-xs uppercase tracking-widest"\n                    onClick={(e) => { if(item.href === '/' && window.location.pathname === '/') { window.scrollTo({top: 0, behavior: 'smooth'}) } }}`
);

fs.writeFileSync('src/components/Navbar.tsx', content);
