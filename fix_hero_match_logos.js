const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Ensure heroMatch state includes home_logo and away_logo initially
content = content.replace(
  "const [heroMatch, setHeroMatch] = useState<any>({ home: 'YARIMADA', away: 'RƏQİB', date: '', time: '', venue: '', league: 'Gənclər Liqası' });",
  "const [heroMatch, setHeroMatch] = useState<any>({ home: 'YARIMADA', away: 'RƏQİB', date: '', time: '', venue: '', league: 'Gənclər Liqası', home_logo: '', away_logo: '' });"
);

// Add logo keys to query
content = content.replace(
  "const hmKeys = ['hero_match_home', 'hero_match_away', 'hero_match_date', 'hero_match_time', 'hero_match_venue', 'hero_match_league'];",
  "const hmKeys = ['hero_match_home', 'hero_match_away', 'hero_match_date', 'hero_match_time', 'hero_match_venue', 'hero_match_league', 'hero_match_home_logo', 'hero_match_away_logo'];"
);

// Map the logo keys
content = content.replace(
  "const hm: any = { home: 'YARIMADA', away: 'RƏQİB', date: '', time: '', venue: '', league: 'Gənclər Liqası' };",
  "const hm: any = { home: 'YARIMADA', away: 'RƏQİB', date: '', time: '', venue: '', league: 'Gənclər Liqası', home_logo: '', away_logo: '' };"
);

content = content.replace(
  "if (item.section_key === 'hero_match_league') hm.league = item.image_url;",
  "if (item.section_key === 'hero_match_league') hm.league = item.image_url;\n          if (item.section_key === 'hero_match_home_logo') hm.home_logo = item.image_url;\n          if (item.section_key === 'hero_match_away_logo') hm.away_logo = item.image_url;"
);

// Replace Hero Match rendering (it uses standard img tags now)
content = content.replace(
  /<div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-\[#d7bf7b\] bg-\[#0a1423\] flex items-center justify-center p-2">\s*<img src="\/Logo\.JPG\.jpeg" alt="Yarımada FK" className="w-full h-full object-contain" \/>\s*<\/div>/,
  `<div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#d7bf7b] bg-[#0a1423] flex items-center justify-center p-1 overflow-hidden">
                      {heroMatch.home_logo ? (
                        <img src={heroMatch.home_logo} alt={heroMatch.home} className="w-full h-full object-contain bg-white rounded-full p-1" />
                      ) : (
                        <img src="/Logo.JPG.jpeg" alt="Yarımada FK" className="w-full h-full object-contain" />
                      )}
                    </div>`
);

content = content.replace(
  /<div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-gray-600 bg-\[#0a1423\] flex items-center justify-center overflow-hidden">\s*<div className="w-full h-full bg-gray-800"><\/div>\s*<\/div>/,
  `<div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-gray-600 bg-[#0a1423] flex items-center justify-center overflow-hidden p-1">
                      {heroMatch.away_logo ? (
                        <img src={heroMatch.away_logo} alt={heroMatch.away} className="w-full h-full object-contain bg-white rounded-full p-1" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 rounded-full"></div>
                      )}
                    </div>`
);

fs.writeFileSync('src/app/page.tsx', content);
