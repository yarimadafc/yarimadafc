const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/MatchesAdmin.tsx', 'utf-8');

// Add states
content = content.replace(
  "const [awayLogo, setAwayLogo] = useState('');",
  "const [awayLogo, setAwayLogo] = useState('');\n  const [homeScore, setHomeScore] = useState<number | ''>('');\n  const [awayScore, setAwayScore] = useState<number | ''>('');"
);

// handleEdit update
content = content.replace(
  "setAwayLogo(m.away_logo || '');\n    setEditingId(m.id);",
  "setAwayLogo(m.away_logo || '');\n    setHomeScore(m.home_score ?? '');\n    setAwayScore(m.away_score ?? '');\n    setEditingId(m.id);"
);

// handleSave update
content = content.replace(
  "away_logo: awayLogo\n    };",
  "away_logo: awayLogo,\n      home_score: homeScore === '' ? null : homeScore,\n      away_score: awayScore === '' ? null : awayScore\n    };"
);

// resetForm update
content = content.replace(
  "setHomeLogo(''); setAwayLogo(''); setMatchDate(''); setMatchTime(''); setVenue('');",
  "setHomeLogo(''); setAwayLogo(''); setMatchDate(''); setMatchTime(''); setVenue(''); setHomeScore(''); setAwayScore('');"
);

// UI additions for scores (only makes sense if game is done, but we'll just put it at the bottom of the form)
content = content.replace(
  /<div className="col-span-2 mt-4"><button type="submit"/,
  `<div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi Hesab (Bitibsə)</label><input type="number" value={homeScore} onChange={e => setHomeScore(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Hesab (Bitibsə)</label><input type="number" value={awayScore} onChange={e => setAwayScore(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div className="col-span-2 mt-4"><button type="submit"`
);

// Show score in list if exists
content = content.replace(
  /<div className="text-white font-black text-lg"><span className="text-\[#d7bf7b\] text-xs mr-2">\{m\.tournament \|\| 'U-12'\}<\/span> \{m\.home_team\} vs \{m\.away_team\}<\/div>/,
  `<div className="text-white font-black text-lg">
                <span className="text-[#d7bf7b] text-xs mr-2">{m.tournament || 'U-12'}</span> 
                {m.home_team} {m.home_score !== null ? \`(\${m.home_score})\` : ''} - {m.away_score !== null ? \`(\${m.away_score})\` : ''} {m.away_team}
              </div>`
);

fs.writeFileSync('src/app/admin/components/MatchesAdmin.tsx', content);
