const fs = require('fs');
let content = fs.readFileSync('src/components/home/MatchesAndStandings.tsx', 'utf-8');

content = content.replace(
  /setNextMatch\(mData\.find\(\(m: any\) => \(m\.tournament \|\| 'U-12'\) === 'U-12'\) \|\| null\);/,
  `// Find the next match that is NOT the hero match (or fallback to hero if it's the only one)
        const nonHeroNext = mData.find(m => m.status !== 'finished' && !m.is_hero);
        const heroNext = mData.find(m => m.status !== 'finished' && m.is_hero);
        setNextMatch(nonHeroNext || heroNext || null);`
);

fs.writeFileSync('src/components/home/MatchesAndStandings.tsx', content);
