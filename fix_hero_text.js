const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Smaller hero texts on mobile
content = content.replace(
  /className="text-5xl md:text-6xl xl:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-tight drop-shadow-lg"/,
  `className="text-4xl md:text-6xl xl:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-tight drop-shadow-lg"`
);

content = content.replace(
  /className="text-gray-300 font-bold text-base md:text-lg tracking-wide max-w-lg mb-10 drop-shadow-md"/,
  `className="text-gray-300 font-bold text-sm md:text-lg tracking-wide max-w-lg mb-10 drop-shadow-md"`
);

fs.writeFileSync('src/app/page.tsx', content);
