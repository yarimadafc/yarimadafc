const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// The nextMatch state will now hold the Hero Match object
content = content.replace(
  "const [nextMatch, setNextMatch] = useState<any>(null);",
  "const [heroMatch, setHeroMatch] = useState<any>({ home: 'YARIMADA', away: 'RƏQİB', date: '', time: '', venue: '', league: 'Gənclər Liqası' });"
);

// Fetch hero match instead of nextMatch
content = content.replace(
  "const { data: match } = await supabase.from('matches').select('*').order('match_date', { ascending: true }).limit(1).single();\n      if (match) setNextMatch(match);",
  `const hmKeys = ['hero_match_home', 'hero_match_away', 'hero_match_date', 'hero_match_time', 'hero_match_venue', 'hero_match_league'];
      const { data: hmData } = await supabase.from('site_images').select('section_key, image_url').in('section_key', hmKeys);
      if (hmData) {
        const hm: any = { home: 'YARIMADA', away: 'RƏQİB', date: '', time: '', venue: '', league: 'Gənclər Liqası' };
        hmData.forEach(item => {
          if (item.section_key === 'hero_match_home') hm.home = item.image_url;
          if (item.section_key === 'hero_match_away') hm.away = item.image_url;
          if (item.section_key === 'hero_match_date') hm.date = item.image_url;
          if (item.section_key === 'hero_match_time') hm.time = item.image_url;
          if (item.section_key === 'hero_match_venue') hm.venue = item.image_url;
          if (item.section_key === 'hero_match_league') hm.league = item.image_url;
        });
        setHeroMatch(hm);
      }`
);

// Update UI replacements
content = content.replace(/\{nextMatch\?\.tournament \|\| 'Gənclər Liqası'\}/g, "{heroMatch.league || 'Gənclər Liqası'}");
content = content.replace(/\{nextMatch\?\.home_team \|\| 'YARIMADA'\}/g, "{heroMatch.home || 'YARIMADA'}");
content = content.replace(/\{nextMatch\?\.away_team \|\| 'RƏQİB'\}/g, "{heroMatch.away || 'RƏQİB'}");
content = content.replace(/\{nextMatch \? \`\$\{nextMatch\.match_date\} • \$\{nextMatch\.match_time\}\` : 'Məlumat Yoxdur'\}/g, "{heroMatch.date && heroMatch.time ? `${heroMatch.date} • ${heroMatch.time}` : 'Məlumat Yoxdur'}");

fs.writeFileSync('src/app/page.tsx', content);
