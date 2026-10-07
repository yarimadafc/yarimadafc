const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/MatchesAdmin.tsx', 'utf-8');

// Add UploadCloud import
if (!content.includes("import { UploadCloud }")) {
    content = content.replace("import { Trash2, Plus } from 'lucide-react';", "import { Trash2, Plus, UploadCloud } from 'lucide-react';");
}

// Add compressImage import
if (!content.includes("compressImage")) {
    content = content.replace("import { supabase } from '@/lib/supabase';", "import { supabase } from '@/lib/supabase';\nimport { compressImage } from '@/lib/imageCompress';");
}

// Add state for normal match logos
content = content.replace(
  "const [awayTeam, setAwayTeam] = useState('');",
  "const [awayTeam, setAwayTeam] = useState('');\n  const [homeLogo, setHomeLogo] = useState('');\n  const [awayLogo, setAwayLogo] = useState('');\n  const [uploadingHomeLogo, setUploadingHomeLogo] = useState(false);\n  const [uploadingAwayLogo, setUploadingAwayLogo] = useState(false);"
);

// Update Hero Match initial state
content = content.replace(
  "const [heroMatch, setHeroMatch] = useState({ home: '', away: '', date: '', time: '', venue: '', league: '' });",
  "const [heroMatch, setHeroMatch] = useState({ home: '', away: '', date: '', time: '', venue: '', league: '', home_logo: '', away_logo: '' });\n  const [uploadingHeroHome, setUploadingHeroHome] = useState(false);\n  const [uploadingHeroAway, setUploadingHeroAway] = useState(false);"
);

// Update Hero Match fetch logic
content = content.replace(
  "const keys = ['hero_match_home', 'hero_match_away', 'hero_match_date', 'hero_match_time', 'hero_match_venue', 'hero_match_league'];",
  "const keys = ['hero_match_home', 'hero_match_away', 'hero_match_date', 'hero_match_time', 'hero_match_venue', 'hero_match_league', 'hero_match_home_logo', 'hero_match_away_logo'];"
);

content = content.replace(
  "const hm = { home: '', away: '', date: '', time: '', venue: '', league: '' };",
  "const hm = { home: '', away: '', date: '', time: '', venue: '', league: '', home_logo: '', away_logo: '' };"
);

content = content.replace(
  "if (item.section_key === 'hero_match_league') hm.league = item.image_url;",
  "if (item.section_key === 'hero_match_league') hm.league = item.image_url;\n        if (item.section_key === 'hero_match_home_logo') hm.home_logo = item.image_url;\n        if (item.section_key === 'hero_match_away_logo') hm.away_logo = item.image_url;"
);

// Update Hero Match save logic
content = content.replace(
  "{ key: 'hero_match_league', val: heroMatch.league }",
  "{ key: 'hero_match_league', val: heroMatch.league },\n      { key: 'hero_match_home_logo', val: heroMatch.home_logo },\n      { key: 'hero_match_away_logo', val: heroMatch.away_logo }"
);

// Add logo uploads to Hero Match UI
content = content.replace(
  /<div><label className="block text-gray-400 text-\[10px\] font-bold uppercase mb-2">Liqa<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<button onClick=\{handleSaveHero\}/,
  `<div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Liqa</label><input type="text" value={heroMatch.league} onChange={e => setHeroMatch({...heroMatch, league: e.target.value})} placeholder="Məs: U-12 Liqası" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Ev Sahibi</label><input type="text" value={heroMatch.home} onChange={e => setHeroMatch({...heroMatch, home: e.target.value})} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Qonaq</label><input type="text" value={heroMatch.away} onChange={e => setHeroMatch({...heroMatch, away: e.target.value})} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          
          <div>
            <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Ev Sahibi Loqosu</label>
            <div className="flex items-center space-x-2">
              {heroMatch.home_logo && <img src={heroMatch.home_logo} alt="Home" className="w-10 h-10 object-contain bg-white rounded p-1" />}
              <label className={\`flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-2 cursor-pointer flex items-center justify-center space-x-1 hover:border-[#d7bf7b] \${uploadingHeroHome ? 'opacity-50' : ''}\`}>
                <UploadCloud className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-[10px] uppercase">{uploadingHeroHome ? '...' : 'Seç'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  if(e.target.files && e.target.files[0]){
                    setUploadingHeroHome(true);
                    try{
                      const b64 = await compressImage(e.target.files[0]);
                      const r = await fetch('/api/upload', { method: 'POST', body: JSON.stringify({image: b64}) });
                      const d = await r.json();
                      if(d.url) setHeroMatch({...heroMatch, home_logo: d.url});
                    }catch(e){}
                    setUploadingHeroHome(false);
                  }
                }} />
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Qonaq Loqosu</label>
            <div className="flex items-center space-x-2">
              {heroMatch.away_logo && <img src={heroMatch.away_logo} alt="Away" className="w-10 h-10 object-contain bg-white rounded p-1" />}
              <label className={\`flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-2 cursor-pointer flex items-center justify-center space-x-1 hover:border-[#d7bf7b] \${uploadingHeroAway ? 'opacity-50' : ''}\`}>
                <UploadCloud className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-[10px] uppercase">{uploadingHeroAway ? '...' : 'Seç'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  if(e.target.files && e.target.files[0]){
                    setUploadingHeroAway(true);
                    try{
                      const b64 = await compressImage(e.target.files[0]);
                      const r = await fetch('/api/upload', { method: 'POST', body: JSON.stringify({image: b64}) });
                      const d = await r.json();
                      if(d.url) setHeroMatch({...heroMatch, away_logo: d.url});
                    }catch(e){}
                    setUploadingHeroAway(false);
                  }
                }} />
              </label>
            </div>
          </div>

          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Tarix</label><input type="text" value={heroMatch.date} onChange={e => setHeroMatch({...heroMatch, date: e.target.value})} placeholder="Məs: 15 Oktyabr" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Saat</label><input type="text" value={heroMatch.time} onChange={e => setHeroMatch({...heroMatch, time: e.target.value})} placeholder="Məs: 17:00" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div className="md:col-span-2"><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Stadion</label><input type="text" value={heroMatch.venue} onChange={e => setHeroMatch({...heroMatch, venue: e.target.value})} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
        </div>
        <button onClick={handleSaveHero}`
);

