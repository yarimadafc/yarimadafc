const fs = require('fs');
let content = fs.readFileSync('src/components/home/MatchesAndStandings.tsx', 'utf-8');

// Replace home team logo logic
content = content.replace(
  /\{nextMatch\.home_team\.includes\('Yarımada'\) \? \([\s\S]*?<img src="\/Logo\.JPG\.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" \/>[\s\S]*?\) : \([\s\S]*?<div className="w-12 h-12 bg-gray-600 rounded-full"><\/div>[\s\S]*?\)\}/,
  `{nextMatch.home_logo ? (
                          <img src={nextMatch.home_logo} alt={nextMatch.home_team} className="w-full h-full object-contain bg-white rounded-full p-2" />
                        ) : nextMatch.home_team.includes('Yarımada') ? (
                          <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                        )}`
);

// Replace away team logo logic
content = content.replace(
  /\{nextMatch\.away_team\.includes\('Yarımada'\) \? \([\s\S]*?<img src="\/Logo\.JPG\.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" \/>[\s\S]*?\) : \([\s\S]*?<div className="w-12 h-12 bg-gray-600 rounded-full"><\/div>[\s\S]*?\)\}/,
  `{nextMatch.away_logo ? (
                          <img src={nextMatch.away_logo} alt={nextMatch.away_team} className="w-full h-full object-contain bg-white rounded-full p-2" />
                        ) : nextMatch.away_team.includes('Yarımada') ? (
                          <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                        )}`
);

fs.writeFileSync('src/components/home/MatchesAndStandings.tsx', content);
