const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

// Change logo link className
content = content.replace(
  "className=\"flex items-center group cursor-pointer space-x-2 md:space-x-3 absolute left-1/2 -translate-x-1/2 xl:relative xl:left-auto xl:translate-x-0\"",
  "className=\"flex items-center group cursor-pointer space-x-3\""
);

// Decrease size slightly on mobile so it doesn't pop out
content = content.replace(
  "className=\"relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#d7bf7b]\"",
  "className=\"relative w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#d7bf7b] flex-shrink-0\""
);

content = content.replace(
  "className=\"text-white font-black text-lg md:text-xl tracking-tighter uppercase group-hover:text-[#d7bf7b] transition-colors whitespace-nowrap\"",
  "className=\"text-white font-black text-base md:text-xl tracking-tighter uppercase group-hover:text-[#d7bf7b] transition-colors whitespace-nowrap\""
);

fs.writeFileSync('src/components/Navbar.tsx', content);
