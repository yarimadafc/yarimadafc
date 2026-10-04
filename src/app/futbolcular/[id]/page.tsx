export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function PlayerProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let player: any = null;
  let team: any = null;

  try {
    const playerRes = await supabase.from('players').select('*').eq('id', params.id).single();
    if (playerRes.data) {
      player = playerRes.data;
      if (player.team_id) {
        const teamRes = await supabase.from('teams').select('*').eq('id', player.team_id).single();
        if (teamRes.data) team = teamRes.data;
      }
    }
  } catch (error) {
    console.error('Error fetching player details:', error);
  }

  // Mock data removed


  const calculateAge = (dob: string) => {
    if (!dob) return '-';
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(player.birth_date);
  const stats = player.stats || {
    games_played: 0, games_started: 0, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0
  };

  return (
    <main className="flex-grow bg-[var(--bg)] text-[var(--text)] pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <Link href={team ? `/komandalar/${team.id}` : "/komandalar"} className="text-[var(--text-muted)] hover:text-[var(--text)] font-bold flex items-center gap-2 transition-colors mb-8">
        &larr; Komandaya qayıt
      </Link>
      
      <FadeIn>
        <div className="bg-[var(--ks-paper-deep)] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-sm">
          {/* Player Photo Section */}
          <div className="w-full md:w-1/3 bg-[var(--surface-2)] p-12 flex flex-col items-center justify-center relative">
            <div className="absolute top-4 right-4 text-[var(--accent)]/20 font-display font-black text-9xl">{player.jersey_number}</div>
            <div className="w-48 h-48 rounded-full bg-[var(--surface)]/10 border-4 border-[var(--accent)] overflow-hidden relative z-10 mb-6">
              {player.photo_url ? (
                <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-5xl font-bold">{player.jersey_number}</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl font-black font-display uppercase text-white text-center relative z-10 mb-2">{player.name}</h1>
            <p className="text-[var(--accent)] font-mono uppercase tracking-widest text-sm relative z-10">{player.position}</p>
          </div>

          {/* Player Info & Stats Section */}
          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-2xl font-black font-display uppercase mb-6 text-[var(--text-muted)]">FUTBOLÇU MƏLUMATLARI</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              <div>
                <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-1">Komanda</p>
                <p className="font-bold">{team?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-1">Doğum tarixi</p>
                <p className="font-bold">{player.birth_date ? new Date(player.birth_date).toLocaleDateString('az-AZ') : '-'}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-1">Yaş</p>
                <p className="font-bold">{age}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-1">Boy</p>
                <p className="font-bold">{player.height || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-1">Akademiyaya Qoşulub</p>
                <p className="font-bold">{player.started_date || '-'}</p>
              </div>
            </div>

            <h2 className="text-2xl font-black font-display uppercase mb-6 text-[var(--text-muted)]">STATİSTİKALAR (MÖVSÜM)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-display text-[var(--text)]">{stats.games_played}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase mt-1">Oyun Sayı</span>
              </div>
              <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-display text-[var(--text)]">{stats.games_started}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase mt-1">Start Heyət</span>
              </div>
              <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--accent)] flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-display text-[var(--accent-deep)]">{stats.goals}</span>
                <span className="text-[10px] font-mono text-[var(--accent-deep)] uppercase mt-1">Qol</span>
              </div>
              <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--accent)]/30 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-display text-[var(--accent)]">{stats.assists}</span>
                <span className="text-[10px] font-mono text-[var(--accent)] uppercase mt-1">Assist</span>
              </div>
              <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-display text-yellow-600">{stats.yellow_cards}</span>
                <span className="text-[10px] font-mono text-yellow-600 uppercase mt-1">Sarı Kart</span>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-200 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-display text-red-600">{stats.red_cards}</span>
                <span className="text-[10px] font-mono text-red-600 uppercase mt-1">Qırmızı Kart</span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
