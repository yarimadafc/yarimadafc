'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus } from 'lucide-react';

export default function MatchesAdmin() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [venue, setVenue] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
    if (data) setMatches(data);
    setLoading(false);
  };

  const handleEdit = (m: any) => {
    setHomeTeam(m.home_team);
    setAwayTeam(m.away_team);
    setMatchDate(m.match_date || '');
    setMatchTime(m.match_time || '');
    setVenue(m.venue || '');
    setEditingId(m.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      home_team: homeTeam,
      away_team: awayTeam,
      match_date: matchDate,
      match_time: matchTime,
      venue,
      tournament: 'Gənclər Liqası'
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
    setHomeTeam(''); setAwayTeam(''); setMatchDate(''); setMatchTime(''); setVenue('');
  };

  return (
    <div>
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
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi</label><input type="text" value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required /></div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Komanda</label><input type="text" value={awayTeam} onChange={e => setAwayTeam(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required /></div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Tarix</label><input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Saat</label><input type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div className="col-span-2"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Stadion</label><input type="text" value={venue} onChange={e => setVenue(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" placeholder="Məs: Sumqayıt Arena" /></div>
          <div className="col-span-2 mt-4"><button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase tracking-widest">Yadda Saxla</button></div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {matches.map(m => (
          <div key={m.id} className="bg-[#152741] rounded-xl border border-gray-800 p-4 flex items-center justify-between">
            <div>
              <div className="text-white font-black text-lg">{m.home_team} vs {m.away_team}</div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                 {m.match_date} • {m.match_time} • {m.venue}
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
