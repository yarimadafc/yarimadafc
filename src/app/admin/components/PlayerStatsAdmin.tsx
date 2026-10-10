'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb, toast } from '@/lib/adminDb';
import { Plus } from 'lucide-react';
import { sortTeams } from '@/lib/teamOrder';
import { MANUAL_STAT_FIELDS, type ManualStatField } from '@/lib/playerStats';
import SquadStatsAdmin, { STAT_LABELS } from './SquadStatsAdmin';

const EMPTY_STATS = Object.fromEntries(MANUAL_STAT_FIELDS.map(f => [f, ''])) as Record<ManualStatField, string>;

// One place for player statistics: choose a team, add players (name, number, position and their numbers
// in one go) and edit everyone's numbers. Players added here are the same players as in Komandalar.
export default function PlayerStatsAdmin() {
  const [teams, setTeams] = useState<any[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [position, setPosition] = useState('');
  const [stats, setStats] = useState(EMPTY_STATS);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    supabase.from('teams').select('*').then(({ data }) => {
      const list = sortTeams(data || []);
      setTeams(list);
      setTeamId(id => id ?? list[0]?.id ?? null);
    });
  }, []);

  const fetchPlayers = async (id: string) => {
    const { data } = await supabase.from('players').select('*').eq('team_id', id).order('jersey_number', { ascending: true });
    setPlayers(data || []);
  };

  useEffect(() => { if (teamId) fetchPlayers(teamId); }, [teamId]);

  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !name.trim()) return toast('error', 'Futbolçunun adını yazın');
    setAdding(true);
    const { error } = await adminDb.from('players').insert([{
      team_id: teamId,
      name: name.trim(),
      jersey_number: parseInt(number) || null,
      position: position.trim() || null,
      ...Object.fromEntries(MANUAL_STAT_FIELDS.map(f => [f, Math.max(0, parseInt(stats[f]) || 0)])),
    }]);
    setAdding(false);
    if (error) return;
    setName(''); setNumber(''); setPosition(''); setStats(EMPTY_STATS);
    fetchPlayers(teamId);
  };

  const removePlayer = async (id: string) => {
    if (!confirm('Futbolçunu silmək istədiyinizə əminsiniz? (Komandalar bölməsindən də silinəcək)')) return;
    const { error } = await adminDb.from('players').delete().eq('id', id);
    if (!error && teamId) fetchPlayers(teamId);
  };

  const input = 'w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-accent outline-none';

  return (
    <div>
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Futbolçu Statistikası</h2>
        <p className="text-gray-400 text-sm max-w-3xl">
          Komandanı seçin, futbolçunu əlavə edin və oyun / qol / assist rəqəmlərini yazın. Saytda «Statistika» səhifəsində,
          futbolçu profilində və komanda səhifəsində dərhal görünür. Oyunlara heyət daxil etdikdə həmin oyunların rəqəmləri avtomatik üstünə gəlir.
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center text-gray-400 py-10 bg-gray-800 rounded-2xl border border-gray-700">Əvvəlcə «Komandalar» bölməsindən komanda yaradın.</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {teams.map(t => (
              <button key={t.id} onClick={() => setTeamId(t.id)} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest border transition-colors ${teamId === t.id ? 'bg-accent text-on-accent border-accent' : 'border-gray-700 text-gray-400 hover:text-white'}`}>
                {t.name}
              </button>
            ))}
          </div>

          <form onSubmit={addPlayer} className="bg-gray-800 border border-accent/30 rounded-2xl p-5 mb-2">
            <h3 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Futbolçu Əlavə Et</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ad Soyad *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className={input} required />
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Nömrə</label>
                <input type="number" value={number} onChange={e => setNumber(e.target.value)} className={input} />
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Mövqe</label>
                <input type="text" value={position} onChange={e => setPosition(e.target.value)} placeholder="Məs: Hücumçu" className={input} />
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-4">
              {MANUAL_STAT_FIELDS.map(f => (
                <div key={f}>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{STAT_LABELS[f]}</label>
                  <input type="number" min={0} value={stats[f]} placeholder="0" onChange={e => setStats(s => ({ ...s, [f]: e.target.value }))} className={`${input} text-center`} />
                </div>
              ))}
            </div>
            <button type="submit" disabled={adding} className="bg-accent text-on-accent px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2 disabled:opacity-60">
              <Plus className="w-4 h-4" /> <span>{adding ? 'Əlavə olunur...' : 'Əlavə Et'}</span>
            </button>
          </form>

          {teamId && <SquadStatsAdmin teamId={teamId} players={players} onSaved={() => fetchPlayers(teamId)} onDelete={removePlayer} />}
        </>
      )}
    </div>
  );
}
