const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

content = content.replace(
  "onClick={(e) => { if(item.href === '/' && window.location.pathname === '/') { window.scrollTo({top: 0, behavior: 'smooth'}) } }}",
  ""
);

content = content.replace(
  "onClick={() => setIsOpen(false)}",
  "onClick={(e) => { setIsOpen(false); if(item.href === '/' && window.location.pathname === '/') { window.scrollTo({top: 0, behavior: 'smooth'}) } }}"
);

fs.writeFileSync('src/components/Navbar.tsx', content);