// Update Normal Match Edit
content = content.replace(
  "setVenue(m.stadium || '');\n    setEditingId(m.id);",
  "setVenue(m.stadium || '');\n    setHomeLogo(m.home_logo || '');\n    setAwayLogo(m.away_logo || '');\n    setEditingId(m.id);"
);

// Update Normal Match Save
content = content.replace(
  "stadium: venue,\n      tournament\n    };",
  "stadium: venue,\n      tournament,\n      home_logo: homeLogo,\n      away_logo: awayLogo\n    };"
);

// Update Normal Match UI inputs
content = content.replace(
  /<div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi<\/label><input type="text" value=\{homeTeam\}[\s\S]*?required \/><\/div>\s*<div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Komanda<\/label><input type="text" value=\{awayTeam\}[\s\S]*?required \/><\/div>/,
  `<div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi</label><input type="text" value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required /></div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi Loqosu</label>
            <div className="flex items-center space-x-2">
              {homeLogo && <img src={homeLogo} alt="Home" className="w-10 h-10 object-contain bg-white rounded p-1" />}
              <label className={\`flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 cursor-pointer flex items-center justify-center space-x-2 hover:border-[#d7bf7b] \${uploadingHomeLogo ? 'opacity-50' : ''}\`}>
                <UploadCloud className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-xs uppercase">{uploadingHomeLogo ? 'Yüklənir...' : 'Cihazdan Seç'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  if(e.target.files && e.target.files[0]){
                    setUploadingHomeLogo(true);
                    try{
                      const b64 = await compressImage(e.target.files[0]);
                      const r = await fetch('/api/upload', { method: 'POST', body: JSON.stringify({image: b64}) });
                      const d = await r.json();
                      if(d.url) setHomeLogo(d.url);
                    }catch(e){}
                    setUploadingHomeLogo(false);
                  }
                }} />
              </label>
            </div>
          </div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Komanda</label><input type="text" value={awayTeam} onChange={e => setAwayTeam(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required /></div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Komanda Loqosu</label>
            <div className="flex items-center space-x-2">
              {awayLogo && <img src={awayLogo} alt="Away" className="w-10 h-10 object-contain bg-white rounded p-1" />}
              <label className={\`flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 cursor-pointer flex items-center justify-center space-x-2 hover:border-[#d7bf7b] \${uploadingAwayLogo ? 'opacity-50' : ''}\`}>
                <UploadCloud className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-xs uppercase">{uploadingAwayLogo ? 'Yüklənir...' : 'Cihazdan Seç'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  if(e.target.files && e.target.files[0]){
                    setUploadingAwayLogo(true);
                    try{
                      const b64 = await compressImage(e.target.files[0]);
                      const r = await fetch('/api/upload', { method: 'POST', body: JSON.stringify({image: b64}) });
                      const d = await r.json();
                      if(d.url) setAwayLogo(d.url);
                    }catch(e){}
                    setUploadingAwayLogo(false);
                  }
                }} />
              </label>
            </div>
          </div>`
);

content = content.replace(
  "setHomeTeam(''); setAwayTeam(''); setMatchDate(''); setMatchTime(''); setVenue('');",
  "setHomeTeam(''); setAwayTeam(''); setHomeLogo(''); setAwayLogo(''); setMatchDate(''); setMatchTime(''); setVenue('');"
);

fs.writeFileSync('src/app/admin/components/MatchesAdmin.tsx', content);
