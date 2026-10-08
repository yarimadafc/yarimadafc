const fs = require('fs');

// 1. MatchesAndStandings (Next Match block)
let mas = fs.readFileSync('src/components/home/MatchesAndStandings.tsx', 'utf8');
mas = mas.replace(/w-24 h-24 lg:w-32 lg:h-32/g, 'w-16 h-16 lg:w-24 lg:h-24'); // Shrink logos
mas = mas.replace(/text-2xl lg:text-3xl text-center/g, 'text-lg lg:text-2xl text-center'); // Shrink team names
mas = mas.replace(/text-2xl lg:text-3xl relative z-10 py-2 px-6/g, 'text-xl lg:text-2xl relative z-10 py-1.5 px-5'); // Shrink VS/Score
fs.writeFileSync('src/components/home/MatchesAndStandings.tsx', mas, 'utf8');

// 2. Hero Component (page.tsx)
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
page = page.replace(/text-4xl md:text-5xl lg:text-7xl/g, 'text-3xl md:text-4xl lg:text-5xl'); // Shrink massive hero font
page = page.replace(/w-16 h-12 md:w-24 md:h-16/g, 'w-12 h-8 md:w-20 md:h-12'); // Shrink thumbnails
fs.writeFileSync('src/app/page.tsx', page, 'utf8');

// 3. Section Headers globally in some pages
let filesToShrinkHeaders = [
  'src/app/coaches/page.tsx',
  'src/app/academy/page.tsx',
  'src/app/club/page.tsx',
  'src/app/teams/page.tsx'
];

filesToShrinkHeaders.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/text-3xl md:text-5xl/g, 'text-2xl md:text-4xl');
    fs.writeFileSync(f, content, 'utf8');
  }
});
