export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

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

  // Mock data removed


  if (standings.length === 0) {
    standings = [
      { team_name: 'Sabah U-12', played: 10, won: 8, drawn: 1, lost: 1, goals_for: 25, goals_against: 8, goal_difference: 17, points: 25 },
      { team_name: 'Yarımada U-12', played: 10, won: 7, drawn: 2, lost: 1, goals_for: 22, goals_against: 10, goal_difference: 12, points: 23, is_yarimada: true },
      { team_name: 'Qarabağ U-12', played: 10, won: 6, drawn: 3, lost: 1, goals_for: 18, goals_against: 9, goal_difference: 9, points: 21 },
      { team_name: 'Neftçi U-12', played: 10, won: 5, drawn: 2, lost: 3, goals_for: 15, goals_against: 12, goal_difference: 3, points: 17 },
      { team_name: 'Zirə U-12', played: 10, won: 3, drawn: 4, lost: 3, goals_for: 12, goals_against: 14, goal_difference: -2, points: 13 },
      { team_name: 'Turan Tovuz U-12', played: 10, won: 2, drawn: 2, lost: 6, goals_for: 8, goals_against: 20, goal_difference: -12, points: 8 },
      { team_name: 'Kəpəz U-12', played: 10, won: 1, drawn: 3, lost: 6, goals_for: 6, goals_against: 18, goal_difference: -12, points: 6 },
      { team_name: 'Araz Naxçıvan U-12', played: 10, won: 0, drawn: 1, lost: 9, goals_for: 3, goals_against: 28, goal_difference: -25, points: 1 },
    ];
  }

  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)] pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      
      {/* 1. HERO SECTION */}
      <div className="relative rounded-[2rem] overflow-hidden min-h-[30vh] flex flex-col justify-end p-8 md:p-12 bg-[#0a1628] mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0" />
        <div className="relative z-10 max-w-4xl">
          <FadeIn>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">STATİSTİKA</p>
            <h1 className="text-6xl md:text-8xl font-black font-condensed uppercase tracking-normal text-white leading-[0.85] drop-shadow-xl">
              TURNİR CƏDVƏLİ
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* 2. FILTERS */}
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-4 mb-10">
          {tournaments.map((tour) => {
            const isActive = searchParams.tournament_id ? tour.id === searchParams.tournament_id : tour.id === tournaments[0].id;
            return (
              <a 
                key={tour.id}
                href={`/turnir-cedveli?tournament_id=${tour.id}`} 
                className={`ks-button !rounded-full !px-6 !py-3 font-bold text-sm transition-colors ${isActive ? '!bg-[var(--ks-ink)] !text-white' : '!bg-[var(--ks-paper-deep)] !text-gray-500 hover:!bg-gray-200 hover:!text-[var(--ks-ink)]'}`}
              >
                {tour.name}
              </a>
            );
          })}
        </div>
      </FadeIn>

      {/* 3. TABLE */}
      <FadeIn delay={0.2}>
        <div className="bg-[var(--ks-paper-deep)] rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#0a1628] text-[var(--ks-kinpaku)] font-mono text-xs uppercase tracking-widest">
                  <th className="p-6 font-bold w-16 text-center">#</th>
                  <th className="p-6 font-bold">Komanda</th>
                  <th className="p-6 font-bold text-center w-16" title="Oyun Sayı">O</th>
                  <th className="p-6 font-bold text-center w-16" title="Qələbə">Q</th>
                  <th className="p-6 font-bold text-center w-16" title="Heç-heçə">H</th>
                  <th className="p-6 font-bold text-center w-16" title="Məğlubiyyət">M</th>
                  <th className="p-6 font-bold text-center w-16" title="Vurulan Qol">VQ</th>
                  <th className="p-6 font-bold text-center w-16" title="Buraxılan Qol">BQ</th>
                  <th className="p-6 font-bold text-center w-16" title="Top Fərqi">+/-</th>
                  <th className="p-6 font-bold text-center w-20 text-white" title="Xal">X</th>
                </tr>
              </thead>
              <tbody className="text-[var(--ks-ink)]">
                {standings.map((team, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-gray-100 transition-colors ${team.is_yarimada || team.team_name.includes('Yarımada') ? 'bg-[var(--ks-kinpaku)]/10 border-l-4 border-l-[var(--ks-kinpaku)] hover:bg-[var(--ks-kinpaku)]/20' : 'hover:bg-gray-50'}`}
                  >
                    <td className="p-6 text-center font-black font-condensed text-xl text-gray-400">{idx + 1}</td>
                    <td className="p-6 font-bold text-lg">{team.team_name}</td>
                    <td className="p-6 text-center font-mono">{team.played}</td>
                    <td className="p-6 text-center font-mono">{team.won}</td>
                    <td className="p-6 text-center font-mono">{team.drawn}</td>
                    <td className="p-6 text-center font-mono">{team.lost}</td>
                    <td className="p-6 text-center font-mono">{team.goals_for}</td>
                    <td className="p-6 text-center font-mono">{team.goals_against}</td>
                    <td className="p-6 text-center font-mono font-bold text-gray-400">{team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}</td>
                    <td className="p-6 text-center font-black font-condensed text-2xl text-[var(--ks-ink)] bg-gray-50/50">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

    </main>
  );
}
