'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb } from '@/lib/adminDb';
import { Plus, Trash2, Edit2, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StandingsAdmin() {
  const [standings, setStandings] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States
  const [activeLeague, setActiveLeague] = useState<string | null>(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [teamName, setTeamName] = useState('');
  const [played, setPlayed] = useState<number>(0);
  const [won, setWon] = useState<number>(0);
  const [drawn, setDrawn] = useState<number>(0);
  const [lost, setLost] = useState<number>(0);

  // played and points follow wins/draws/losses automatically (3 points per win, 1 per draw); both stay editable
  const recalc = (w: number, d: number, l: number) => {
    setWon(w); setDrawn(d); setLost(l);
    setPlayed(w + d + l);
    setPoints(w * 3 + d);
  };
  const [points, setPoints] = useState<number>(0);
  const [gf, setGf] = useState<number>(0);
  const [ga, setGa] = useState<number>(0);

  // Auto-calculate Points and Played matches
  useEffect(() => {
    setPlayed(won + drawn + lost);
    setPoints((won * 3) + (drawn * 1));
  }, [won, drawn, lost]);

  useEffect(() => {
    fetchTeams();
    fetchStandings();
  }, []);

  const fetchTeams = async () => {
    const { data } = await supabase.from('teams').select('name').order('name', { ascending: true });
    if (data) {
      const sorted = [...data].sort((a, b) => {
        const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
        return numA - numB;
      });
      setTeams(sorted);
    }
  };

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
    setGf(s.gf || 0);
    setGa(s.ga || 0);
    setEditingId(s.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeague) return;
    
    const payload = {
      team_name: teamName,
      played, won, drawn, lost, points, gf, ga,
      tournament_name: activeLeague
    };

    if (editingId) {
      await adminDb.from('standings').update(payload).eq('id', editingId);
      alert('Yeniləndi!');
    } else {
      await adminDb.from('standings').insert([payload]);
      alert('Əlavə edildi!');
    }

    setEditingId(null);
    setIsAdding(false);
    resetForm();
    fetchStandings();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await adminDb.from('standings').delete().eq('id', id);
      fetchStandings();
    }
  };

  const resetForm = () => {
    setTeamName(''); setPlayed(0); setWon(0); setDrawn(0); setLost(0); setPoints(0);
    setGf(0); setGa(0);
  };
  
  const activeStandings = activeLeague ? standings.filter(s => s.tournament_name === activeLeague) : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Turnir Cədvəli İdarəetməsi</h2>
          <p className="text-gray-400 text-sm">Cədvəldəki komandaları və xalları qruplar (komandalar) üzrə redaktə edin.</p>
        </div>
      </div>

      {!activeLeague ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teams.map(t => (
               <div 
                 key={t.name}
                 onClick={() => setActiveLeague(t.name)}
                 className="bg-gray-800 border border-gray-700 hover:border-accent/50 p-6 rounded-2xl cursor-pointer group transition-all hover:shadow-xl flex items-center justify-between"
               >
                 <h3 className="text-lg font-black text-white uppercase tracking-widest group-hover:text-accent">{t.name}</h3>
                 <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent" />
               </div>
            ))}
         </div>
      ) : (
         <div>
            <div className="flex items-center justify-between mb-8">
               <button 
                  onClick={() => { setActiveLeague(null); setIsAdding(false); resetForm(); }}
                  className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
               >
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Siyahıya Qayıt
               </button>
               <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); resetForm(); }} className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
                 {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Əlavə</span></>}
               </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">{activeLeague} Qrupu - Turnir Cədvəli</h3>

            {isAdding && (
              <form onSubmit={handleSave} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 md:col-span-4">
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Adı</label>
                  <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
                </div>
                <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Oyun (Avto)</label><input type="number" value={played} readOnly className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-gray-400 cursor-not-allowed" /></div>
                <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qələbə</label><input type="number" value={won} onChange={e => recalc(Number(e.target.value), drawn, lost)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Heç-Heçə</label><input type="number" value={drawn} onChange={e => recalc(won, Number(e.target.value), lost)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məğlubiyyət</label><input type="number" value={lost} onChange={e => recalc(won, drawn, Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div className="col-span-2"><label className="block text-green-400 text-xs font-bold uppercase mb-2">Vurduğu Qol (VQ)</label><input type="number" value={gf} onChange={e => setGf(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div className="col-span-2"><label className="block text-red-400 text-xs font-bold uppercase mb-2">Buraxdığı Top (BT)</label><input type="number" value={ga} onChange={e => setGa(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div className="col-span-2 md:col-span-4"><label className="block text-accent text-xs font-bold uppercase mb-2">Xal (Avto)</label><input type="number" value={points} readOnly className="w-full bg-gray-900/50 border border-accent/50 rounded-lg p-3 text-accent font-black cursor-not-allowed" /></div>
                <div className="col-span-2 md:col-span-4 mt-2">
                   <button type="submit" className="w-full bg-accent text-on-accent py-3 rounded-lg font-bold text-xs uppercase tracking-widest">Yadda Saxla</button>
                </div>
              </form>
            )}

            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-gray-900 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                    <tr>
                      <th className="p-4">Sıra</th>
                      <th className="p-4">Komanda</th>
                      <th className="p-4 text-center">O</th>
                      <th className="p-4 text-center">Q</th>
                      <th className="p-4 text-center">H</th>
                      <th className="p-4 text-center">M</th>
                      <th className="p-4 text-center text-green-400">VQ</th>
                      <th className="p-4 text-center text-red-400">BT</th>
                      <th className="p-4 text-center text-accent">Xal</th>
                      <th className="p-4 text-right">Əməliyyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeStandings.map((s, i) => (
                      <tr key={s.id} className="border-t border-gray-700 hover:bg-gray-800">
                        <td className="p-4 text-gray-400 font-bold">{i + 1}</td>
                        <td className="p-4 font-bold">
                          <span className={s.team_name.includes('Yarımada') ? 'text-accent' : 'text-white'}>{s.team_name}</span>
                        </td>
                        <td className="p-4 text-center">{s.played}</td>
                        <td className="p-4 text-center">{s.won}</td>
                        <td className="p-4 text-center">{s.drawn}</td>
                        <td className="p-4 text-center">{s.lost}</td>
                        <td className="p-4 text-center text-green-400">{s.gf || 0}</td>
                        <td className="p-4 text-center text-red-400">{s.ga || 0}</td>
                        <td className="p-4 text-center text-accent font-black">{s.points}</td>
                        <td className="p-4 text-right space-x-2 flex justify-end">
                          <button onClick={() => handleEdit(s)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {activeStandings.length === 0 && (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-gray-400 font-medium">Bu qrup üçün məlumat yoxdur.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
         </div>
      )}
    </div>
  );
}
