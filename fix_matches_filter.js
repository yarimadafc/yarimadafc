const fs = require('fs');
let content = fs.readFileSync('src/app/matches/page.tsx', 'utf-8');

content = content.replace(
  /const isPast = \(m: any\) => \{[\s\S]*?\};\n\n  const upcomingMatches = matches\.filter\(m => !isPast\(m\)\);\n  const pastMatches = matches\.filter\(m => isPast\(m\)\)\.sort\(.*?\);/,
  `const upcomingMatches = matches.filter(m => m.status !== 'finished');
  const pastMatches = matches.filter(m => m.status === 'finished').sort((a, b) => {
    if (!a.match_date) return 1;
    if (!b.match_date) return -1;
    return new Date(b.match_date).getTime() - new Date(a.match_date).getTime();
  });`
);

fs.writeFileSync('src/app/matches/page.tsx', content);
