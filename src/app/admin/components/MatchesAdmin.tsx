'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/imageCompress';
import { Trash2, Plus, UploadCloud } from 'lucide-react';

export default function MatchesAdmin() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tournament, setTournament] = useState('U-12');
  const [homeTeam, setHomeTeam] = useState('');
  
  // Hero Match States
  const [heroMatch, setHeroMatch] = useState({ home: '', away: '', date: '', time: '', venue: '', league: '', home_logo: '', away_logo: '' });
  const [uploadingHeroHome, setUploadingHeroHome] = useState(false);
  const [uploadingHeroAway, setUploadingHeroAway] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [awayTeam, setAwayTeam] = useState('');
  const [homeLogo, setHomeLogo] = useState('');
  const [awayLogo, setAwayLogo] = useState('');
  const [homeScore, setHomeScore] = useState<number | ''>('');
  const [awayScore, setAwayScore] = useState<number | ''>('');
  const [uploadingHomeLogo, setUploadingHomeLogo] = useState(false);
  const [uploadingAwayLogo, setUploadingAwayLogo] = useState(false);
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [venue, setVenue] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
    
    // Fetch hero match from site_images
    const keys = ['hero_match_home', 'hero_match_away', 'hero_match_date', 'hero_match_time', 'hero_match_venue', 'hero_match_league', 'hero_match_home_logo', 'hero_match_away_logo'];
    const { data: heroData } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
    if (heroData) {
      const hm = { home: '', away: '', date: '', time: '', venue: '', league: '', home_logo: '', away_logo: '' };
      heroData.forEach(item => {
        if (item.section_key === 'hero_match_home') hm.home = item.image_url;
        if (item.section_key === 'hero_match_away') hm.away = item.image_url;
        if (item.section_key === 'hero_match_date') hm.date = item.image_url;
        if (item.section_key === 'hero_match_time') hm.time = item.image_url;
        if (item.section_key === 'hero_match_venue') hm.venue = item.image_url;
        if (item.section_key === 'hero_match_league') hm.league = item.image_url;
        if (item.section_key === 'hero_match_home_logo') hm.home_logo = item.image_url;
        if (item.section_key === 'hero_match_away_logo') hm.away_logo = item.image_url;
      });
      setHeroMatch(hm);
    }
    if (data) setMatches(data);
    setLoading(false);
  };

  const handleSaveHero = async () => {
    setSavingHero(true);
    const details = [
      { key: 'hero_match_home', val: heroMatch.home },
      { key: 'hero_match_away', val: heroMatch.away },
      { key: 'hero_match_date', val: heroMatch.date },
      { key: 'hero_match_time', val: heroMatch.time },
      { key: 'hero_match_venue', val: heroMatch.venue },
      { key: 'hero_match_league', val: heroMatch.league },
      { key: 'hero_match_home_logo', val: heroMatch.home_logo },
      { key: 'hero_match_away_logo', val: heroMatch.away_logo }
    ];

    for (const d of details) {
      const { data } = await supabase.from('site_images').select('id').eq('section_key', d.key).maybeSingle();
      if (data) {
        await supabase.from('site_images').update({ image_url: d.val }).eq('section_key', d.key);
      } else {
        await supabase.from('site_images').insert([{ section_key: d.key, image_url: d.val }]);
      }
    }
    setSavingHero(false);
    alert('Ana səhifə oyunu yadda saxlanıldı!');
  };

  const handleEdit = (m: any) => {
    setTournament(m.tournament || 'U-12');
    setHomeTeam(m.home_team);
    setAwayTeam(m.away_team);
    setMatchDate(m.match_date || '');
    setMatchTime(m.match_time || '');
    setVenue(m.stadium || '');
    setHomeLogo(m.home_logo || '');
    setAwayLogo(m.away_logo || '');
    setHomeScore(m.home_score ?? '');
    setAwayScore(m.away_score ?? '');
    setEditingId(m.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      home_team: homeTeam,
      away_team: awayTeam,
      match_date: matchDate || null,
      match_time: matchTime || null,
      stadium: venue,
      tournament,
      home_logo: homeLogo,
      away_logo: awayLogo,
      home_score: homeScore === '' ? null : homeScore,
      away_score: awayScore === '' ? null : awayScore
    };

    if (editingId) {
      await supabase.from('matches').update(payload).eq('id', editingId);
      alert('Yeniləndi!');
    } else {
      await supabase.from('matches').insert([payload]);
      alert('Əlavə edildi!');
    }

    setEditingId(null);
    setIsAdding(false);
    resetForm();
    fetchMatches();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('matches').delete().eq('id', id);
      fetchMatches();
    }
  };

  const resetForm = () => {
    setHomeTeam(''); setAwayTeam(''); setHomeLogo(''); setAwayLogo(''); setMatchDate(''); setMatchTime(''); setVenue(''); setHomeScore(''); setAwayScore('');
  };

  return (
    <div>
      {/* HERO MATCH FORM */}
      <div className="mb-12 bg-[#152741] border border-[#d7bf7b]/50 p-6 rounded-2xl shadow-[0_0_20px_rgba(215,191,123,0.1)]">
        <h3 className="text-[#d7bf7b] font-black uppercase tracking-widest text-lg mb-4">Ana Səhifə (Şəklin Üstündəki) Növbəti Oyun</h3>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Bu bölmədə daxil etdiyiniz oyun yalnız ana səhifədə, böyük arxa plan şəklinin üstündə görünəcək.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Liqa</label><input type="text" value={heroMatch.league} onChange={e => setHeroMatch({...heroMatch, league: e.target.value})} placeholder="Məs: U-12 Liqası" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Ev Sahibi</label><input type="text" value={heroMatch.home} onChange={e => setHeroMatch({...heroMatch, home: e.target.value})} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Qonaq</label><input type="text" value={heroMatch.away} onChange={e => setHeroMatch({...heroMatch, away: e.target.value})} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          
          <div>
            <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Ev Sahibi Loqosu</label>
            <div className="flex items-center space-x-2">
              {heroMatch.home_logo && <img src={heroMatch.home_logo} alt="Home" className="w-10 h-10 object-contain bg-white rounded p-1" />}
              <label className={`flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-2 cursor-pointer flex items-center justify-center space-x-1 hover:border-[#d7bf7b] ${uploadingHeroHome ? 'opacity-50' : ''}`}>
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
              <label className={`flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-2 cursor-pointer flex items-center justify-center space-x-1 hover:border-[#d7bf7b] ${uploadingHeroAway ? 'opacity-50' : ''}`}>
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
        <button onClick={handleSaveHero} disabled={savingHero} className="bg-[#d7bf7b] text-[#152741] px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest">{savingHero ? 'Saxlanılır...' : 'Ana Səhifə Oyununu Saxla'}</button>
      </div>

      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Oyunlar İdarəetməsi</h2>
          <p className="text-gray-400 text-sm">Növbəti oyunları buradan əlavə və redaktə edin.</p>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); resetForm(); }} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Oyun</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Liqa / Kateqoriya</label>
            <select value={tournament} onChange={e => setTournament(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white">
              <option value="U-12">U-12</option>
              <option value="U-11">U-11</option>
              <option value="U-10">U-10</option>
              <option value="U-9">U-9</option>
            </select>
          </div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi</label><input type="text" value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required /></div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi Loqosu</label>
            <div className="flex items-center space-x-2">
              {homeLogo && <img src={homeLogo} alt="Home" className="w-10 h-10 object-contain bg-white rounded p-1" />}
              <label className={`flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 cursor-pointer flex items-center justify-center space-x-2 hover:border-[#d7bf7b] ${uploadingHomeLogo ? 'opacity-50' : ''}`}>
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
              <label className={`flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 cursor-pointer flex items-center justify-center space-x-2 hover:border-[#d7bf7b] ${uploadingAwayLogo ? 'opacity-50' : ''}`}>
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
          </div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Tarix</label><input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Saat</label><input type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div className="col-span-2"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Stadion</label><input type="text" value={venue} onChange={e => setVenue(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" placeholder="Məs: Sumqayıt Arena" /></div>
          <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi Hesab (Bitibsə)</label><input type="number" value={homeScore} onChange={e => setHomeScore(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Hesab (Bitibsə)</label><input type="number" value={awayScore} onChange={e => setAwayScore(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div className="col-span-2 mt-4"><button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase tracking-widest">Yadda Saxla</button></div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {matches.map(m => (
          <div key={m.id} className="bg-[#152741] rounded-xl border border-gray-800 p-4 flex items-center justify-between">
            <div>
              <div className="text-white font-black text-lg">
                <span className="text-[#d7bf7b] text-xs mr-2">{m.tournament || 'U-12'}</span> 
                {m.home_team} {m.home_score !== null ? `(${m.home_score})` : ''} - {m.away_score !== null ? `(${m.away_score})` : ''} {m.away_team}
              </div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                 {m.match_date} • {m.match_time} • {m.stadium}
              </div>
            </div>
            <div className="space-x-4">
              <button onClick={() => handleEdit(m)} className="text-blue-400 text-xs font-bold uppercase hover:underline">Düzəliş</button>
              <button onClick={() => handleDelete(m.id)} className="text-red-400 text-xs font-bold uppercase hover:underline">Sil</button>
            </div>
          </div>
        ))}
        {matches.length === 0 && <div className="text-gray-500 text-center py-6">Heç bir oyun tapılmadı.</div>}
      </div>
    </div>
  );
}
