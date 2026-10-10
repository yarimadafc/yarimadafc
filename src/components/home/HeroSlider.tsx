'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import NextMatchCard from '@/components/NextMatchCard';
import LastResultCard from '@/components/LastResultCard';
import { useSyncVersion } from '@/lib/siteSync';

type Slide = { id: string; image: string; title: string; subtitle?: string; href?: string; intro?: boolean; raw?: Record<string, any> };

const AUTOPLAY_MS = 6500;
const INTRO_MS = 9000;

// Fades in only once the image is decoded, then runs the slow zoom on the GPU — starting the animation
// while the file was still downloading/decoding is what made it freeze and jump.
function HeroImage({ src, active, priority }: { src: string; active: boolean; priority: boolean }) {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    let cancelled = false;
    const done = () => { if (!cancelled) setReady(true); };
    if (img.complete && img.naturalWidth > 0) {
      (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(done);
    }
    return () => { cancelled = true; };
  }, [src]);
  return (
    <img
      ref={ref}
      src={src}
      alt=""
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      onLoad={e => { const img = e.currentTarget; (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => setReady(true)); }}
      onError={() => setReady(true)}
      style={{ willChange: active ? 'transform, opacity' : undefined }}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'} ${active && ready ? 'animate-[hero-zoom_2.4s_cubic-bezier(.2,.6,.2,1)_both]' : ''}`}
    />
  );
}

