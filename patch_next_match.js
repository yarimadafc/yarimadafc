const fs = require('fs');
let content = fs.readFileSync('src/components/home/MatchesAndStandings.tsx', 'utf8');

// Make text bigger for Next Match team names
content = content.replace(/text-lg lg:text-xl text-center leading-tight uppercase/g, 'text-2xl lg:text-3xl text-center leading-tight uppercase');

// Make logos bigger
content = content.replace(/w-20 h-20 bg-\[var\(--bg-main\)\]/g, 'w-24 h-24 lg:w-32 lg:h-32 bg-[var(--bg-main)]');

// Make score bigger
content = content.replace(/text-lg relative z-10/g, 'text-2xl lg:text-3xl relative z-10 py-2 px-6');

fs.writeFileSync('src/components/home/MatchesAndStandings.tsx', content, 'utf8');
