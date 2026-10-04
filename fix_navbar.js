const fs = require('fs');
let file = 'src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove social networks from top menu
content = content.replace(/\{\/\* Social Icons \(Navbar\) \*\/\}\s*<div className="hidden md:flex items-center gap-3">[\s\S]*?<\/div>/, '');

// Enlarge font of menu links
content = content.replace(/text-base md:text-lg whitespace-nowrap/g, 'text-lg md:text-xl whitespace-nowrap');

fs.writeFileSync(file, content, 'utf8');
console.log('Navbar updated');
