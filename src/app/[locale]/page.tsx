import Link from 'next/link';
import { getLocalizedData } from '@/lib/getLocalizedData';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';
import MatchesTabs from '@/components/MatchesTabs';
import AnalogClock from '@/components/AnalogClock';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const lang = locale.toUpperCase();

  let matches: any[] = [];
  let news: any[] = [];
  let teams: any[] = [];
  let heroBanner = null;
  let siteSettings: any = {};

  try {
    const settingsRes = await supabase.from('site_settings').select('*').single();
    if (settingsRes.data) siteSettings = settingsRes.data;

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
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 md:pt-40 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[75vh] flex flex-col justify-end p-8 md:p-16">
          <div className="absolute inset-0 z-0">
            {heroBanner ? (
              <img src={heroBanner.image_url} alt="Hero Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#0a1628]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/80 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-4xl">
            <FadeIn>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">{t('hero_label')}</p>
              <h1 className="text-4xl sm:text-2xl md:text-4xl lg:text-9xl font-black font-condensed uppercase tracking-normal text-white mb-6 leading-[1] md:leading-[0.85] drop-shadow-xl">
                {heroBanner?.title || t('hero_title')} 
              </h1>
              <p className="text-base sm:text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
                {heroBanner?.subtitle || t('hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row w-full gap-4">
                <Link href="/komandalar" className="ks-button ks-button-primary !bg-[var(--ks-kinpaku)] !text-[var(--ks-ink)] !border-none hover:!bg-[var(--ks-kinpaku-vivid)] !px-8 !py-4 text-lg font-bold !rounded-full w-full sm:w-auto text-center flex justify-center">{t("hero_btn1")}</Link>
                <Link href="#oyunlar" className="ks-button ks-button-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white hover:!text-[var(--ks-ink)] backdrop-blur-sm !px-8 !py-4 text-lg font-bold !rounded-full w-full sm:w-auto text-center flex justify-center">{t("hero_btn2")}</Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* MATCHES (Next Match & Last Match) */}
      <section id="oyunlar" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-4 md:gap-0">
            <div className="text-center md:text-left w-full md:w-auto">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">{t('matches_label')}</p>
              <h2 className="text-3xl md:text-4xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">{t("matches_title")}</h2>
            </div>
            <Link href="/oyunlar" className="ks-button ks-button-secondary !border-[var(--ks-ink)]/20 text-[var(--ks-ink)] hover:!bg-[var(--ks-ink)] hover:!text-white hidden md:inline-flex">{lang === "EN" ? "All matches" : lang === "RU" ? "Все матчи" : "Bütün oyunlar"}</Link>
          </div>
          
          <MatchesTabs  
            nextMatch={matches.find(m => m.status === 'upcoming')} 
            lastMatch={matches.find(m => m.status === 'completed')} 
          />
        </FadeIn>
      </section>

      {/* TURNİR CƏDVƏLİ WIDGET */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-4 md:gap-0">
            <div className="text-center md:text-left w-full md:w-auto">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-2 font-bold">{t('standings_label')}</p>
              <h2 className="text-2xl md:text-4xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">{t("standings_title")}</h2>
            </div>
            <Link href="/turnir-cedveli" className="ks-button ks-button-secondary !border-[var(--ks-ink)]/20 text-[var(--ks-ink)] hover:!bg-[var(--ks-ink)] hover:!text-white hidden md:inline-flex">
              Tam cədvəl
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* TABLE */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-[var(--ks-ink)]/5 flex flex-col">
              {/* Table header */}
              <div className="bg-[#0a1628] grid text-[var(--ks-kinpaku)] text-[10px] uppercase tracking-widest font-black"
                style={{gridTemplateColumns:'2.5rem 1fr 2rem 2rem 2rem 2rem 3rem'}}>
                <div className="py-3 text-center">#</div>
                <div className="py-3 pl-3">Komanda</div>
                <div className="py-3 text-center" title="Oyunlar">O</div>
                <div className="py-3 text-center hidden sm:block" title="Qələbə">Q</div>
                <div className="py-3 text-center hidden sm:block" title="Məğlubiyyət">M</div>
                <div className="py-3 text-center hidden sm:block" title="Qol Fərqi">+/-</div>
                <div className="py-3 text-center text-white">X</div>
              </div>

              {/* Placeholder rows */}
              {[
                {name:'Məlumat yüklənir', played:'-', won:'-', lost:'-', diff:'-', pts:'-', yarimada:false},
              ].map((row, idx) => (
                <div key={idx}
                  className={`grid items-center border-b border-gray-50 transition-colors ${row.yarimada ? 'bg-[var(--ks-kinpaku)]/10 border-l-4 border-l-[var(--ks-kinpaku)]' : 'hover:bg-gray-50'}`}
                  style={{gridTemplateColumns:'2.5rem 1fr 2rem 2rem 2rem 2rem 3rem'}}>
                  <div className="py-3 text-center text-xs font-black text-gray-300">{idx+1}</div>
                  <div className="py-3 pl-3 flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-full text-[9px] font-black flex items-center justify-center shrink-0 ${row.yarimada ? 'bg-[var(--ks-kinpaku)] text-[#0a1628]' : 'bg-gray-100 text-gray-400'}`}>
                      {(row.name as string).charAt(0)}
                    </div>
                    <span className="font-bold text-xs text-gray-700 truncate">{row.name}</span>
                  </div>
                  <div className="py-3 text-center text-xs font-mono text-gray-400">{row.played}</div>
                  <div className="py-3 text-center text-xs font-mono text-green-500 hidden sm:block">{row.won}</div>
                  <div className="py-3 text-center text-xs font-mono text-red-400 hidden sm:block">{row.lost}</div>
                  <div className="py-3 text-center text-xs font-mono text-gray-400 hidden sm:block">{row.diff}</div>
                  <div className="py-3 flex justify-center">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${row.yarimada ? 'bg-[var(--ks-kinpaku)] text-[#0a1628]' : 'bg-gray-100 text-gray-600'}`}>{row.pts}</span>
                  </div>
                </div>
              ))}

              <div className="mt-auto px-6 py-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">O=Oyun · Q=Qələbə · M=Məğlubiyyət · X=Xal</span>
                <Link href="/turnir-cedveli" className="text-xs font-black uppercase tracking-wider text-[var(--ks-kinpaku)] hover:underline">
                  {t('full_table')}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <AnalogClock />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* KLUB HAQQINDA & KOMANDALAR */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="bg-[var(--ks-paper-deep)] rounded-[2rem] p-8 md:p-16">
          <FadeIn>
            <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
              <div className="max-w-2xl">
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">{t('about_label')}</p>
                <h2 className="text-3xl md:text-4xl font-black font-condensed uppercase text-[var(--ks-ink)] mb-8 leading-[0.9]">
                  YARIMADA FK HAQQINDA.
                </h2>
                <p className="text-xl text-[var(--ks-ink)]/70 mb-8">
                  {t('about_text')}
                </p>
                <Link href="/klub" className="ks-button ks-button-primary !bg-[var(--ks-ink)] !text-white hover:!bg-[#15294a]">
                  Ətraflı
                </Link>
              </div>
              <div className="flex-1 rounded-[2rem] overflow-hidden bg-gray-200 group">
                {/* Klub sekli placeholder */}
                {siteSettings?.about_bg_image ? (
                  <img src={siteSettings.about_bg_image} alt="About Us" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-[#0a1628]/10 flex items-center justify-center text-[var(--ks-kinpaku)]">
                    Şəkil
                  </div>
                )}
              </div>
            </div>

            <hr className="border-[var(--ks-ink)]/10 mb-16" />

            {/* Komandalar */}
            <div className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-white bg-[#0a1628] mt-16 group">
              {siteSettings?.teams_bg_image && (
                <img src={siteSettings.teams_bg_image} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000 z-0" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0"></div>
              <div className="relative z-10">
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">AKADEMİYA</p>
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 mb-8">
                  <h2 className="text-2xl md:text-4xl font-black font-condensed uppercase leading-[0.9]">
                    KOMANDALAR
                  </h2>
                  <Link href="/komandalar" className="text-sm font-bold uppercase tracking-wider text-[var(--ks-kinpaku-rich)] hover:text-white transition-colors inline-block pb-1 border-b border-[var(--ks-kinpaku-rich)] md:border-none">
                    Bütün yaş qrupları →
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['U-12', 'U-11', 'U-10', 'U-9'].map((age) => (
                    <Link key={age} href={`/komandalar?age=${age}`} className="group aspect-square rounded-[2rem] bg-white/10 backdrop-blur-md flex flex-col items-center justify-center p-6 hover:bg-[var(--ks-kinpaku)] hover:transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-black text-white group-hover:text-[#0a1628]">{age}</span>
                      </div>
                      <span className="font-bold text-white group-hover:text-[#0a1628]">Komandası</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* XƏBƏRLƏR */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-4 md:gap-0">
            <div className="text-center md:text-left w-full md:w-auto">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">{t('news_label')}</p>
              <h2 className="text-3xl md:text-4xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">{t("news_title")}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.length > 0 ? (
              news.map((item, index) => (
                <Link key={index} href={`/xeberler/${item.slug || item.id}`} className="group block">
                  <div className="aspect-[4/3] rounded-[2rem] bg-gray-200 mb-6 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={lang === "EN" ? (item.title_en || item.title_az) : lang === "RU" ? (item.title_ru || item.title_az) : item.title_az} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-[#0a1628]/10 flex items-center justify-center">
                        <span className="text-[var(--ks-ink)]/20 font-bold text-2xl">YARIMADA FK</span>
                      </div>
                    )}
                  </div>
                  <p className="font-mono text-xs text-[#0a1628]/60 mb-3">{new Date(item.published_at || item.created_at).toLocaleDateString('az-AZ')}</p>
                  <h3 className="text-xl font-bold leading-tight group-hover:text-[var(--ks-kinpaku-rich)] transition-colors line-clamp-2 mb-2">
                    {lang === "EN" ? (item.title_en || item.title_az) : lang === "RU" ? (item.title_ru || item.title_az) : item.title_az}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{lang === "EN" ? (item.excerpt_en || item.excerpt_az) : lang === "RU" ? (item.excerpt_ru || item.excerpt_az) : item.excerpt_az}</p>
                  <span className="text-sm font-bold text-[var(--ks-kinpaku-rich)] group-hover:text-[var(--ks-ink)] transition-colors">{t("read_more")} &rarr;</span>
                </Link>
              ))
            ) : (
              // Mock items if empty
              Array(4).fill(null).map((_, i) => (
                <div key={i} className="group block">
                  <div className="aspect-[4/3] rounded-[2rem] bg-gray-100 mb-6" />
                  <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                  <div className="h-6 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-2/3 bg-gray-200 rounded" />
                </div>
              ))
            )}
          </div>
        </FadeIn>
      </section>

      
      {/* MARQUEE SPONSORLAR / TƏRƏFDAŞLAR */}
      <section className="py-4 md:py-6 border-t border-[var(--ks-ink)]/10 overflow-hidden bg-[var(--ks-kinpaku)]">
        <div className="w-full flex space-x-12 items-center text-[#0a1628] whitespace-nowrap overflow-hidden relative">
          <div className="flex space-x-12 px-6" style={{ animation: 'marquee 20s linear infinite' }}>
            {['SPONSOR - NIKE', 'TƏRƏFDAŞ - BAKCELL', 'SPONSOR - KAPITAL BANK', 'TƏRƏFDAŞ - AFFA', 'SPONSOR - SOCAR', 'TƏRƏFDAŞ - ASAN'].map((sponsor, i) => (
               <span key={i} className="text-base md:text-lg font-bold tracking-widest uppercase flex items-center gap-4">
                 <svg className="w-6 h-6 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/></svg>
                 {sponsor}
               </span>
            ))}
            {/* Duplicate for infinite effect */}
            {['SPONSOR - NIKE', 'TƏRƏFDAŞ - BAKCELL', 'SPONSOR - KAPITAL BANK', 'TƏRƏFDAŞ - AFFA', 'SPONSOR - SOCAR', 'TƏRƏFDAŞ - ASAN'].map((sponsor, i) => (
               <span key={`dup-${i}`} className="text-base md:text-lg font-bold tracking-widest uppercase flex items-center gap-4">
                 <svg className="w-6 h-6 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/></svg>
                 {sponsor}
               </span>
            ))}
          </div>
        </div>
      </section>

      {/* MEDİA: VİDEO VƏ QALEREYA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Videolar */}
            <div className="flex-1 bg-[#0a1628] rounded-[2rem] p-8 md:p-12 text-white">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">MEDİA</p>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl md:text-4xl font-black font-condensed uppercase leading-[0.9]">{t("media_videos")}</h2>
                <Link href="/media?tab=videos" className="text-sm font-bold text-white/70 hover:text-white transition-colors">Hamısı &rarr;</Link>
              </div>
              
              <div className="aspect-video bg-black rounded-[2rem] overflow-hidden mb-6 relative group cursor-pointer border border-white/10">
                {/* YouTube Video Placeholder */}
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold">U-12 Komandasının Möhtəşəm Qələbəsi</h3>
            </div>

            {/* Foto Qalereya */}
            <div className="flex-1 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]/60 mb-4 font-bold">MEDİA</p>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl md:text-4xl font-black font-condensed uppercase text-[var(--ks-ink)] leading-[0.9]">{t("media_photos")}</h2>
                <Link href="/media?tab=photos" className="text-sm font-bold text-[var(--ks-ink)]/70 hover:text-[var(--ks-ink)] transition-colors">Hamısı &rarr;</Link>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-gray-200 rounded-[2rem] overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"></div>
                <div className="aspect-square bg-gray-200 rounded-[2rem] overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"></div>
                <div className="aspect-square bg-gray-200 rounded-[2rem] overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"></div>
                <div className="aspect-square bg-gray-200 rounded-[2rem] overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"></div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>


    </main>
  );
}