export default function HeroSlider() {
  const { t, loc } = useLang();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [intro, setIntro] = useState({
    bg: '',
    title1: 'YENİ MÖVSÜM,',
    title2: 'YENİ HƏDƏFLƏR',
    subtitle: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!',
  });
  const [extra, setExtra] = useState<Slide[]>([]);
  const touchX = useRef<number | null>(null);

  const sync = useSyncVersion();
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [{ data: slideRows }, { data: newsRows }, { data: site }] = await Promise.all([
        supabase.from('hero_slides').select('*').order('sort_order', { ascending: true }).limit(6),
        supabase.from('news').select('id, title_az, image_url, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('site_images').select('section_key, image_url').in('section_key', ['hero_bg', 'hero_title_1', 'hero_title_2', 'hero_subtitle']),
      ]);
      if (cancelled) return;
      const map: Record<string, string> = {};
      (site || []).forEach((r: any) => { map[r.section_key] = r.image_url; });
      setIntro(i => ({
        bg: map.hero_bg || i.bg,
        title1: map.hero_title_1 || i.title1,
        title2: map.hero_title_2 || i.title2,
        subtitle: map.hero_subtitle || i.subtitle,
      }));

      let list: Slide[] = (slideRows || []).map((s: any) => ({
        id: `s-${s.id}`, image: s.image_url || '', title: s.title || '', subtitle: s.subtitle || '', href: s.link_url || '/news',
      }));
      if (list.length === 0) {
        list = (newsRows || []).map((n: any) => ({ id: `n-${n.id}`, image: n.image_url || '', title: n.title_az || '', href: `/news/${n.id}`, raw: n }));
      }
      setExtra(list);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [sync]);

  // intro slide is always first (it keeps the editable site texts, buttons and the next-match card)
  useEffect(() => {
    setSlides([{ id: 'intro', intro: true, image: intro.bg, title: `${intro.title1} ${intro.title2}`.trim() }, ...extra]);
  }, [intro, extra]);

  const count = slides.length;
  const go = useCallback((i: number) => count && setActive(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = setTimeout(() => setActive(a => (a + 1) % count), slides[active]?.intro ? INTRO_MS : AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [count, paused, active, slides]);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; setPaused(true); };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current != null) {
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
    }
    touchX.current = null;
    setPaused(false);
  };

  // no animated LED border here: repainting a conic gradient over this large area every frame made Chrome stutter
  const frame = 'relative overflow-hidden rounded-2xl bg-bg-sec border border-bg-border aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/10] lg:aspect-[2.2/1]';
  const titleOf = (s: Slide) => (s.intro ? `${t(intro.title1)} ${t(intro.title2)}`.trim() : s.raw ? loc(s.raw, 'title') : s.title);

  return (
    <section className="pt-header">
      <div className={`container ${count > 1 ? 'lg:mb-28' : ''}`}>
        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {loading ? (
            <div className={`${frame} animate-pulse`} aria-hidden />
          ) : (
            <>
              <div className={frame} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                {slides.map((s, i) => {
                  const on = i === active;
                  return (
                    <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${on ? 'opacity-100 z-[1]' : 'opacity-0 pointer-events-none'}`} aria-hidden={!on}>
                      {s.image && <HeroImage src={s.image} active={on} priority={i === 0} />}

                      {s.intro ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-bg-main via-bg-main/70 to-bg-main/20" />
                          <div className="absolute inset-0 flex flex-col lg:flex-row items-center justify-end lg:justify-between gap-6 p-5 sm:p-10 lg:p-14 xl:p-20">
                            <div className="w-full lg:max-w-2xl text-center lg:text-left">
                              {on && (
                                <>
                                  <h1 className="text-[2rem] sm:text-5xl xl:text-6xl font-black text-text-main leading-[1.1] tracking-tight drop-shadow-2xl animate-[rise_.8s_ease-out_both]">
                                    {t(intro.title1)} <span className="block text-accent led-text">{t(intro.title2)}</span>
                                  </h1>
                                  <p className="mt-4 text-sm sm:text-base lg:text-lg text-text-sec max-w-xl mx-auto lg:mx-0 font-medium animate-[rise_.8s_.2s_ease-out_both]">{t(intro.subtitle)}</p>
                                  <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-[rise_.8s_.4s_ease-out_both]">
                                    <Link href="/register" className="btn-fx led-border bg-accent text-on-accent px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs sm:text-sm text-center">{t('Akademiyaya qoşul')}</Link>
                                    <Link href="/matches" className="btn-fx border border-bg-border bg-bg-deep/70 backdrop-blur text-text-main px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs sm:text-sm text-center hover:border-accent">{t('Oyunlar cədvəli')}</Link>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="hidden lg:flex flex-col gap-3 w-full max-w-sm shrink-0">
                              {on && <NextMatchCard compact className="animate-[rise_.9s_.3s_ease-out_both]" />}
                              {on && <LastResultCard className="animate-[rise_.9s_.45s_ease-out_both]" />}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-main/90 via-bg-main/10 to-transparent lg:from-bg-main/40" />
                          {s.href && <Link href={s.href} className="absolute inset-0 z-10" aria-label={titleOf(s)} tabIndex={on ? 0 : -1} />}
                          <div className="lg:hidden absolute inset-x-0 bottom-0 z-[5] p-5 sm:p-8 pointer-events-none">
                            <h2 className="text-xl sm:text-3xl font-extrabold text-text-main leading-tight line-clamp-3">{titleOf(s)}</h2>
                            {s.subtitle && <p className="mt-2 text-sm text-text-sec line-clamp-2">{s.subtitle}</p>}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {count > 1 && (
                <>
                  <button onClick={() => go(active - 1)} className="hidden sm:flex absolute left-3 lg:left-5 top-[38%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-bg-main/70 backdrop-blur border border-bg-border items-center justify-center text-text-main hover:bg-accent hover:text-on-accent hover:scale-110 transition-all" aria-label={t('Əvvəlki')}>
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => go(active + 1)} className="hidden sm:flex absolute right-3 lg:right-5 top-[38%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-bg-main/70 backdrop-blur border border-bg-border items-center justify-center text-text-main hover:bg-accent hover:text-on-accent hover:scale-110 transition-all" aria-label={t('Növbəti')}>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Desktop thumbnails overlapping the slide */}
                  <div className="hidden lg:flex absolute inset-x-0 -bottom-24 z-20 justify-center gap-4 px-16">
                    {slides.map((s, i) => (
                      <button key={s.id} onClick={() => go(i)} className={`w-[min(17%,240px)] shrink text-left rounded-xl overflow-hidden bg-bg-sec border transition-all duration-300 ${i === active ? 'border-accent shadow-xl -translate-y-1 led-glow' : 'border-bg-border hover:border-text-sec hover:-translate-y-0.5'}`} aria-label={titleOf(s)}>
                        <div className="aspect-video bg-bg-card overflow-hidden">
                          {s.image ? <img src={s.image} alt="" className="w-full h-full object-cover" loading="lazy" /> : s.intro ? <img src="/Logo.JPG.jpeg" alt="" className="w-full h-full object-contain p-3" /> : null}
                        </div>
                        <p className={`p-3 text-[13px] font-semibold leading-snug line-clamp-3 min-h-[4.6em] ${i === active ? 'text-text-main' : 'text-text-sec'}`}>{titleOf(s)}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* phones / tablets: next match + last result under the slider (the slide itself is too small for them) */}
        {!loading && (
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <NextMatchCard />
            <LastResultCard />
          </div>
        )}

        {count > 1 && (
          <div className="lg:hidden flex justify-center gap-2 mt-4" role="tablist">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => go(i)} className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-7 led-bar' : 'w-2 bg-bg-border'}`} aria-label={`${i + 1}`} aria-selected={i === active} role="tab" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
