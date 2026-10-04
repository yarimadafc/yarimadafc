export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function MatchesPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || 'qarsidaki';
  
  let upcomingMatches: any[] = [];
  let completedMatches: any[] = [];

  try {
    const [upcomingRes, completedRes] = await Promise.all([
      supabase.from('matches').select('*').eq('status', 'upcoming').order('date', { ascending: true }),
      supabase.from('matches').select('*').eq('status', 'completed').order('date', { ascending: false })
    ]);

    if (upcomingRes.data) upcomingMatches = upcomingRes.data;
    if (completedRes.data) completedMatches = completedRes.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
  }

  // Mock data removed


  if (completedMatches.length === 0) {
    completedMatches = [
      { id: '3', home_team: 'Yarımada U-12', away_team: 'Neftçi U-12', home_score: 3, away_score: 1, date: '2026-10-05', stadium: 'ASK Arena', tournament: 'AFFA U-12 Liqası', status: 'completed' },
      { id: '4', home_team: 'Zirə U-10', away_team: 'Yarımada U-10', home_score: 0, away_score: 2, date: '2026-10-01', stadium: 'Zirə İdman Kompleksi', tournament: 'AFFA U-10 Liqası', status: 'completed' }
    ];
  }

  const currentMatches = activeTab === 'qarsidaki' ? upcomingMatches : completedMatches;

  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)]">
      
      {/* HERO */}
      <section className="pt-40 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[40vh] flex flex-col justify-end p-8 md:p-16 bg-[#0a1628]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0" />
          <div className="relative z-10 max-w-4xl">
            <FadeIn>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">MEYDANDA</p>
              <h1 className="text-7xl md:text-9xl font-black font-condensed uppercase tracking-normal text-white mb-6 leading-[0.85] drop-shadow-xl">
                OYUNLAR
              </h1>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex gap-4 mb-12">
            <Link 
              href="/oyunlar?tab=qarsidaki" 
              className={`ks-button !rounded-full !px-8 !py-4 font-bold text-lg transition-colors ${activeTab === 'qarsidaki' ? '!bg-[var(--ks-ink)] !text-white' : '!bg-gray-100 !text-gray-500 hover:!bg-gray-200 hover:!text-[var(--ks-ink)]'}`}
            >
              Qarşıdakı oyunlar
            </Link>
            <Link 
              href="/oyunlar?tab=kecmis" 
              className={`ks-button !rounded-full !px-8 !py-4 font-bold text-lg transition-colors ${activeTab === 'kecmis' ? '!bg-[var(--ks-ink)] !text-white' : '!bg-gray-100 !text-gray-500 hover:!bg-gray-200 hover:!text-[var(--ks-ink)]'}`}
            >
              Keçirilmiş oyunlar
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            {currentMatches.map((match) => (
              <Link key={match.id} href={`/oyunlar/${match.id}`} className="block group">
                <div className="bg-[var(--ks-paper-deep)] rounded-[2rem] p-8 md:p-10 hover:bg-[#0a1628] hover:text-white transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100 group-hover:border-[#0a1628]">
                  
                  {/* Info */}
                  <div className="flex flex-col text-center md:text-left w-full md:w-1/4">
                    <p className="text-[var(--ks-kinpaku)] font-mono text-sm uppercase tracking-widest font-bold mb-2">{new Date(match.date).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-gray-500 group-hover:text-gray-400 font-bold mb-1">{match.tournament}</p>
                    <p className="text-sm font-mono uppercase text-gray-400">{match.stadium}</p>
                    {activeTab === 'qarsidaki' && <p className="text-xl font-black mt-2">{match.time}</p>}
                  </div>

                  {/* Teams / Score */}
                  <div className="flex items-center justify-center gap-6 md:gap-12 w-full md:w-1/2">
                    <div className="flex-1 text-right">
                      <h3 className="text-2xl md:text-4xl font-black font-condensed uppercase">{match.home_team}</h3>
                    </div>
                    
                    {activeTab === 'kecmis' ? (
                      <div className="bg-[var(--ks-kinpaku)] text-[#0a1628] px-6 py-3 rounded-2xl flex gap-4 text-4xl font-black font-condensed">
                        <span>{match.home_score}</span>
                        <span>-</span>
                        <span>{match.away_score}</span>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-300 font-bold font-mono">VS</div>
                    )}

                    <div className="flex-1 text-left">
                      <h3 className="text-2xl md:text-4xl font-black font-condensed uppercase">{match.away_team}</h3>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="w-full md:w-1/4 flex justify-center md:justify-end">
                    <span className="ks-button !bg-white !text-[var(--ks-ink)] font-bold px-8 py-3 rounded-full shadow-sm group-hover:!bg-[var(--ks-kinpaku)] transition-colors uppercase tracking-widest text-xs">
                      Ətraflı &rarr;
                    </span>
                  </div>

                </div>
              </Link>
            ))}
            
            {currentMatches.length === 0 && (
              <div className="text-center py-20 text-gray-400 font-bold text-xl uppercase font-condensed tracking-widest">
                Bu bölmədə oyun yoxdur
              </div>
            )}
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
