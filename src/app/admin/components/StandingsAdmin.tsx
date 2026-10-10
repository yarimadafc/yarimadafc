'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb } from '@/lib/adminDb';
import { uploadFromInput } from '@/lib/uploadImage';
import { LOGO_PREFIX, normalizeTeamName, teamLogoKey } from '@/lib/teamLogos';
import { Plus, Trash2, Edit2, ChevronRight, ArrowLeft, UploadCloud } from 'lucide-react';
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
  const [logoUrl, setLogoUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logos, setLogos] = useState<Record<string, string>>({});
  const logoOf = (name: string) => logos[normalizeTeamName(name)] || '';
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
    fetchLogos();
  }, []);

  // team logos from the shared registry (also filled automatically by match logo uploads)
  const fetchLogos = async () => {
    const [{ data: reg }, { data: mt }] = await Promise.all([
      supabase.from('site_images').select('section_key, image_url').like('section_key', `${LOGO_PREFIX}%`),
      supabase.from('matches').select('home_team, home_logo, away_team, away_logo'),
    ]);
    const map: Record<string, string> = {};
    (mt || []).forEach((m: any) => {
      if (m.home_logo) map[normalizeTeamName(m.home_team)] = m.home_logo;
      if (m.away_logo) map[normalizeTeamName(m.away_team)] = m.away_logo;
    });
    (reg || []).forEach((r: any) => { if (r.image_url) map[r.section_key.slice(LOGO_PREFIX.length)] = r.image_url; });
    setLogos(map);
  };

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
    setLogoUrl(logoOf(s.team_name));
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

    if (saving || uploadingLogo) return;
    setSaving(true);
    const { error } = editingId
      ? await adminDb.from('standings').update(payload).eq('id', editingId)
      : await adminDb.from('standings').insert([payload]);
    if (!error && logoUrl !== logoOf(teamName)) {
      await adminDb.from('site_images').upsert({ section_key: teamLogoKey(teamName), image_url: logoUrl }, { onConflict: 'section_key' }).silent();
      setLogos(prev => ({ ...prev, [normalizeTeamName(teamName)]: logoUrl }));
    }
    setSaving(false);
    if (error) return;

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
    setTeamName(''); setLogoUrl(''); setPlayed(0); setWon(0); setDrawn(0); setLost(0); setPoints(0);
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
                <div className="col-span-2 md:col-span-3">
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Adı</label>
                  <input type="text" value={teamName} onChange={e => { setTeamName(e.target.value); if (!logoUrl) setLogoUrl(logoOf(e.target.value)); }} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Loqosu</label>
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      <span className="relative group w-12 h-12 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                        <img src={logoUrl} alt="" className="w-[70%] h-[70%] object-contain" />
                        <button type="button" onClick={() => setLogoUrl('')} className="absolute inset-0 bg-red-500/80 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">SİL</button>
                      </span>
                    ) : null}
                    <label className={`flex-1 flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-accent transition-colors ${uploadingLogo ? 'opacity-50' : ''}`}>
                      <UploadCloud className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-[10px] font-bold uppercase">{uploadingLogo ? 'Yüklənir...' : logoUrl ? 'Dəyiş' : 'Seç'}</span>
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingLogo} onChange={async e => {
                        setUploadingLogo(true);
                        const url = await uploadFromInput(e);
                        if (url) setLogoUrl(url);
                        setUploadingLogo(false);
                      }} />
                    </label>
                  </div>
                </div>
                <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Oyun (Avto)</label><input type="number" value={played} readOnly className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-gray-400 cursor-not-allowed" /></div>
                <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qələbə</label><input type="number" value={won} onChange={e => recalc(Number(e.target.value), drawn, lost)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Heç-Heçə</label><input type="number" value={drawn} onChange={e => recalc(won, Number(e.target.value), lost)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məğlubiyyət</label><input type="number" value={lost} onChange={e => recalc(won, drawn, Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div className="col-span-2"><label className="block text-green-400 text-xs font-bold uppercase mb-2">Vurduğu Qol (VQ)</label><input type="number" value={gf} onChange={e => setGf(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div className="col-span-2"><label className="block text-red-400 text-xs font-bold uppercase mb-2">Buraxdığı Top (BT)</label><input type="number" value={ga} onChange={e => setGa(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                <div className="col-span-2 md:col-span-4"><label className="block text-accent text-xs font-bold uppercase mb-2">Xal (Avto)</label><input type="number" value={points} readOnly className="w-full bg-gray-900/50 border border-accent/50 rounded-lg p-3 text-accent font-black cursor-not-allowed" /></div>
                <div className="col-span-2 md:col-span-4 mt-2">
                   <button type="submit" disabled={saving || uploadingLogo} className="w-full bg-accent text-on-accent py-3 rounded-lg font-bold text-xs uppercase tracking-widest disabled:opacity-60">{saving ? 'Saxlanılır...' : uploadingLogo ? 'Loqo yüklənir...' : 'Yadda Saxla'}</button>
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
                          <span className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                              {logoOf(s.team_name) ? <img src={logoOf(s.team_name)} alt="" className="w-[70%] h-[70%] object-contain" /> : s.team_name.includes('Yarımada') ? <img src="/Logo.JPG.jpeg" alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-500 font-black uppercase">{s.team_name.slice(0, 2)}</span>}
                            </span>
                            <span className={s.team_name.includes('Yarımada') ? 'text-accent' : 'text-white'}>{s.team_name}</span>
                          </span>
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
