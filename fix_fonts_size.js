const fs = require('fs');
let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
// Navbar text sizes
navbar = navbar.replace(/text-lg md:text-xl whitespace-nowrap/g, 'text-sm md:text-base whitespace-nowrap font-medium');
fs.writeFileSync('src/components/Navbar.tsx', navbar, 'utf8');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');
// page.tsx hero title
page = page.replace(/text-4xl sm:text-5xl md:text-8xl/g, 'text-4xl sm:text-5xl md:text-7xl');
// page.tsx section titles
page = page.replace(/text-4xl md:text-6xl/g, 'text-3xl md:text-5xl');
page = page.replace(/text-3xl md:text-5xl/g, 'text-2xl md:text-4xl');
page = page.replace(/text-4xl md:text-5xl/g, 'text-3xl md:text-4xl');
fs.writeFileSync('src/app/page.tsx', page, 'utf8');
