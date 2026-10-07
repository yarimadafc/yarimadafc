const fs = require('fs');
let content = fs.readFileSync('src/components/home/MatchesSection.tsx', 'utf-8');

// Replace home team logo logic
content = content.replace(
  /\{m\.home_team\.includes\('Yarımada'\) \? \([\s\S]*?<img src="\/Logo\.JPG\.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" \/>[\s\S]*?\) : \([\s\S]*?<div className="w-8 h-8 bg-gray-600 rounded-full"><\/div>[\s\S]*?\)\}/,
  `{m.home_logo ? (
                        <img src={m.home_logo} alt={m.home_team} className="w-full h-full object-contain bg-white rounded-full p-1" />
                      ) : m.home_team.includes('Yarımada') ? (
                        <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                      )}`
);

// Replace away team logo logic
content = content.replace(
  /\{m\.away_team\.includes\('Yarımada'\) \? \([\s\S]*?<img src="\/Logo\.JPG\.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" \/>[\s\S]*?\) : \([\s\S]*?<div className="w-8 h-8 bg-gray-600 rounded-full"><\/div>[\s\S]*?\)\}/,
  `{m.away_logo ? (
                        <img src={m.away_logo} alt={m.away_team} className="w-full h-full object-contain bg-white rounded-full p-1" />
                      ) : m.away_team.includes('Yarımada') ? (
                        <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                      )}`
);

fs.writeFileSync('src/components/home/MatchesSection.tsx', content);
