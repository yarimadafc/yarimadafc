export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';

export default async function StandingsPage(props: { searchParams: Promise<{ tournament_id?: string }> }) {
  const searchParams = await props.searchParams;
  let tournaments: any[] = [];
  let standings: any[] = [];

  try {
    const tourRes = await supabase.from('tournaments').select('*').order('created_at', { ascending: false });
    if (tourRes.data) tournaments = tourRes.data;

    let q = supabase.from('standings').select('*');
    if (searchParams.tournament_id) {
      q = q.eq('tournament_id', searchParams.tournament_id);
    } else if (tournaments.length > 0) {
      q = q.eq('tournament_id', tournaments[0].id);
    }
    const stanRes = await q.order('points', { ascending: false }).order('goal_difference', { ascending: false });
    if (stanRes.data) standings = stanRes.data;
  } catch (error) {
    console.error('Error fetching standings:', error);
  }

  if (standings.length === 0) {
    standings = [
      { team_name: 'Sabah U-12',        played: 10, won: 8, drawn: 1, lost: 1, goals_for: 25, goals_against: 8,  goal_difference: 17,  points: 25 },
      { team_name: 'Yarımada FK U-12',  played: 10, won: 7, drawn: 2, lost: 1, goals_for: 22, goals_against: 10, goal_difference: 12,  points: 23, is_yarimada: true },
      { team_name: 'Qarabağ U-12',      played: 10, won: 6, drawn: 3, lost: 1, goals_for: 18, goals_against: 9,  goal_difference: 9,   points: 21 },
      { team_name: 'Neftçi U-12',       played: 10, won: 5, drawn: 2, lost: 3, goals_for: 15, goals_against: 12, goal_difference: 3,   points: 17 },
      { team_name: 'Zirə U-12',         played: 10, won: 3, drawn: 4, lost: 3, goals_for: 12, goals_against: 14, goal_difference: -2,  points: 13 },
      { team_name: 'Turan Tovuz U-12',  played: 10, won: 2, drawn: 2, lost: 6, goals_for: 8,  goals_against: 20, goal_difference: -12, points: 8  },
      { team_name: 'Kəpəz U-12',        played: 10, won: 1, drawn: 3, lost: 6, goals_for: 6,  goals_against: 18, goal_difference: -12, points: 6  },
      { team_name: 'Araz Naxçıvan U-12',played: 10, won: 0, drawn: 1, lost: 9, goals_for: 3,  goals_against: 28, goal_difference: -25, points: 1  },
    ];
  }

  const colHead = 'px-3 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest text-center';
  const colCell = 'px-3 py-4 text-sm font-mono text-center';

  return (
    <main className="flex-grow bg-[var(--bg)] text-[var(--text)] pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">

      {/* HERO */}
      <div className="relative rounded-[2rem] overflow-hidden min-h-[15vh] flex flex-col justify-end p-6 md:p-10 bg-[var(--surface-2)] mb-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--surface-2)] via-[#0d2040] to-[#1a3a6b] z-0" />
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 70% 50%, #c9a84c 0%, transparent 60%)'}} />
        <div className="relative z-10">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-3 font-bold">STATİSTİKA</p>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-display uppercase text-white leading-[0.85]">
              TURNİR CƏDVƏLİ
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* TOURNAMENT FILTER */}
      {tournaments.length > 0 && (
        <FadeIn delay={0.05}>
          <div className="flex flex-wrap gap-3 mb-8">
            {tournaments.map((tour) => {
              const isActive = searchParams.tournament_id
                ? tour.id === searchParams.tournament_id
                : tour.id === tournaments[0].id;
              return (
                <a
                  key={tour.id}
                  href={`/turnir-cedveli?tournament_id=${tour.id}`}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                    isActive
                      ? 'bg-[var(--surface-2)] text-white border-[var(--surface-2)]'
                      : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--surface-2)] hover:text-[var(--surface-2)]'
                  }`}
                >
                  {tour.name}
                </a>
              );
            })}
          </div>
        </FadeIn>
      )}

      {/* LEGEND */}
      <FadeIn delay={0.1}>
        <div className="flex gap-4 mb-4 text-xs text-[var(--text-muted)] font-mono">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[var(--accent)]/30 border-l-2 border-[var(--accent)] inline-block"></span>Yarımada FK</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-50 border border-green-200 inline-block"></span>Playoff zonası</span>
        </div>
      </FadeIn>

      {/* TABLE */}
      <FadeIn delay={0.15}>
        <div className="rounded-[1.5rem] overflow-hidden shadow-xl shadow-black/5 border border-[var(--border)]">
          {/* Header */}
          <div className="bg-[var(--surface-2)] grid text-[var(--accent)]"
            style={{gridTemplateColumns:'3rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 3rem 3rem 3rem 3.5rem'}}>
            <div className={colHead}>#</div>
            <div className={`${colHead} text-left pl-4`}>Komanda</div>
            <div className={colHead} title="Oyunlar">O</div>
            <div className={colHead} title="Qələbə">Q</div>
            <div className={colHead} title="Heç-heçə">H</div>
            <div className={colHead} title="Məğlubiyyət">M</div>
            <div className={`${colHead} hidden sm:block`} title="Vurulan Qol">VQ</div>
            <div className={`${colHead} hidden md:block`} title="Buraxılan Qol">BQ</div>
            <div className={`${colHead} hidden md:block`} title="Qol Fərqi">+/-</div>
            <div className={`${colHead} text-white`} title="Xal">X</div>
          </div>

          {/* Rows */}
          {standings.map((team, idx) => {
            const isYarimada = team.is_yarimada || team.team_name?.includes('Yarımada');
            const isTop3 = idx < 3;
            const diff = team.goal_difference ?? (team.goals_for - team.goals_against);

            return (
              <div
                key={idx}
                className={`grid items-center border-b border-[var(--border)] transition-all duration-200 group
                  ${isYarimada
                    ? 'bg-[var(--accent)]/10 border-l-4 border-l-[var(--accent)] hover:bg-[var(--accent)]/20'
                    : isTop3
                    ? 'bg-green-50/60 hover:bg-green-50'
                    : 'bg-[var(--surface)] hover:bg-[var(--surface-2)]'
                  }`}
                style={{gridTemplateColumns:'3rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 3rem 3rem 3rem 3.5rem'}}
              >
                {/* Rank */}
                <div className="px-3 py-4 text-center">
                  {idx === 0 ? <span className="text-lg">🥇</span>
                   : idx === 1 ? <span className="text-lg">🥈</span>
                   : idx === 2 ? <span className="text-lg">🥉</span>
                   : <span className="text-sm font-black text-gray-300">{idx + 1}</span>}
                </div>

                {/* Team name */}
                <div className="pl-4 py-4 flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0
                    ${isYarimada ? 'bg-[var(--accent)] text-[var(--surface-2)]' : 'bg-[var(--surface-2)] text-[var(--text-muted)]'}`}>
                    {team.team_name?.charAt(0)}
                  </div>
                  <span className={`font-bold text-sm truncate ${isYarimada ? 'text-[var(--surface-2)]' : 'text-[var(--text)]'}`}>
                    {team.team_name}
                  </span>
                  {isYarimada && <span className="ml-1 text-[9px] font-black bg-[var(--accent)] text-[var(--surface-2)] px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">Biz</span>}
                </div>

                <div className={colCell}>{team.played}</div>
                <div className={`${colCell} font-bold text-green-600`}>{team.won}</div>
                <div className={`${colCell} text-[var(--text-muted)]`}>{team.drawn}</div>
                <div className={`${colCell} text-red-400`}>{team.lost}</div>
                <div className={`${colCell} hidden sm:block`}>{team.goals_for}</div>
                <div className={`${colCell} hidden md:block text-[var(--text-muted)]`}>{team.goals_against}</div>
                <div className={`${colCell} hidden md:block font-bold ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
                  {diff > 0 ? `+${diff}` : diff}
                </div>
                {/* Points */}
                <div className="px-3 py-4 text-center">
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-black text-base
                    ${isYarimada ? 'bg-[var(--accent)] text-[var(--surface-2)]' : isTop3 ? 'bg-[var(--surface-2)] text-white' : 'bg-[var(--surface-2)] text-[var(--text)]'}`}>
                    {team.points}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>

      {/* COLUMN LEGEND */}
      <FadeIn delay={0.2}>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[var(--text-muted)] font-mono">
          {[['O','Oyunlar'],['Q','Qələbə'],['H','Heç-heçə'],['M','Məğlubiyyət'],['VQ','Vurulan Qol'],['BQ','Buraxılan Qol'],['+/-','Qol Fərqi'],['X','Xal']].map(([k,v])=>(
            <span key={k}><b className="text-[var(--text-muted)]">{k}</b> = {v}</span>
          ))}
        </div>
      </FadeIn>

    </main>
  );
}
