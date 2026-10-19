'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { openAdminTab } from '@/lib/adminDb';
import { sortTeams } from '@/lib/teamOrder';
import SquadStatsAdmin from './SquadStatsAdmin';

// The one place for player statistics: game numbers come from the match line-ups (Oyunlar), extra numbers
// (games before the site existed) are typed in per player here. Players themselves are added in Komandalar.
export default function PlayerStatsAdmin() {
  const [teams, setTeams] = useState<any[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('teams').select('*').then(({ data }) => {
      const list = sortTeams(data || []);
      setTeams(list);
      setTeamId(id => id ?? list[0]?.id ?? null);
    });
  }, []);

  async function fetchPlayers(id: string) {
    const { data } = await supabase.from('players').select('*').eq('team_id', id).order('jersey_number', { ascending: true });
    setPlayers(data || []);
  }

  useEffect(() => { if (teamId) fetchPlayers(teamId); }, [teamId]);

  const step = 'bg-gray-800 border border-gray-700 rounded-2xl p-4 flex gap-3';
  const num = 'shrink-0 w-7 h-7 rounded-full bg-accent text-on-accent flex items-center justify-center text-xs font-black';

  return (
    <div>
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Futbolçu Statistikası</h2>
        <p className="text-gray-400 text-sm max-w-3xl">Saytdakı «Statistika» səhifəsi, futbolçu profilləri və komanda səhifələri bu rəqəmlərdən hesablanır.</p>
      </div>

      {/* where the numbers come from */}
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <div className={step}>
          <span className={num}>1</span>
          <div className="text-sm">
            <p className="text-white font-bold">Hər oyunun rəqəmləri — avtomatik</p>
            <p className="text-gray-400 text-xs mt-1">«Oyunlar və nəticələr» bölməsində oyunun heyətində kimin oynadığını, qol, assist və dəqiqəni yazın. Burada heç nə yazmaq lazım deyil.</p>
            <button type="button" onClick={() => openAdminTab('matches')} className="mt-2 text-accent text-xs font-bold uppercase tracking-widest hover:underline">Oyunlara keç →</button>
          </div>
        </div>
        <div className={step}>
          <span className={num}>2</span>
          <div className="text-sm">
            <p className="text-white font-bold">Əlavə rəqəmlər — yalnız lazım olanda</p>
            <p className="text-gray-400 text-xs mt-1">Saytdan əvvəl oynanmış oyunlar üçün aşağıdakı cədvələ yazın; onlar oyunlardan gələn rəqəmlərin üzərinə əlavə olunur.</p>
            <button type="button" onClick={() => openAdminTab('teams')} className="mt-2 text-accent text-xs font-bold uppercase tracking-widest hover:underline">Yeni futbolçu: Komandalar →</button>
          </div>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="text-center text-gray-400 py-10 bg-gray-800 rounded-2xl border border-gray-700">Əvvəlcə «Komandalar» bölməsindən komanda yaradın.</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {teams.map(t => (
              <button key={t.id} onClick={() => setTeamId(t.id)} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest border transition-colors ${teamId === t.id ? 'bg-accent text-on-accent border-accent' : 'border-gray-700 text-gray-400 hover:text-white'}`}>
                {t.name}
              </button>
            ))}
          </div>
          {teamId && <SquadStatsAdmin teamId={teamId} players={players} onSaved={() => fetchPlayers(teamId)} />}
        </>
      )}
    </div>
  );
}
