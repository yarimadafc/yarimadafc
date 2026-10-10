'use client';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSyncVersion } from '@/lib/siteSync';
import TeamLogo from '@/components/TeamLogo';
import { formatShortDate } from '@/lib/matchUtils';
import { buildPlayerStats } from '@/lib/playerStats';
import { usePlayerStatsData } from '@/lib/usePlayerStats';

export default function PlayerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [photoBroken, setPhotoBroken] = useState(false);
  const { matches, playerList } = usePlayerStatsData();
  const stat = useMemo(() => {
    if (!player) return null;
    const all = buildPlayerStats(matches, {}, playerList);
    const lower = player.name.trim().toLocaleLowerCase('az');
    return all.find(s => s.playerId === player.id) || all.find(s => !s.playerId && s.name.trim().toLocaleLowerCase('az') === lower) || null;
  }, [matches, player, playerList]);

  const sync = useSyncVersion();
  useEffect(() => {
    async function fetchPlayer() {
      const { data } = await supabase.from('players').select('*, teams(name)').eq('id', id).single();
      if (data) setPlayer(data);
      setLoading(false);
    }
    fetchPlayer();
  }, [id, sync]);

  if (loading) return <div className="pt-header min-h-screen bg-bg-main flex justify-center text-accent">Yüklənir...</div>;
  if (!player) return <div className="pt-header min-h-screen bg-bg-main flex justify-center text-text-main">Oyunçu tapılmadı</div>;

  return (
    <div className="pt-header min-h-screen bg-bg-main pb-20">
      <div className="container">
        
        <div className="bg-bg-sec border border-bg-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
          {/* Background Number */}
          <div className="absolute top-0 right-10 text-[140px] font-black text-bg-deep opacity-30 select-none z-0 leading-none">
            {player.jersey_number || ''}
          </div>

          {/* Photo */}
          <div className="w-full md:w-2/5 lg:w-1/3 bg-bg-deep relative z-10 aspect-[3/4] md:aspect-auto">
            {player.image_url && !photoBroken ? (
              <img data-no-fallback src={player.image_url} alt={player.name} onError={() => setPhotoBroken(true)} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-32 h-32 text-text-sec" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-3/5 lg:w-2/3 p-8 md:p-12 relative z-10 flex flex-col justify-center">
            <div className="inline-block bg-accent text-bg-main px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              {player.teams?.name || 'Komanda'}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-text-main uppercase tracking-tighter mb-2">{player.name}</h1>
            <h2 className="text-lg md:text-xl font-bold text-accent uppercase tracking-widest mb-10">{player.position}</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Nömrə</div>
                <div className="text-text-main text-2xl font-black">{player.jersey_number || '-'}</div>
              </div>
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Təvəllüd</div>
                <div className="text-text-main text-xl font-bold mt-1">{player.birth_date ? new Date(player.birth_date).getFullYear() : '-'}</div>
              </div>
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Oyun</div>
                <div className="text-text-main text-2xl font-black">{stat?.games ?? 0}</div>
              </div>
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Qol</div>
                <div className="text-text-main text-2xl font-black">{stat?.goals ?? 0}</div>
              </div>
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Assist</div>
                <div className="text-text-main text-2xl font-black">{stat?.assists ?? 0}</div>
              </div>
              <div className="bg-bg-main border border-bg-border p-4 rounded-xl text-center">
                <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Dəqiqə</div>
                <div className="text-text-main text-2xl font-black">{stat?.minutes || '-'}</div>
              </div>
            </div>

          </div>
        </div>

        {stat && stat.matches.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl md:text-2xl font-extrabold text-text-main mb-4">Oyunlar üzrə statistika</h3>
            <div className="bg-bg-sec rounded-xl border border-bg-border overflow-hidden">
              <div className="grid grid-cols-[4.5rem_1fr_3.5rem_2.5rem_2.5rem_3rem] gap-2 px-4 py-3 text-[11px] uppercase tracking-wider text-text-sec">
                <span>Tarix</span><span>Rəqib</span><span className="text-center">Hesab</span><span className="text-center">Q</span><span className="text-center">A</span><span className="text-center">Dəq.</span>
              </div>
              {stat.matches.map(m => (
                <div key={m.matchId} className="grid grid-cols-[4.5rem_1fr_3.5rem_2.5rem_2.5rem_3rem] gap-2 items-center px-4 py-3 border-t border-bg-border text-sm">
                  <span className="text-text-sec text-xs">{formatShortDate(m.date) || '—'}</span>
                  <span className="flex items-center gap-2 min-w-0"><TeamLogo name={m.opponent} logo={m.opponentLogo} size={22} /><span className="truncate font-semibold">{m.opponent}</span></span>
                  <span className="text-center font-semibold tabular-nums">{m.score}</span>
                  <span className={`text-center tabular-nums ${m.goals ? 'font-extrabold' : 'text-text-sec'}`}>{m.goals || '–'}</span>
                  <span className={`text-center tabular-nums ${m.assists ? 'font-extrabold' : 'text-text-sec'}`}>{m.assists || '–'}</span>
                  <span className="text-center tabular-nums text-text-sec">{m.minutes || '–'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
