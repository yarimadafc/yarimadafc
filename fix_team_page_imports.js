const fs = require('fs');
let content = fs.readFileSync('src/app/teams/[id]/page.tsx', 'utf-8');

content = content.replace(
  "import StandingsMatches from '@/components/home/StandingsMatches';",
  "import MatchesAndStandings from '@/components/home/MatchesAndStandings';"
);

content = content.replace(
  "<StandingsMatches />",
  "<MatchesAndStandings />"
);

fs.writeFileSync('src/app/teams/[id]/page.tsx', content);
