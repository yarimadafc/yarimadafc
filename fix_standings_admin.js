const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/StandingsAdmin.tsx', 'utf-8');

// Add tournamentName state
content = content.replace(
  "const [teamName, setTeamName] = useState('');",
  "const [tournamentName, setTournamentName] = useState('U-12');\n  const [teamName, setTeamName] = useState('');"
);

// handleEdit update
content = content.replace(
  "setTeamName(s.team_name);",
  "setTournamentName(s.tournament_name || 'U-12');\n    setTeamName(s.team_name);"
);

// handleSave update
content = content.replace(
  "tournament_name: 'Gənclər Liqası'",
  "tournament_name: tournamentName"
);

// Add select dropdown to form
content = content.replace(
  /<div className="col-span-2 md:col-span-3">\s*<label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Adı<\/label>\s*<input type="text" value=\{teamName\} onChange=\{e => setTeamName\(e.target.value\)\} className="w-full bg-\[#0d1a2d\] border border-gray-700 rounded-lg p-3 text-white" required \/>\s*<\/div>/,
  `<div className="col-span-2 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Liqa / Kateqoriya</label>
              <select value={tournamentName} onChange={e => setTournamentName(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white">
                <option value="U-12">U-12</option>
                <option value="U-11">U-11</option>
                <option value="U-10">U-10</option>
                <option value="U-9">U-9</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Adı</label>
              <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required />
            </div>
          </div>`
);

// Update table to group by tournamentName, but since it's just a raw list in admin, I'll add a column for League
content = content.replace(
  /<th className="p-4">Komanda<\/th>/,
  `<th className="p-4">Liqa</th><th className="p-4">Komanda</th>`
);

content = content.replace(
  /<td className="p-4 font-bold flex items-center space-x-3">\s*<span className="text-gray-500 w-4">\{i \+ 1\}<\/span>\s*<span className=\{s.team_name.includes\('Yarımada'\) \? 'text-\[#d7bf7b\]' : 'text-white'\}>\{s.team_name\}<\/span>\s*<\/td>/,
  `<td className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest">{s.tournament_name || 'U-12'}</td>
                <td className="p-4 font-bold flex items-center space-x-3">
                  <span className="text-gray-500 w-4">{i + 1}</span>
                  <span className={s.team_name.includes('Yarımada') ? 'text-[#d7bf7b]' : 'text-white'}>{s.team_name}</span>
                </td>`
);

// Sort by tournament first then points
content = content.replace(
  /order\('points', \{ ascending: false \}\)/,
  "order('tournament_name', { ascending: false }).order('points', { ascending: false })"
);

fs.writeFileSync('src/app/admin/components/StandingsAdmin.tsx', content);
