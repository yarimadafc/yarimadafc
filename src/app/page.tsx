export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';
import MatchesTabs from '@/components/MatchesTabs';

export default async function Home() {
  let matches: any[] = [];
  let news: any[] = [];
  let teams: any[] = [];

  try {
    const matchRes = await supabase.from('matches').select('*').order('date', { ascending: false }).limit(2);
    if (matchRes.data) matches = matchRes.data;

    const newsRes = await supabase.from('news').select('*').eq('published', true).order('published_at', { ascending: false }).limit(4);
    if (newsRes.data) news = newsRes.data;

    const teamsRes = await supabase.from('teams').select('*').limit(4);
    if (teamsRes.data) teams = teamsRes.data;
  } catch (error) {
    console.error('Home page fetch error', error);
  }

  const nextMatch = matches.find(m => m.status === 'upcoming');
  const lastMatch = matches.find(m => m.status === 'completed');

  return (
    <main className="flex-grow bg-white text-[#0a1628] selection:bg-[#c9a84c] selection:text-[#0a1628]">
      
      {/* 1. HERO SECTION - Compact and Clean */}
      <section className="relative w-full min-h-[90vh] bg-white flex flex-col justify-center items-center overflow-hidden pt-24 px-4">
        
        {/* Subtle background abstract shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#0a1628]/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#c9a84c]/10 rounded-full blur-[80px] -z-10" />

        <div className="relative z-20 text-center max-w-4xl mx-auto flex flex-col items-center">
          <FadeIn delay={0.1}>
            <div className="px-4 py-1.5 border border-[#0a1628]/10 rounded-full font-mono text-[10px] uppercase tracking-widest text-[#0a1628]/60 mb-8 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse"></span>
              2026/27 Mövsüm Qeydiyyatı Açıqdır
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-black text-[#0a1628] uppercase tracking-tighter mb-6 leading-[1.05]">
              Futbol Həyatdır. <br/> <span className="text-[#c9a84c]">Yarımada FK</span> Gələcəkdir.
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <p className="text-gray-500 text-base md:text-lg mb-10 max-w-2xl mx-auto">
              Peşəkar məşqçi heyəti, müasir infrastruktur və gənc istedadların inkişafı üçün mükəmməl mühit.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/qeydiyyat" className="px-8 py-3.5 bg-[#0a1628] text-white rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 active:scale-95 transition-all w-full sm:w-auto shadow-xl shadow-[#0a1628]/20">
              Akademiyaya Qoşul
            </Link>
            <Link href="/oyunlar" className="px-8 py-3.5 bg-white border border-gray-200 text-[#0a1628] rounded-full font-bold uppercase tracking-wider text-sm hover:border-[#0a1628] hover:bg-gray-50 transition-colors w-full sm:w-auto">
              Oyunlara Bax
            </Link>
          </FadeIn>
        </div>

        {/* Hero Bottom Image/Banner Compact */}
        <FadeIn delay={0.6} className="mt-16 w-full max-w-6xl mx-auto">
           <div className="w-full h-48 md:h-64 bg-[#0a1628] rounded-3xl overflow-hidden relative shadow-2xl flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <p className="text-[#c9a84c]/20 text-[10vw] font-black uppercase tracking-tighter select-none">YARIMADA</p>
           </div>
        </FadeIn>
      </section>

      {/* 2. MATCH DASHBOARD */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
             <MatchesTabs nextMatch={nextMatch} lastMatch={lastMatch} />
          </FadeIn>
        </div>
      </section>

      {/* 3. LATEST NEWS CAROUSEL (Scrolling horizontally for compact look) */}
      <section className="py-20 bg-gray-50 overflow-hidden border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight">Klubdan Xəbərlər</h2>
          </div>
          <Link href="/xeberler" className="text-sm font-bold uppercase tracking-wider text-[#0a1628] hover:text-[#c9a84c] transition-colors hidden sm:block">
            Bütün Xəbərlər
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-6 px-4 sm:px-6 lg:px-8 max-w-[100vw] pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {news.length > 0 ? news.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.1} className="snap-start shrink-0 w-[280px] sm:w-[320px]">
              <Link href={`/xeberler/${item.slug}`} className="block group">
                <div className="w-full h-48 bg-gray-200 rounded-2xl overflow-hidden mb-4 relative border border-gray-200">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title_az} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">Xəbər</div>
                  )}
                </div>
                <p className="text-[#c9a84c] font-mono text-[10px] uppercase tracking-widest mb-2">
                  {new Date(item.published_at).toLocaleDateString('az-AZ')}
                </p>
                <h3 className="text-lg font-bold text-[#0a1628] leading-tight group-hover:text-[#c9a84c] transition-colors">
                  {item.title_az}
                </h3>
              </Link>
            </FadeIn>
          )) : (
            <div className="text-gray-400 px-4">Yenilik yoxdur</div>
          )}
        </div>
      </section>

      {/* 4. TEAMS COMPACT GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tight">Akademiya Komandaları</h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teams.length > 0 ? teams.map((team, i) => (
              <FadeIn key={team.id} delay={i * 0.05}>
                <Link href={`/komandalar/${team.id}`} className="block group">
                  <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-[#0a1628] hover:shadow-lg transition-all">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-[#0a1628] group-hover:text-[#c9a84c] transition-colors">
                      {team.age_group}
                    </h3>
                    <p className="mt-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
                      {team.name}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            )) : (
              <div className="col-span-4 text-center text-gray-400">Komanda məlumatı yoxdur</div>
            )}
          </div>
        </div>
      </section>

      {/* 5. ABOUT COMPACT */}
      <section className="py-20 bg-[#0a1628] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="w-16 h-16 mx-auto bg-[#c9a84c] rounded-full mb-8 flex items-center justify-center">
              <span className="text-[#0a1628] font-black text-xl">Y</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
              Peşəkar Futbol Yolu
            </h2>
            <p className="text-gray-400 text-base mb-8 max-w-2xl mx-auto">
              Yarımada FK sadəcə bir komanda deyil, uşaqların fiziki və mənəvi inkişafı üçün mükəmməl mühitdir. Hər bir addımda gələcəyə yatırım edirik.
            </p>
            <Link href="/klub" className="text-[#c9a84c] font-bold uppercase tracking-wider text-sm hover:text-white transition-colors border-b border-[#c9a84c] pb-1">
              Haqqımızda oxu
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 6. SPONSORS MARQUEE (Ekranda dönən şəkillər / barlar) */}
      <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
        <div className="flex gap-12 items-center whitespace-nowrap animate-[marquee_20s_linear_infinite] opacity-40 hover:opacity-100 transition-opacity">
          {/* Repeat multiple times for marquee effect */}
          {[1,2,3,4,5,6,7,8].map((i) => (
             <div key={i} className="text-2xl font-black uppercase tracking-widest text-[#0a1628]">Sponsor {i}</div>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />

    </main>
  );
}
