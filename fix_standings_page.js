const fs = require('fs');
let content = fs.readFileSync('src/app/standings/page.tsx', 'utf-8');

content = content.replace(
  "import PageTransition from '@/components/PageTransition';",
  "import PageTransition from '@/components/PageTransition';\nimport MatchesAndStandings from '@/components/home/MatchesAndStandings';"
);

content = content.replace(
  /<div className="h-96 border-2 border-dashed border-gray-800 flex items-center justify-center rounded-2xl">[\s\S]*?<\/div>/,
  "<MatchesAndStandings />"
);

fs.writeFileSync('src/app/standings/page.tsx', content);
