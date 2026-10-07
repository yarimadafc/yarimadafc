const fs = require('fs');
let content = fs.readFileSync('src/components/home/MatchesAndStandings.tsx', 'utf-8');

// Add activeLeague state
content = content.replace(
  "const [standings, setStandings] = useState<any[]>([]);",
  "const [standings, setStandings] = useState<any[]>([]);\n  const [activeLeague, setActiveLeague] = useState('U-12');"
);

// Filter standings
content = content.replace(
  "{standings.map((team, idx) => (",
  "{standings.filter(s => (s.tournament_name || 'U-12') === activeLeague).map((team, idx) => ("
);

// Filter length check
content = content.replace(
  "{standings.length === 0 && (",
  "{standings.filter(s => (s.tournament_name || 'U-12') === activeLeague).length === 0 && ("
);

// Add Tabs UI above the table
content = content.replace(
  /<div className="flex justify-between items-center mb-8">\s*<div className="flex items-center space-x-4">\s*<span className="w-8 h-1 bg-\[#d7bf7b\]"><\/span>\s*<h2 className="text-3xl font-black text-white uppercase tracking-tight">Turnir Cədvəli<\/h2>\s*<\/div>\s*<\/div>/,
  `<div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <span className="w-8 h-1 bg-[#d7bf7b]"></span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Turnir Cədvəli</h2>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {['U-12', 'U-11', 'U-10', 'U-9'].map(league => (
                  <button 
                    key={league}
                    onClick={() => setActiveLeague(league)}
                    className={\`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors \${activeLeague === league ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400 border border-gray-800 hover:text-white'}\`}
                  >
                    {league}
                  </button>
                ))}
              </div>
            </div>`
);

fs.writeFileSync('src/components/home/MatchesAndStandings.tsx', content);
