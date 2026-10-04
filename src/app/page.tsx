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
    <main className="flex-grow bg-[#ffffff]">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen bg-[#0a1628] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#0a1628]">
           {/* In reality, an image goes here. Using a very dark pattern/text for now */}
           <div className="w-full h-full flex items-center justify-center opacity-10">
              <span className="text-white text-[20vw] font-black uppercase tracking-tighter transform -rotate-12 select-none">YARIMADA</span>
           </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/50 z-10" />

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
          <FadeIn delay={0.2}>
            <p className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-6">2026/27 Mövsüm</p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black text-white uppercase tracking-tighter mb-8 leading-[0.9] drop-shadow-2xl">
              Bu Yarımada FK.
            </h1>
          </FadeIn>
          <FadeIn delay={0.6}>
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
              Bakının ən müasir futbol akademiyası. Hər oyunu, hər komandanı və hər anı yaxından izlə.
            </p>
          </FadeIn>
          <FadeIn delay={0.8} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/qeydiyyat" className="px-10 py-4 bg-[#c9a84c] text-[#0a1628] rounded-full font-bold uppercase tracking-widest hover:bg-[#b39542] transition-colors text-sm">
              Akademiyaya Qoşul
            </Link>
            <Link href="/oyunlar" className="px-10 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-[#0a1628] transition-colors text-sm">
              Oyunlara Bax
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 2. MATCHES SECTION */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Next Match Card */}
            <FadeIn className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[400px]">
              <div>
                <p className="text-[#c9a84c] font-mono text-xs uppercase tracking-widest mb-4">Növbəti Oyun</p>
                {nextMatch ? (
                  <>
                    <h2 className="text-5xl md:text-6xl font-black text-[#0a1628] uppercase tracking-tighter mb-6 leading-none">
                      {nextMatch.home_team} <br/><span className="text-gray-300 text-4xl">vs</span><br/> {nextMatch.away_team}
                    </h2>
                    <div className="text-gray-500 font-mono text-sm uppercase tracking-wider space-y-2">
                      <p>{new Date(nextMatch.date).toLocaleDateString('az-AZ')} • {nextMatch.time || '18:00'}</p>
                      <p>{nextMatch.stadium || 'Ev stadionu'} • {nextMatch.tournament || 'Yoldaşlıq Oyunu'}</p>
                    </div>
                  </>
                ) : (
                  <h2 className="text-5xl font-black text-gray-300 uppercase tracking-tighter mb-6">Təyin olunmuş oyun yoxdur</h2>
                )}
              </div>
              <div className="mt-12">
                <Link href={nextMatch ? `/oyunlar/${nextMatch.id}` : "/oyunlar"} className="inline-block px-8 py-3 bg-[#0a1628] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#0a1628] transition-colors text-xs">
                  Oyun Haqqında
                </Link>
              </div>
            </FadeIn>

            {/* Last Result Card */}
            <FadeIn delay={0.2} className="bg-[#0a1628] text-white rounded-[2rem] p-10 shadow-xl flex flex-col justify-between min-h-[400px]">
              <div>
                <p className="text-[#c9a84c] font-mono text-xs uppercase tracking-widest mb-4">Son Nəticə</p>
                {lastMatch ? (
                  <>
                    <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
                      {lastMatch.home_team} <span className="text-[#c9a84c]">{lastMatch.home_score}</span> <br/>
                      {lastMatch.away_team} <span className="text-[#c9a84c]">{lastMatch.away_score}</span>
                    </h2>
                    <div className="text-gray-400 font-mono text-sm uppercase tracking-wider space-y-2">
                      <p>{new Date(lastMatch.date).toLocaleDateString('az-AZ')}</p>
                      <p>{lastMatch.tournament}</p>
                    </div>
                  </>
                ) : (
                  <h2 className="text-5xl font-black text-gray-600 uppercase tracking-tighter mb-6">Nəticə yoxdur</h2>
                )}
              </div>
              <div className="mt-12">
                <Link href={lastMatch ? `/oyunlar/${lastMatch.id}` : "/oyunlar"} className="inline-block px-8 py-3 bg-transparent border border-white/20 text-white rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-[#0a1628] transition-colors text-xs">
                  Oyun Hesabatı
                </Link>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* 3. LATEST NEWS */}
      <section className="py-24 bg-white">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <p className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Gündəm</p>
              <h2 className="text-6xl md:text-7xl font-black text-[#0a1628] uppercase tracking-tighter">Son Xəbərlər</h2>
            </div>
            <Link href="/xeberler" className="mt-6 md:mt-0 px-8 py-3 bg-[#f8fafc] border border-gray-200 text-[#0a1628] rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#0a1628] hover:text-white transition-colors">
              Bütün Xəbərlər
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.length > 0 ? news.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.1} className="group cursor-pointer">
                <Link href={`/xeberler/${item.slug}`} className="block">
                  <div className="w-full aspect-[4/3] bg-[#f8fafc] rounded-3xl overflow-hidden mb-6 relative">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.title_az} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">Şəkil yoxdur</div>
                    )}
                  </div>
                  <p className="text-[#c9a84c] font-mono text-xs uppercase tracking-widest mb-3">
                    {new Date(item.published_at).toLocaleDateString('az-AZ')}
                  </p>
                  <h3 className="text-3xl font-black text-[#0a1628] uppercase tracking-tight leading-none mb-4 group-hover:text-[#c9a84c] transition-colors">
                    {item.title_az}
                  </h3>
                  <p className="text-gray-500 line-clamp-2">
                    {item.excerpt_az || item.content_az?.substring(0, 100) + '...'}
                  </p>
                </Link>
              </FadeIn>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-400 font-mono uppercase tracking-widest">Hələlik xəbər yoxdur</div>
            )}
          </div>
        </div>
      </section>

      {/* 4. TEAMS / SQUADS */}
      <section className="py-32 bg-[#0a1628] text-white">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-20">
            <p className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Gələcəyin Ulduzları</p>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-10">Komandalar</h2>
            <Link href="/komandalar" className="inline-block px-10 py-4 bg-[#c9a84c] text-[#0a1628] rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors text-sm">
              Bütün Komandalar
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.length > 0 ? teams.map((team, i) => (
              <FadeIn key={team.id} delay={i * 0.1}>
                <Link href={`/komandalar/${team.id}`} className="block group">
                  <div className="bg-white/5 rounded-[2rem] p-10 aspect-square flex flex-col items-center justify-center text-center hover:bg-[#c9a84c] transition-colors duration-300 border border-white/5">
                    <h3 className="text-6xl font-black uppercase tracking-tighter group-hover:text-[#0a1628] transition-colors">
                      {team.age_group}
                    </h3>
                    <p className="mt-4 text-gray-400 font-mono text-sm tracking-widest uppercase group-hover:text-[#0a1628]/70">
                      {team.name}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            )) : (
              <div className="col-span-4 text-center py-12 text-gray-500 font-mono uppercase tracking-widest">Komanda məlumatları yüklənməyib</div>
            )}
          </div>
        </div>
      </section>

      {/* 5. MEDIA (Videos & Photos) */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-16">
            <p className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Qalereya</p>
            <h2 className="text-6xl md:text-7xl font-black text-[#0a1628] uppercase tracking-tighter">Son Videolar</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Video Placeholder 1 */}
            <FadeIn className="w-full aspect-video bg-[#0a1628] rounded-3xl relative overflow-hidden group cursor-pointer border border-gray-200">
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                 <div className="w-20 h-20 bg-[#c9a84c] rounded-full flex items-center justify-center pl-2 shadow-xl group-hover:scale-110 transition-transform">
                   <svg className="w-8 h-8 text-[#0a1628]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                 </div>
               </div>
               <div className="absolute bottom-6 left-6 right-6">
                 <p className="text-white font-black text-2xl uppercase tracking-tighter drop-shadow-md">Yarımada FK - Mövsümün Qolları</p>
               </div>
            </FadeIn>
            {/* Video Placeholder 2 */}
            <FadeIn delay={0.2} className="w-full aspect-video bg-gray-200 rounded-3xl relative overflow-hidden group cursor-pointer border border-gray-200">
               <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
                 <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-2 shadow-xl group-hover:scale-110 transition-transform">
                   <svg className="w-8 h-8 text-[#0a1628]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                 </div>
               </div>
               <div className="absolute bottom-6 left-6 right-6">
                 <p className="text-[#0a1628] font-black text-2xl uppercase tracking-tighter drop-shadow-sm">Məşq Prosesi - U-12</p>
               </div>
            </FadeIn>
          </div>

          <FadeIn className="text-center">
            <Link href="/media" className="inline-block px-10 py-4 bg-[#0a1628] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#0a1628] transition-colors text-sm">
              Bütün Media Bölməsi
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 6. ABOUT CLUB */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="w-full aspect-square bg-[#f8fafc] rounded-[3rem] border border-gray-100 flex items-center justify-center overflow-hidden">
                <Image src="/Logo.JPG.jpeg" alt="Yarımada" width={400} height={400} className="opacity-80" />
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Akademiya</p>
              <h2 className="text-6xl md:text-7xl font-black text-[#0a1628] uppercase tracking-tighter mb-8 leading-[0.9]">
                Yarımada FK <br/>Kəşf Et
              </h2>
              <p className="text-gray-500 text-xl leading-relaxed mb-10">
                Biz sadəcə bir futbol klubu deyilik, biz uşaqların fiziki, psixoloji və sosial inkişafı üçün qurulmuş böyük bir ailəyik. Missiyamız Azərbaycan futboluna sağlam və peşəkar gənclər qazandırmaqdır.
              </p>
              <Link href="/klub" className="inline-block px-10 py-4 bg-[#f8fafc] border border-gray-200 text-[#0a1628] rounded-full font-bold uppercase tracking-widest hover:bg-[#0a1628] hover:text-white transition-colors text-sm">
                Klub Haqqında Ətraflı
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 7. SPONSORS */}
      <section className="py-24 bg-[#0a1628] text-white">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-[#c9a84c] font-mono text-sm uppercase tracking-widest mb-4">Tərəfdaşlarımız</p>
            <h2 className="text-4xl font-black uppercase tracking-widest">Sponsorlar</h2>
          </FadeIn>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Fake Sponsors for visual representation as requested "Sponsor və tərəfdaşların loqoları" */}
            <div className="text-3xl font-black tracking-tighter uppercase">Sponsor 1</div>
            <div className="text-3xl font-black tracking-tighter uppercase">Sponsor 2</div>
            <div className="text-3xl font-black tracking-tighter uppercase">Sponsor 3</div>
            <div className="text-3xl font-black tracking-tighter uppercase">Sponsor 4</div>
          </div>
        </div>
      </section>

    </main>
  );
}
