const fs = require('fs');
let content = fs.readFileSync('src/components/home/MatchesAndStandings.tsx', 'utf-8');

// Change nextMatch state
content = content.replace(
  "const [nextMatch, setNextMatch] = useState<any>(null);",
  "const [allMatches, setAllMatches] = useState<any[]>([]);\n  const [nextMatch, setNextMatch] = useState<any>(null);"
);

// Fetch all matches
content = content.replace(
  "const { data: mData } = await supabase.from('matches').select('*').order('match_date', { ascending: true }).limit(1).single();\n      if (mData) setNextMatch(mData);",
  `const { data: mData } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
      if (mData) {
        setAllMatches(mData);
        setNextMatch(mData.find((m: any) => (m.tournament || 'U-12') === 'U-12') || null);
      }`
);

// When changing active league, update nextMatch
content = content.replace(
  /onClick=\{\(\) => setActiveLeague\(league\)\}/g,
  `onClick={() => {
                      setActiveLeague(league);
                      setNextMatch(allMatches.find((m: any) => (m.tournament || 'U-12') === league) || null);
                    }}`
);

fs.writeFileSync('src/components/home/MatchesAndStandings.tsx', content);
