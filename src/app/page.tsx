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
  let heroBanner = null;

  try {
    const matchRes = await supabase.from('matches').select('*').order('date', { ascending: false }).limit(2);
    if (matchRes.data) matches = matchRes.data;

    const newsRes = await supabase.from('news').select('*').eq('published', true).order('published_at', { ascending: false }).limit(4);
    if (newsRes.data) news = newsRes.data;

    const teamsRes = await supabase.from('teams').select('*').limit(4);
    if (teamsRes.data) teams = teamsRes.data;
    
    const heroRes = await supabase.from('hero_banners').select('*').eq('is_active', true).order('order_index').limit(1).single();
    if (heroRes.data) heroBanner = heroRes.data;
  } catch (error) {
    console.error('Home page fetch error', error);
  }

  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)]">
      
      {/* 1. HERO SECTION (Iballa Style - Rounded Box) */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[75vh] flex flex-col justify-end p-8 md:p-16">
          <div className="absolute inset-0 z-0">
            {heroBanner ? (
              <img src={heroBanner.image_url} alt="Hero Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#0a1628]" />
            )}
            {/* Gradient matching the video - dark from bottom and left */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/80 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-4xl">
            <FadeIn>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">2026/27 MÖVSÜM</p>
              <h1 className="text-7xl md:text-9xl font-black font-condensed uppercase tracking-normal text-white mb-6 leading-[0.85] drop-shadow-xl">
                {heroBanner?.title || 'BU YARIMADA FK.'}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
                {heroBanner?.subtitle || 'Bakının ən gənc və dinamik futbol akademiyası. Hər oyunu, hər komandanı və hər anı yaxından izlə.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={heroBanner?.button_link || "/qeydiyyat"} className="ks-button ks-button-primary !bg-[var(--ks-kinpaku)] !text-[var(--ks-ink)] !border-none hover:!bg-[var(--ks-kinpaku-vivid)] !px-8 !py-4 text-lg font-bold">
                  {heroBanner?.button_text || 'Akademiyaya Qoşul'}
                </Link>
                <Link href="/oyunlar" className="ks-button ks-button-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white hover:!text-[var(--ks-ink)] backdrop-blur-sm !px-8 !py-4 text-lg font-bold">
                  Oyunlara bax
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. MATCHDAY DONE PROPERLY (Like the Hospitality section in Iballa) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="bg-[var(--ks-paper-deep)] rounded-[2rem] p-8 md:p-16">
          <FadeIn>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">YARIMADA AKADEMİYASI</p>
            <h2 className="text-6xl md:text-7xl font-black font-condensed uppercase text-[var(--ks-ink)] mb-8 leading-[0.9]">
              GƏLƏCƏYİN<br />ULDUZLARI BURADA.
            </h2>
            <p className="text-xl text-[var(--ks-ink)]/70 mb-10 max-w-3xl">
              Müasir futbol fəlsəfəsi, peşəkar məşqçilər heyəti və yüksək səviyyəli təlim mərkəzi ilə 
              U-9'dan U-12'yə qədər bütün yaş qruplarında gələcəyin futbolçularını yetişdiririk.
            </p>
            <Link href="/qeydiyyat" className="ks-button ks-button-primary !bg-[var(--ks-ink)] !text-white hover:!bg-[#15294a] mb-12">
              Akademiya haqqında
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden relative">
                <div className="absolute inset-0 bg-[var(--ks-ink)]/10"></div>
                <div className="absolute bottom-4 left-4 font-mono text-sm font-bold bg-white/90 px-3 py-1 rounded-full">U-12 Komandası</div>
              </div>
              <div className="aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden relative">
                <div className="absolute inset-0 bg-[var(--ks-ink)]/10"></div>
                <div className="absolute bottom-4 left-4 font-mono text-sm font-bold bg-white/90 px-3 py-1 rounded-full">U-11 Komandası</div>
              </div>
              <div className="aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden relative">
                <div className="absolute inset-0 bg-[var(--ks-ink)]/10"></div>
                <div className="absolute bottom-4 left-4 font-mono text-sm font-bold bg-white/90 px-3 py-1 rounded-full">U-10 Komandası</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. MATCHES (Slider Component) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">MEYDANDA</p>
              <h2 className="text-6xl md:text-7xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">
                OYUNLAR
              </h2>
            </div>
            <Link href="/oyunlar" className="ks-button ks-button-secondary !border-[var(--ks-ink)]/20 text-[var(--ks-ink)] hover:!bg-[var(--ks-ink)] hover:!text-white hidden md:inline-flex">
              Bütün oyunlar
            </Link>
          </div>
          
          <MatchesTabs 
            nextMatch={matches.find(m => m.status === 'upcoming')} 
            lastMatch={matches.find(m => m.status === 'completed')} 
          />
        </FadeIn>
      </section>

      {/* 4. NEWS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">XƏBƏRLƏR</p>
              <h2 className="text-6xl md:text-7xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">
                KLUBDAN YENİLİKLƏR
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.length > 0 ? (
              news.map((item, index) => (
                <Link key={index} href={`/xeberler/${item.slug || item.id}`} className="group block">
                  <div className="aspect-[4/3] rounded-2xl bg-gray-200 mb-6 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-[#0a1628]/10 flex items-center justify-center">
                        <span className="text-[var(--ks-ink)]/20 font-bold text-2xl">YARIMADA FK</span>
                      </div>
                    )}
                  </div>
                  <p className="font-mono text-xs text-[#0a1628]/60 mb-3">{new Date(item.published_at || item.created_at).toLocaleDateString('az-AZ')}</p>
                  <h3 className="text-xl font-bold leading-tight group-hover:text-[var(--ks-kinpaku-rich)] transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                </Link>
              ))
            ) : (
              // Mock items if empty
              Array(4).fill(null).map((_, i) => (
                <div key={i} className="group block">
                  <div className="aspect-[4/3] rounded-2xl bg-gray-100 mb-6" />
                  <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                  <div className="h-6 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-2/3 bg-gray-200 rounded" />
                </div>
              ))
            )}
          </div>
        </FadeIn>
      </section>

      {/* 5. MARQUEE SPONSORS */}
      <section className="py-20 border-t border-[var(--ks-ink)]/10 overflow-hidden">
        <div className="w-full flex space-x-16 items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">NIKE</span>
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">BAKCELL</span>
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">KAPITAL BANK</span>
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">AFFA</span>
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">NIKE</span>
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">BAKCELL</span>
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">KAPITAL BANK</span>
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">AFFA</span>
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">NIKE</span>
          <span className="text-3xl font-black font-condensed tracking-widest text-[#0a1628]">BAKCELL</span>
        </div>
      </section>

    </main>
  );
}
