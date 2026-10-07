'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus } from 'lucide-react';

export default function StandingsAdmin() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [teamName, setTeamName] = useState('');
  const [played, setPlayed] = useState<number>(0);
  const [won, setWon] = useState<number>(0);
  const [drawn, setDrawn] = useState<number>(0);
  const [lost, setLost] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    setLoading(true);
    const { data } = await supabase.from('standings').select('*').order('points', { ascending: false });
    if (data) setStandings(data);
    setLoading(false);
  };

  const handleEdit = (s: any) => {
    setTeamName(s.team_name);
    setPlayed(s.played);
    setWon(s.won);
    setDrawn(s.drawn);
    setLost(s.lost);
    setPoints(s.points);
    setEditingId(s.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      team_name: teamName,
      played, won, drawn, lost, points,
      tournament_name: 'Gənclər Liqası'
    };

    if (editingId) {
      await supabase.from('standings').update(payload).eq('id', editingId);
      alert('Yeniləndi!');
    } else {
      await supabase.from('standings').insert([payload]);
      alert('Əlavə edildi!');
    }

    setEditingId(null);
    setIsAdding(false);
    resetForm();
    fetchStandings();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('standings').delete().eq('id', id);
      fetchStandings();
    }
  };

  const resetForm = () => {
    setTeamName(''); setPlayed(0); setWon(0); setDrawn(0); setLost(0); setPoints(0);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Turnir Cədvəli İdarəetməsi</h2>
          <p className="text-gray-400 text-sm">Cədvəldəki komandaları və xalları redaktə edin.</p>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); resetForm(); }} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Komanda</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-3">
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Adı</label>
            <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required />
          </div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Oyun</label><input type="number" value={played} onChange={e => setPlayed(Number(e.target.value))} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qələbə</label><input type="number" value={won} onChange={e => setWon(Number(e.target.value))} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Heç-Heçə</label><input type="number" value={drawn} onChange={e => setDrawn(Number(e.target.value))} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məğlubiyyət</label><input type="number" value={lost} onChange={e => setLost(Number(e.target.value))} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div><label className="block text-[#d7bf7b] text-xs font-bold uppercase mb-2">Xal</label><input type="number" value={points} onChange={e => setPoints(Number(e.target.value))} className="w-full bg-[#0d1a2d] border border-[#d7bf7b] rounded-lg p-3 text-white" /></div>
          <div className="col-span-2 md:col-span-3 mt-4">
             <button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase tracking-widest">Yadda Saxla</button>
          </div>
        </form>
      )}

      <div className="bg-[#152741] rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#0d1a2d] text-gray-400 uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="p-4">Komanda</th>
              <th className="p-4 text-center">O</th>
              <th className="p-4 text-center">Q</th>
              <th className="p-4 text-center">H</th>
              <th className="p-4 text-center">M</th>
              <th className="p-4 text-center text-[#d7bf7b]">Xal</th>
              <th className="p-4 text-right">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr key={s.id} className="border-t border-gray-800 hover:bg-[#1a2e4c]">
                <td className="p-4 font-bold flex items-center space-x-3">
                  <span className="text-gray-500 w-4">{i + 1}</span>
                  <span className={s.team_name.includes('Yarımada') ? 'text-[#d7bf7b]' : 'text-white'}>{s.team_name}</span>
                </td>
                <td className="p-4 text-center">{s.played}</td>
                <td className="p-4 text-center">{s.won}</td>
                <td className="p-4 text-center">{s.drawn}</td>
                <td className="p-4 text-center">{s.lost}</td>
                <td className="p-4 text-center text-[#d7bf7b] font-black">{s.points}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-400 text-xs font-bold uppercase hover:underline">Düzəliş</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-400 text-xs font-bold uppercase hover:underline">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
