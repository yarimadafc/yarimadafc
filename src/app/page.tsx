export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function Home() {
  let matches: any[] = [];
  let news: any[] = [];
  let teams: any[] = [];

  try {
    const matchRes = await supabase.from('matches').select('*').order('date', { ascending: false }).limit(2);
    if (matchRes.data) matches = matchRes.data;

    const newsRes = await supabase.from('news').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3);
    if (newsRes.data) news = newsRes.data;

    const teamsRes = await supabase.from('teams').select('*').limit(4);
    if (teamsRes.data) teams = teamsRes.data;
  } catch (error) {
    console.error('Home page fetch error', error);
  }

  const nextMatch = matches.find(m => m.status === 'upcoming');
  const lastMatch = matches.find(m => m.status === 'completed');

  return (
    <main className="flex-grow bg-[#f8fafc]">
      {/* 1. HERO SECTION - Full Screen, simple transparent header overlaps this */}
      <section className="relative w-full h-screen bg-[#0a1628] flex items-center justify-center overflow-hidden">
        {/* Placeholder image that covers everything */}
        <div className="absolute inset-0 z-0">
           <div className="w-full h-full bg-[#0a1628] flex items-center justify-center">
              <span className="text-white/5 text-[15rem] font-black uppercase tracking-tighter transform -rotate-12 select-none">YARIMADA</span>
           </div>
        </div>
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent z-10" />

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
          <FadeIn delay={0.2}>
            <p className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-6">2026/27 Mövsüm</p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white uppercase tracking-tighter mb-8 leading-none drop-shadow-lg">
              Bu Yarımada FK.
            </h1>
          </FadeIn>
          <FadeIn delay={0.6}>
            <p className="text-gray-300 text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
              Gələcəyin çempionları burada yetişir. Böyük bir ailənin parçası ol.
            </p>
          </FadeIn>
          <FadeIn delay={0.8} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/qeydiyyat" className="px-10 py-4 bg-[#c9a84c] text-[#0a1628] rounded-full font-bold uppercase tracking-widest hover:bg-[#b39542] transition-colors text-sm">
              Akademiyaya Qoşul
            </Link>
            <Link href="/komandalar" className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-[#0a1628] transition-colors text-sm">
              Komandalar
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 2. MATCH DASHBOARD (Only show if matches exist) */}
      {(nextMatch || lastMatch) && (
        <section className="relative z-30 -mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
          <FadeIn className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-12">
            
            {nextMatch && (
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-[#c9a84c]/10 text-[#c9a84c] font-mono text-sm uppercase tracking-widest rounded-full mb-6">
                  Növbəti Oyun
                </div>
                <h3 className="text-3xl font-black text-[#0a1628] uppercase tracking-wide mb-2">
                  {nextMatch.home_team} - {nextMatch.away_team}
                </h3>
                <p className="text-gray-500 font-mono mb-6">
                  {new Date(nextMatch.date).toLocaleDateString('az-AZ')} • {nextMatch.time || '18:00'} • {nextMatch.stadium || 'Ev stadionu'}
                </p>
                <Link href={`/oyunlar/${nextMatch.id}`} className="text-[#c9a84c] font-bold uppercase tracking-wider text-sm hover:underline">
                  Ətraflı &rarr;
                </Link>
              </div>
            )}

            {lastMatch && (
              <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-12">
                <div className="inline-block px-3 py-1 bg-[#0a1628]/5 text-[#0a1628] font-mono text-sm uppercase tracking-widest rounded-full mb-6">
                  Son Nəticə
                </div>
                <h3 className="text-3xl font-black text-[#0a1628] uppercase tracking-wide mb-2">
                  {lastMatch.home_team} {lastMatch.home_score} - {lastMatch.away_score} {lastMatch.away_team}
                </h3>
                <p className="text-gray-500 font-mono mb-6">
                  {new Date(lastMatch.date).toLocaleDateString('az-AZ')}
                </p>
                <Link href={`/oyunlar/${lastMatch.id}`} className="text-[#0a1628] font-bold uppercase tracking-wider text-sm hover:underline">
                  Hesabat &rarr;
                </Link>
              </div>
            )}
            
          </FadeIn>
        </section>
      )}

      {/* 3. LATEST NEWS */}
      {news.length > 0 && (
        <section className="py-24 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <p className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Gündəm</p>
                <h2 className="text-5xl font-black text-[#0a1628] uppercase tracking-tight">Klubdan Xəbərlər</h2>
              </div>
              <Link href="/xeberler" className="mt-6 md:mt-0 px-6 py-3 border-2 border-[#0a1628] text-[#0a1628] rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#0a1628] hover:text-white transition-colors">
                Bütün Xəbərlər
              </Link>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((item, i) => (
                <FadeIn key={item.id} delay={i * 0.2} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow group border border-gray-100">
                  <Link href={`/xeberler/${item.slug}`} className="block">
                    <div className="h-64 bg-gray-200 relative overflow-hidden">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.title_az} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">Şəkil yoxdur</div>
                      )}
                    </div>
                    <div className="p-8">
                      <p className="text-[#c9a84c] font-mono text-xs uppercase tracking-widest mb-3">
                        {new Date(item.published_at).toLocaleDateString('az-AZ')}
                      </p>
                      <h3 className="text-2xl font-black text-[#0a1628] mb-4 leading-tight group-hover:text-[#c9a84c] transition-colors">
                        {item.title_az}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {item.excerpt_az || item.content_az?.substring(0, 100) + '...'}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. TEAMS / SQUADS */}
      <section className="py-32 bg-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-20">
            <p className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Gələcəyin Ulduzları</p>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8">Bizim Komandalar</h2>
            <Link href="/komandalar" className="inline-block px-8 py-4 bg-[#c9a84c] text-[#0a1628] rounded-full font-bold uppercase tracking-widest hover:bg-[#b39542] transition-colors text-sm">
              Bütün Komandaları Gör
            </Link>
          </FadeIn>

          {teams.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.map((team, i) => (
                <FadeIn key={team.id} delay={i * 0.1}>
                  <Link href={`/komandalar/${team.id}`} className="block group">
                    <div className="bg-[#1B3A6B] rounded-[2rem] p-8 aspect-square flex flex-col items-center justify-center text-center hover:bg-[#c9a84c] transition-colors duration-300 border border-white/10">
                      <h3 className="text-5xl font-black uppercase tracking-tighter group-hover:text-[#0a1628] transition-colors">
                        {team.age_group}
                      </h3>
                      <p className="mt-4 text-gray-400 font-mono text-sm tracking-widest uppercase group-hover:text-[#0a1628]/70">
                        {team.name}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
