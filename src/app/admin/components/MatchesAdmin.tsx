'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/imageCompress';
import { Trash2, Plus, UploadCloud, Radio } from 'lucide-react';

export default function MatchesAdmin() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tournament, setTournament] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeLogo, setHomeLogo] = useState('');
  const [awayLogo, setAwayLogo] = useState('');
  const [homeScore, setHomeScore] = useState<number | ''>('');
  const [awayScore, setAwayScore] = useState<number | ''>('');
  
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [venue, setVenue] = useState('');

  // New Live Match States
  const [status, setStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming');
  const [isHero, setIsHero] = useState(false);
  const [liveMinute, setLiveMinute] = useState('');
  const [addedTime, setAddedTime] = useState('');

  const [uploadingHomeLogo, setUploadingHomeLogo] = useState(false);
  const [uploadingAwayLogo, setUploadingAwayLogo] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
    if (data) setMatches(data);
    setLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHome: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (isHome) setUploadingHomeLogo(true);
    else setUploadingAwayLogo(true);

    try {
      const base64 = await compressImage(file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();
      
      if (uploadData.url) {
        if (isHome) setHomeLogo(uploadData.url);
        else setAwayLogo(uploadData.url);
      }
    } catch (err) {
      alert('Loqo yüklənərkən xəta baş verdi');
    }
    
    if (isHome) setUploadingHomeLogo(false);
    else setUploadingAwayLogo(false);
  };

  const handleEdit = (m: any) => {
    setTournament(m.tournament || '');
    setHomeTeam(m.home_team);
    setAwayTeam(m.away_team);
    setMatchDate(m.match_date || '');
    setMatchTime(m.match_time || '');
    setVenue(m.stadium || '');
    setHomeLogo(m.home_logo || '');
    setAwayLogo(m.away_logo || '');
    setHomeScore(m.home_score ?? '');
    setAwayScore(m.away_score ?? '');
    
    setStatus(m.status || 'upcoming');
    setIsHero(m.is_hero || false);
    setLiveMinute(m.live_minute || '');
    setAddedTime(m.added_time || '');

    setEditingId(m.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam) return alert('Komandaların adını qeyd edin.');

    const payload = {
      tournament: tournament || null,
      home_team: homeTeam,
      away_team: awayTeam,
      match_date: matchDate || null,
      match_time: matchTime || null,
      stadium: venue || null,
      home_logo: homeLogo,
      away_logo: awayLogo,
      home_score: homeScore === '' ? null : homeScore,
      away_score: awayScore === '' ? null : awayScore,
      status: status,
      is_hero: isHero,
      live_minute: liveMinute || null,
      added_time: addedTime || null
    };

    if (editingId) {
      await supabase.from('matches').update(payload).eq('id', editingId);
      alert('Oyun məlumatları yeniləndi!');
    } else {
      await supabase.from('matches').insert([payload]);
      alert('Oyun uğurla əlavə edildi!');
    }
    
    setIsAdding(false);
    resetForm();
    fetchMatches();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu oyunu silmək istədiyinizə əminsiniz?')) {
      await supabase.from('matches').delete().eq('id', id);
      fetchMatches();
    }
  };

  const resetForm = () => {
    setTournament(''); setHomeTeam(''); setAwayTeam(''); setHomeLogo(''); setAwayLogo('');
    setMatchDate(''); setMatchTime(''); setVenue(''); setHomeScore(''); setAwayScore('');
    setStatus('upcoming'); setIsHero(false); setLiveMinute(''); setAddedTime('');
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Oyunlar və Nəticələr</h2>
          <p className="text-gray-400 text-sm">Bütün oyunları, canlı nəticələri və ana səhifədə görünəcək əsas oyunu idarə edin.</p>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); resetForm(); }} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Oyun</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 space-y-6">
          
          <div className="bg-[#0a1423] p-4 rounded-xl border border-gray-800">
            <h3 className="text-white font-bold uppercase tracking-widest mb-4 flex items-center space-x-2 border-b border-gray-800 pb-2">
              <Radio className="w-5 h-5 text-[#d7bf7b]" />
              <span>Əsas / Canlı Oyun Parametrləri</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-[#152741] rounded-lg border border-gray-700 hover:border-[#d7bf7b] transition-colors">
                <input type="checkbox" checked={isHero} onChange={(e) => setIsHero(e.target.checked)} className="w-5 h-5 accent-[#d7bf7b] rounded" />
                <span className="text-white font-bold text-xs uppercase tracking-widest">Ana səhifənin ən üstündə göstər</span>
              </label>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Oyunun Vəziyyəti</label>
                <select value={status} onChange={(e: any) => setStatus(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-[#d7bf7b]">
                  <option value="upcoming">Gələcək Oyun (Upcoming)</option>
                  <option value="live">Canlı (Live)</option>
                  <option value="finished">Bitdi (Finished)</option>
                </select>
              </div>
            </div>

            {status === 'live' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <div>
                  <label className="block text-red-400 text-xs font-bold uppercase mb-2">Canlı Dəqiqə (Məs: 45', HT, 90+)</label>
                  <input type="text" value={liveMinute} onChange={e => setLiveMinute(e.target.value)} placeholder="Məs: 32'" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
                </div>
                <div>
                  <label className="block text-red-400 text-xs font-bold uppercase mb-2">Əlavə Vaxt (Məs: +3)</label>
                  <input type="text" value={addedTime} onChange={e => setAddedTime(e.target.value)} placeholder="Məs: +3" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi (Home)</label>
              <input type="text" value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Komanda (Away)</label>
              <input type="text" value={awayTeam} onChange={e => setAwayTeam(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required />
            </div>

            <div className="bg-[#0a1423] p-3 rounded-lg border border-gray-800">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi Loqosu (İstəyə Bağlı)</label>
              <div className="flex items-center space-x-3">
                {homeLogo && <img src={homeLogo} alt="Home" className="w-10 h-10 object-contain bg-white rounded p-1" />}
                <label className="cursor-pointer bg-[#152741] border border-gray-700 hover:border-[#d7bf7b] px-4 py-2 rounded text-xs font-bold text-white uppercase transition-colors">
                  {uploadingHomeLogo ? 'Yüklənir...' : 'Cihazdan Seç'}
                  <input type="file" accept="image/*" onChange={e => handleLogoUpload(e, true)} className="hidden" />
                </label>
              </div>
            </div>

            <div className="bg-[#0a1423] p-3 rounded-lg border border-gray-800">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Loqosu (İstəyə Bağlı)</label>
              <div className="flex items-center space-x-3">
                {awayLogo && <img src={awayLogo} alt="Away" className="w-10 h-10 object-contain bg-white rounded p-1" />}
                <label className="cursor-pointer bg-[#152741] border border-gray-700 hover:border-[#d7bf7b] px-4 py-2 rounded text-xs font-bold text-white uppercase transition-colors">
                  {uploadingAwayLogo ? 'Yüklənir...' : 'Cihazdan Seç'}
                  <input type="file" accept="image/*" onChange={e => handleLogoUpload(e, false)} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi Hesab (Canlı / Bitibsə)</label>
              <input type="number" value={homeScore} onChange={e => setHomeScore(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Hesab (Canlı / Bitibsə)</label>
              <input type="number" value={awayScore} onChange={e => setAwayScore(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Tarix (İstəyə Bağlı)</label>
              <input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Saat (İstəyə Bağlı)</label>
              <input type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Kateqoriyası / Liqa (İstəyə Bağlı)</label>
              <input type="text" value={tournament} onChange={e => setTournament(e.target.value)} placeholder="Məs: U-12" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Stadion (İstəyə Bağlı)</label>
              <input type="text" value={venue} onChange={e => setVenue(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
            </div>
          </div>
          
          <div className="text-[10px] text-gray-400 uppercase tracking-widest text-center my-4">
            * Yüklənən şəkillər öz keyfiyyətində olacaq, maksimum 30MB həcmində. Bütün xanalar (komanda adlarından başqa) istəyə bağlıdır.
          </div>

          <button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">
            Yadda Saxla
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-[#d7bf7b] text-center font-bold tracking-widest uppercase animate-pulse mt-10">Yüklənir...</div>
      ) : (
        <div className="space-y-4">
          {matches.map(m => (
            <div key={m.id} className={`bg-[#152741] border ${m.is_hero ? 'border-[#d7bf7b]' : 'border-gray-800'} p-4 md:p-6 rounded-xl flex flex-col md:flex-row items-center justify-between`}>
              
              <div className="flex flex-col flex-1 w-full text-center md:text-left mb-4 md:mb-0">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  {m.is_hero && <span className="bg-[#d7bf7b] text-[#152741] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Ana Səhifə</span>}
                  
                  {m.status === 'live' && <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded animate-pulse">Canlı: {m.live_minute || ''} {m.added_time || ''}</span>}
                  {m.status === 'finished' && <span className="bg-gray-700 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Bitdi</span>}
                  
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{m.tournament}</span>
                </div>
                
                <div className="text-white font-black text-lg flex items-center justify-center md:justify-start">
                  {m.home_team} {m.home_score !== null ? <span className="text-[#d7bf7b] mx-2">({m.home_score})</span> : ''} 
                  <span className="mx-2 text-gray-600">-</span> 
                  {m.away_score !== null ? <span className="text-[#d7bf7b] mx-2">({m.away_score})</span> : ''} {m.away_team}
                </div>
                
                <div className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest">
                  {m.match_date || 'Tarix Yoxdur'} • {m.match_time || 'Saat Yoxdur'} • {m.stadium || 'Stadion Yoxdur'}
                </div>
              </div>

              <div className="flex space-x-3 w-full md:w-auto justify-center">
                <button onClick={() => handleEdit(m)} className="bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-colors">Düzəliş</button>
                <button onClick={() => handleDelete(m.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-colors flex items-center space-x-1"><Trash2 className="w-3 h-3"/> <span>Sil</span></button>
              </div>

            </div>
          ))}
          {matches.length === 0 && <div className="text-center text-gray-500 py-10 uppercase tracking-widest text-xs font-bold">Heç bir oyun yoxdur.</div>}
        </div>
      )}
    </div>
  );
}
