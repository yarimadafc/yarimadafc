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

  // Mock data if not found
  if (!player) {
    player = {
      id: params.id,
      name: 'Vaqif Əliyev',
      birth_date: '2014-05-12',
      position: 'Hücumçu',
      jersey_number: 9,
      height: '145 sm',
      started_date: '2023',
      stats: {
        games_played: 24,
        games_started: 20,
        goals: 18,
        assists: 7,
        yellow_cards: 2,
        red_cards: 0
      }
    };
    team = { id: '1', name: 'Yarımada U-12' };
  }

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
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)] pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <Link href={team ? `/komandalar/${team.id}` : "/komandalar"} className="text-gray-500 hover:text-[var(--ks-ink)] font-bold flex items-center gap-2 transition-colors mb-8">
        &larr; Komandaya qayıt
      </Link>
      
      <FadeIn>
        <div className="bg-[var(--ks-paper-deep)] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-sm">
          {/* Player Photo Section */}
          <div className="w-full md:w-1/3 bg-[#0a1628] p-12 flex flex-col items-center justify-center relative">
            <div className="absolute top-4 right-4 text-[var(--ks-kinpaku)]/20 font-condensed font-black text-9xl">{player.jersey_number}</div>
            <div className="w-48 h-48 rounded-full bg-white/10 border-4 border-[var(--ks-kinpaku)] overflow-hidden relative z-10 mb-6">
              {player.photo_url ? (
                <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-5xl font-bold">{player.jersey_number}</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl font-black font-condensed uppercase text-white text-center relative z-10 mb-2">{player.name}</h1>
            <p className="text-[var(--ks-kinpaku)] font-mono uppercase tracking-widest text-sm relative z-10">{player.position}</p>
          </div>

          {/* Player Info & Stats Section */}
          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-2xl font-black font-condensed uppercase mb-6 text-gray-400">FUTBOLÇU MƏLUMATLARI</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase mb-1">Komanda</p>
                <p className="font-bold">{team?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase mb-1">Doğum tarixi</p>
                <p className="font-bold">{player.birth_date ? new Date(player.birth_date).toLocaleDateString('az-AZ') : '-'}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase mb-1">Yaş</p>
                <p className="font-bold">{age}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase mb-1">Boy</p>
                <p className="font-bold">{player.height || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase mb-1">Akademiyaya Qoşulub</p>
                <p className="font-bold">{player.started_date || '-'}</p>
              </div>
            </div>

            <h2 className="text-2xl font-black font-condensed uppercase mb-6 text-gray-400">STATİSTİKALAR (MÖVSÜM)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-condensed text-[var(--ks-ink)]">{stats.games_played}</span>
                <span className="text-[10px] font-mono text-gray-500 uppercase mt-1">Oyun Sayı</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-condensed text-[var(--ks-ink)]">{stats.games_started}</span>
                <span className="text-[10px] font-mono text-gray-500 uppercase mt-1">Start Heyət</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[var(--ks-kinpaku)] flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-condensed text-[var(--ks-kinpaku-deep)]">{stats.goals}</span>
                <span className="text-[10px] font-mono text-[var(--ks-kinpaku-deep)] uppercase mt-1">Qol</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[var(--ks-kinpaku)]/30 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-condensed text-[var(--ks-kinpaku-rich)]">{stats.assists}</span>
                <span className="text-[10px] font-mono text-[var(--ks-kinpaku-rich)] uppercase mt-1">Assist</span>
              </div>
              <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-condensed text-yellow-600">{stats.yellow_cards}</span>
                <span className="text-[10px] font-mono text-yellow-600 uppercase mt-1">Sarı Kart</span>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-200 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-condensed text-red-600">{stats.red_cards}</span>
                <span className="text-[10px] font-mono text-red-600 uppercase mt-1">Qırmızı Kart</span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
