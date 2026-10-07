const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/MatchesAdmin.tsx', 'utf-8');

// Add states for tournament and Hero Match
content = content.replace(
  "const [homeTeam, setHomeTeam] = useState('');",
  `const [tournament, setTournament] = useState('U-12');
  const [homeTeam, setHomeTeam] = useState('');
  
  // Hero Match States
  const [heroMatch, setHeroMatch] = useState({ home: '', away: '', date: '', time: '', venue: '', league: '' });
  const [savingHero, setSavingHero] = useState(false);`
);

// Fetch hero match
content = content.replace(
  "const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true });",
  `const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
    
    // Fetch hero match from site_images
    const keys = ['hero_match_home', 'hero_match_away', 'hero_match_date', 'hero_match_time', 'hero_match_venue', 'hero_match_league'];
    const { data: heroData } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
    if (heroData) {
      const hm = { home: '', away: '', date: '', time: '', venue: '', league: '' };
      heroData.forEach(item => {
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

// handleSaveHero function
content = content.replace(
  "const handleEdit = (m: any) => {",
  `const handleSaveHero = async () => {
    setSavingHero(true);
    const details = [
      { key: 'hero_match_home', val: heroMatch.home },
      { key: 'hero_match_away', val: heroMatch.away },
      { key: 'hero_match_date', val: heroMatch.date },
      { key: 'hero_match_time', val: heroMatch.time },
      { key: 'hero_match_venue', val: heroMatch.venue },
      { key: 'hero_match_league', val: heroMatch.league }
    ];

    for (const d of details) {
      const { data } = await supabase.from('site_images').select('id').eq('section_key', d.key).single();
      if (data) {
        await supabase.from('site_images').update({ image_url: d.val }).eq('section_key', d.key);
      } else {
        await supabase.from('site_images').insert([{ section_key: d.key, image_url: d.val }]);
      }
    }
    setSavingHero(false);
    alert('Ana səhifə oyunu yadda saxlanıldı!');
  };

  const handleEdit = (m: any) => {`
);

// handleEdit update
content = content.replace(
  "setHomeTeam(m.home_team);",
  "setTournament(m.tournament || 'U-12');\n    setHomeTeam(m.home_team);"
);

// handleSave update
content = content.replace(
  "tournament: 'Gənclər Liqası'",
  "tournament"
);

// UI additions
content = content.replace(
  /<div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">/,
  `{/* HERO MATCH FORM */}
      <div className="mb-12 bg-[#152741] border border-[#d7bf7b]/50 p-6 rounded-2xl shadow-[0_0_20px_rgba(215,191,123,0.1)]">
        <h3 className="text-[#d7bf7b] font-black uppercase tracking-widest text-lg mb-4">Ana Səhifə (Şəklin Üstündəki) Növbəti Oyun</h3>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Bu bölmədə daxil etdiyiniz oyun yalnız ana səhifədə, böyük arxa plan şəklinin üstündə görünəcək.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Liqa</label><input type="text" value={heroMatch.league} onChange={e => setHeroMatch({...heroMatch, league: e.target.value})} placeholder="Məs: U-12 Liqası" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Ev Sahibi</label><input type="text" value={heroMatch.home} onChange={e => setHeroMatch({...heroMatch, home: e.target.value})} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Qonaq</label><input type="text" value={heroMatch.away} onChange={e => setHeroMatch({...heroMatch, away: e.target.value})} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Tarix</label><input type="text" value={heroMatch.date} onChange={e => setHeroMatch({...heroMatch, date: e.target.value})} placeholder="Məs: 15 Oktyabr" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Saat</label><input type="text" value={heroMatch.time} onChange={e => setHeroMatch({...heroMatch, time: e.target.value})} placeholder="Məs: 17:00" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Stadion</label><input type="text" value={heroMatch.venue} onChange={e => setHeroMatch({...heroMatch, venue: e.target.value})} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
        </div>
        <button onClick={handleSaveHero} disabled={savingHero} className="bg-[#d7bf7b] text-[#152741] px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest">{savingHero ? 'Saxlanılır...' : 'Ana Səhifə Oyununu Saxla'}</button>
      </div>

      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">`
);

content = content.replace(
  /<div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi<\/label><input type="text" value=\{homeTeam\} onChange=\{e => setHomeTeam\(e.target.value\)\} className="w-full bg-\[#0d1a2d\] border border-gray-700 rounded-lg p-3 text-white" required \/><\/div>/,
  `<div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Liqa / Kateqoriya</label>
            <select value={tournament} onChange={e => setTournament(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white">
              <option value="U-12">U-12</option>
              <option value="U-11">U-11</option>
              <option value="U-10">U-10</option>
              <option value="U-9">U-9</option>
            </select>
          </div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi</label><input type="text" value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required /></div>`
);

content = content.replace(
  /<div className="text-white font-black text-lg">\{m.home_team\} vs \{m.away_team\}<\/div>/,
  `<div className="text-white font-black text-lg"><span className="text-[#d7bf7b] text-xs mr-2">{m.tournament || 'U-12'}</span> {m.home_team} vs {m.away_team}</div>`
);

fs.writeFileSync('src/app/admin/components/MatchesAdmin.tsx', content);
