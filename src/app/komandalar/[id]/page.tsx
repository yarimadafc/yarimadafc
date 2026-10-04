export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function TeamDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let team: any = null;
  let players: any[] = [];
  let coaches: any[] = [];
  let matches: any[] = [];

  try {
    // Parallel fetch
    const [teamRes, playersRes, coachesRes, matchesRes] = await Promise.all([
      supabase.from('teams').select('*').eq('id', params.id).single(),
      supabase.from('players').select('*').eq('team_id', params.id),
      supabase.from('coaches').select('*').eq('team_id', params.id),
      supabase.from('matches').select('*').or(`home_team_id.eq.${params.id},away_team_id.eq.${params.id}`).order('date', { ascending: false }).limit(5)
    ]);

    if (teamRes.data) team = teamRes.data;
    if (playersRes.data) players = playersRes.data;
    if (coachesRes.data) coaches = coachesRes.data;
    if (matchesRes.data) matches = matchesRes.data;
  } catch (error) {
    console.error('Error fetching team details:', error);
  }

  // Mock data removed


  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)]">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[50vh] flex flex-col justify-end p-8 md:p-16 bg-[#0a1628]">
          <Link href="/komandalar" className="absolute top-8 left-8 text-white/50 hover:text-white font-bold flex items-center gap-2 transition-colors z-20">
            &larr; Bütün komandalar
          </Link>
          <div className="relative z-10 max-w-4xl">
            <FadeIn>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-[var(--ks-kinpaku)] text-[#0a1628] font-black text-xl px-4 py-1 rounded-full">{team.age_group}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black font-condensed uppercase tracking-normal text-white mb-6 leading-[0.85]">
                {team.name}
              </h1>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT (GRID) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Players */}
          <div className="flex-1">
            <FadeIn>
              <h2 className="text-4xl font-black font-condensed uppercase mb-8">FUTBOLÇULAR</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {players.map((player) => (
                  <Link key={player.id} href={`/futbolcular/${player.id}`} className="bg-[var(--ks-paper-deep)] rounded-[2rem] p-6 flex items-center gap-6 group hover:bg-[#0a1628] hover:text-white transition-colors">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0 border-2 border-transparent group-hover:border-[var(--ks-kinpaku)]">
                      {player.photo_url ? (
                        <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#0a1628]/10 flex items-center justify-center">
                          <span className="font-bold text-gray-400 text-xl">{player.jersey_number}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{player.name}</h3>
                      <p className="text-sm font-mono uppercase text-gray-500 group-hover:text-gray-400">{player.position}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* RIGHT COLUMN: Sidebar (Coaches, Schedule, Stats) */}
          <div className="w-full lg:w-96 flex flex-col gap-8 shrink-0">
            <FadeIn delay={0.1}>
              <div className="bg-[var(--ks-paper-deep)] rounded-[2rem] p-8">
                <h3 className="text-2xl font-black font-condensed uppercase mb-6">MƏŞQÇİLƏR</h3>
                <div className="flex flex-col gap-4">
                  {coaches.map((coach) => (
                    <Link key={coach.id} href={`/mesqciler/${coach.id}`} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                        {coach.photo_url && <img src={coach.photo_url} alt={coach.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-bold group-hover:text-[var(--ks-kinpaku-rich)] transition-colors">{coach.name}</p>
                        <p className="text-xs font-mono text-gray-500 uppercase">{coach.role}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-[#0a1628] text-white rounded-[2rem] p-8">
                <h3 className="text-2xl font-black font-condensed uppercase mb-6 text-[var(--ks-kinpaku)]">MƏŞQ CƏDVƏLİ</h3>
                <ul className="space-y-4 font-mono text-sm">
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Çərşənbə axşamı</span>
                    <span className="font-bold">18:00</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Cümə axşamı</span>
                    <span className="font-bold">18:00</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Şənbə</span>
                    <span className="font-bold">10:00</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

    </main>
  );
}
