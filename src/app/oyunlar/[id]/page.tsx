export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function MatchDetailPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ tab?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || 'hadiseler';
  
  let match: any = null;

  try {
    const res = await supabase.from('matches').select('*').eq('id', params.id).single();
    if (res.data) match = res.data;
  } catch (error) {
    console.error('Error fetching match:', error);
  }

  if (!match) {
    match = { 
      id: params.id, 
      home_team: 'Yarımada U-12', 
      away_team: 'Neftçi U-12', 
      home_score: 3, 
      away_score: 1, 
      date: '2026-10-05', 
      time: '15:00',
      stadium: 'ASK Arena', 
      tournament: 'AFFA U-12 Liqası', 
      status: 'completed',
      home_coach: 'Əhməd Məmmədov',
      away_coach: 'İlham Qasımov',
      report: 'Oyun olduqca gərgin keçdi. Komandamız ilk hissədə 2 qol vursa da, ikinci hissənin ortalarında qonaqlar fərqi azaltdı. Lakin son dəqiqələrdə vurulan gözəl qol yekun hesabı müəyyənləşdirdi.'
    };
  }

  // Mock events & lineups
  const goals = [
    { minute: 14, team: 'home', player: 'Vaqif Əliyev', assist: 'Nadir Quliyev', type: 'goal' },
    { minute: 32, team: 'home', player: 'Səməd Həsənov', assist: '', type: 'goal' },
    { minute: 65, team: 'away', player: 'Rəsul Rəsulov', assist: '', type: 'goal' },
    { minute: 88, team: 'home', player: 'Vaqif Əliyev', assist: 'Emil Kərimov', type: 'goal' },
  ];
  const cards = [
    { minute: 45, team: 'away', player: 'Elnur Məmmədov', type: 'yellow' },
    { minute: 72, team: 'home', player: 'Nadir Quliyev', type: 'yellow' }
  ];
  const events = [...goals, ...cards].sort((a, b) => a.minute - b.minute);

  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)] pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <Link href="/oyunlar" className="text-gray-500 hover:text-[var(--ks-ink)] font-bold flex items-center gap-2 transition-colors mb-8">
        &larr; Oyunlara qayıt
      </Link>

      {/* MATCH HEADER SCOREBOARD */}
      <FadeIn>
        <div className="bg-[#0a1628] rounded-[3rem] p-8 md:p-16 text-white flex flex-col items-center relative overflow-hidden shadow-2xl mb-12">
          {/* Subtle bg decorations */}
          <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-gradient-to-r from-[var(--ks-kinpaku)]/5 to-transparent blur-3xl transform -skew-x-12"></div>
          
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-2 font-bold">{match.tournament}</p>
          <p className="text-gray-400 font-mono mb-12 uppercase tracking-widest text-xs">
            {new Date(match.date).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' })} • {match.time} • {match.stadium}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 w-full">
            <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right">
              <h1 className="text-5xl md:text-7xl font-black font-condensed uppercase tracking-wide leading-none">{match.home_team}</h1>
              <p className="text-gray-500 font-mono mt-4 uppercase text-xs">Məşqçi: {match.home_coach}</p>
            </div>

            {match.status === 'completed' ? (
              <div className="shrink-0 flex items-center justify-center gap-6">
                <span className="text-7xl md:text-9xl font-black font-condensed text-[var(--ks-kinpaku)] leading-none">{match.home_score}</span>
                <span className="text-4xl text-gray-600 font-black">-</span>
                <span className="text-7xl md:text-9xl font-black font-condensed text-[var(--ks-kinpaku)] leading-none">{match.away_score}</span>
              </div>
            ) : (
              <div className="shrink-0 bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20">
                <span className="text-4xl font-black font-condensed text-white leading-none">VS</span>
              </div>
            )}

            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-black font-condensed uppercase tracking-wide leading-none">{match.away_team}</h1>
              <p className="text-gray-500 font-mono mt-4 uppercase text-xs">Məşqçi: {match.away_coach}</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* MATCH TABS */}
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-4 mb-10 border-b border-gray-200 pb-6">
          <Link href={`/oyunlar/${match.id}?tab=hadiseler`} className={`font-black font-condensed text-2xl uppercase tracking-widest transition-colors ${activeTab === 'hadiseler' ? 'text-[var(--ks-ink)] border-b-4 border-[var(--ks-kinpaku)] pb-2' : 'text-gray-400 hover:text-[var(--ks-ink)]'}`}>Hadisələr</Link>
          <Link href={`/oyunlar/${match.id}?tab=heyet`} className={`font-black font-condensed text-2xl uppercase tracking-widest transition-colors ${activeTab === 'heyet' ? 'text-[var(--ks-ink)] border-b-4 border-[var(--ks-kinpaku)] pb-2' : 'text-gray-400 hover:text-[var(--ks-ink)]'}`}>Heyət</Link>
          <Link href={`/oyunlar/${match.id}?tab=hesabat`} className={`font-black font-condensed text-2xl uppercase tracking-widest transition-colors ${activeTab === 'hesabat' ? 'text-[var(--ks-ink)] border-b-4 border-[var(--ks-kinpaku)] pb-2' : 'text-gray-400 hover:text-[var(--ks-ink)]'}`}>Hesabat</Link>
          <Link href={`/oyunlar/${match.id}?tab=media`} className={`font-black font-condensed text-2xl uppercase tracking-widest transition-colors ${activeTab === 'media' ? 'text-[var(--ks-ink)] border-b-4 border-[var(--ks-kinpaku)] pb-2' : 'text-gray-400 hover:text-[var(--ks-ink)]'}`}>Media</Link>
        </div>

        {/* TAB CONTENTS */}
        <div className="min-h-[400px]">
          
          {activeTab === 'hadiseler' && (
            <div className="max-w-3xl mx-auto py-8">
              {events.length > 0 ? (
                <div className="relative border-l-4 border-[var(--ks-kinpaku)]/30 ml-4 md:ml-1/2 md:-translate-x-1/2 space-y-12 py-4">
                  {events.map((ev, i) => (
                    <div key={i} className={`relative flex items-center ${ev.team === 'home' ? 'md:flex-row-reverse' : 'md:flex-row'} w-full md:w-[200%] md:-ml-[50%]`}>
                      <div className="absolute left-[-11px] md:left-1/2 md:-ml-[11px] w-6 h-6 rounded-full bg-white border-4 border-[var(--ks-ink)] z-10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[var(--ks-kinpaku)] rounded-full"></div>
                      </div>
                      <div className={`w-full md:w-1/2 ${ev.team === 'home' ? 'pl-8 md:pl-0 md:pr-12 text-left md:text-right' : 'pl-8 md:pr-0 md:pl-12 text-left'}`}>
                        <span className="font-black font-condensed text-4xl text-gray-300 mb-1 block">{ev.minute}'</span>
                        <div className="bg-[var(--ks-paper-deep)] p-6 rounded-2xl shadow-sm border border-gray-100">
                          {ev.type === 'goal' && (
                            <>
                              <p className="font-bold text-xl text-[var(--ks-ink)]">{(ev as any).player} ⚽</p>
                              {(ev as any).assist && <p className="text-sm font-mono text-gray-500 uppercase mt-2">Assist: {(ev as any).assist}</p>}
                            </>
                          )}
                          {ev.type === 'yellow' && (
                            <p className="font-bold text-lg text-[var(--ks-ink)]">{ev.player} <span className="inline-block w-3 h-4 bg-yellow-400 ml-2 rounded-sm border border-yellow-600"></span></p>
                          )}
                          {ev.type === 'red' && (
                            <p className="font-bold text-lg text-[var(--ks-ink)]">{ev.player} <span className="inline-block w-3 h-4 bg-red-600 ml-2 rounded-sm border border-red-800"></span></p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 font-bold">Oyun hadisələri daxil edilməyib.</div>
              )}
            </div>
          )}

          {activeTab === 'heyet' && (
            <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto py-8">
              <div className="flex-1 bg-[var(--ks-paper-deep)] rounded-[2rem] p-8 border border-gray-100">
                <h3 className="text-3xl font-black font-condensed uppercase mb-8 text-center border-b border-gray-200 pb-4">{match.home_team}</h3>
                <div className="space-y-4">
                  {/* Mock Players */}
                  {[9, 10, 4, 1, 7].map(num => (
                    <div key={num} className="flex items-center gap-4 border-b border-gray-100 pb-2">
                      <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-black font-condensed text-[var(--ks-ink)]">{num}</span>
                      <span className="font-bold text-lg">Futbolçu {num}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-[var(--ks-paper-deep)] rounded-[2rem] p-8 border border-gray-100">
                <h3 className="text-3xl font-black font-condensed uppercase mb-8 text-center border-b border-gray-200 pb-4">{match.away_team}</h3>
                <div className="space-y-4">
                  {[11, 8, 5, 2, 99].map(num => (
                    <div key={num} className="flex items-center gap-4 border-b border-gray-100 pb-2">
                      <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-black font-condensed text-[var(--ks-ink)]">{num}</span>
                      <span className="font-bold text-lg">Rəqib Futbolçu {num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hesabat' && (
            <div className="max-w-3xl mx-auto py-8">
              <h2 className="text-4xl font-black font-condensed uppercase mb-8 text-[var(--ks-ink)]">Oyunun Xülasəsi</h2>
              <div className="prose prose-xl text-[var(--ks-ink)]/80 leading-relaxed font-medium">
                <p>{match.report || 'Oyun haqqında hesabat daxil edilməyib.'}</p>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="max-w-5xl mx-auto py-8">
              <div className="aspect-video bg-[#0a1628] rounded-[2rem] flex items-center justify-center border-8 border-[var(--ks-paper-deep)] shadow-lg relative group cursor-pointer mb-8">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
                </div>
              </div>
              <p className="text-center text-gray-500 font-bold uppercase tracking-widest text-sm font-mono">Qolların xülasəsi tezliklə yüklənəcək</p>
            </div>
          )}

        </div>
      </FadeIn>
    </main>
  );
}
