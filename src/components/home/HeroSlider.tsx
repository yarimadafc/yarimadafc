'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Slide = { id: string; image: string; title: string; subtitle?: string; href: string };

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fallback, setFallback] = useState({
    bg: '',
    title1: 'Yeni mövsüm,',
    title2: 'yeni hədəflər',
    subtitle: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!',
  });
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [{ data: slideRows }, { data: newsRows }, { data: site }] = await Promise.all([
        supabase.from('hero_slides').select('*').order('sort_order', { ascending: true }).limit(6),
        supabase.from('news').select('id, title_az, image_url, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('site_images').select('section_key, image_url').in('section_key', ['hero_bg', 'hero_title_1', 'hero_title_2', 'hero_subtitle']),
      ]);
      if (cancelled) return;

      const siteMap: Record<string, string> = {};
      (site || []).forEach((r: any) => { siteMap[r.section_key] = r.image_url; });
      setFallback(f => ({
        bg: siteMap.hero_bg || f.bg,
        title1: siteMap.hero_title_1 || f.title1,
        title2: siteMap.hero_title_2 || f.title2,
        subtitle: siteMap.hero_subtitle || f.subtitle,
      }));

      let list: Slide[] = (slideRows || []).map((s: any) => ({
        id: `s-${s.id}`,
        image: s.image_url || '',
        title: s.title || '',
        subtitle: s.subtitle || '',
        href: s.link_url || '/news',
      }));
      if (list.length === 0) {
        list = (newsRows || []).map((n: any) => ({
          id: `n-${n.id}`,
          image: n.image_url || '',
          title: n.title_az || '',
          href: `/news/${n.id}`,
        }));
      }
      setSlides(list);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const count = slides.length;
  const go = useCallback((i: number) => count && setActive(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => setActive(a => (a + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count, paused]);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; setPaused(true); };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current != null) {
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
    }
    touchX.current = null;
    setPaused(false);
  };

  const frame = 'relative overflow-hidden rounded-2xl bg-bg-sec aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2.2/1]';

  return (
    <section className="pt-[106px] xl:pt-[122px]">
      <div className={`container mx-auto px-4 lg:px-8 ${count > 0 ? 'lg:mb-28' : ''}`}>
        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {loading ? (
            <div className={`${frame} animate-pulse`} aria-hidden />
          ) : count === 0 ? (
            /* Fallback hero: site background + editable texts */
            <div className={`${frame} flex items-end lg:items-center`}>
              {fallback.bg && <img src={fallback.bg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-bg-main via-bg-main/60 to-transparent" />
              <div className="relative z-10 p-6 sm:p-10 lg:p-16 max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-main tracking-tight leading-[1.1]">
                  {fallback.title1} <span className="block">{fallback.title2}</span>
                </h1>
                <p className="mt-4 text-base lg:text-lg text-text-sec max-w-xl">{fallback.subtitle}</p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link href="/academy" className="bg-accent text-on-accent px-8 py-3.5 rounded-xl font-bold text-center hover:opacity-90 transition-opacity">Akademiyaya qoşul</Link>
                  <Link href="/matches" className="border border-bg-border bg-bg-main/60 backdrop-blur text-text-main px-8 py-3.5 rounded-xl font-semibold text-center hover:border-accent transition-colors">Oyunlar cədvəli</Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={frame} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                {slides.map((s, i) => (
                  <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={i !== active}>
                    {s.image && <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-main/90 via-bg-main/10 to-transparent lg:from-bg-main/40" />
                    <Link href={s.href} className="absolute inset-0 z-10" aria-label={s.title} tabIndex={i === active ? 0 : -1} />
                    {/* Title overlay on small screens (thumbnails carry it on desktop) */}
                    <div className="lg:hidden absolute inset-x-0 bottom-0 z-[5] p-5 sm:p-8 pointer-events-none">
                      <h2 className="text-xl sm:text-3xl font-extrabold text-text-main leading-tight line-clamp-3">{s.title}</h2>
                      {s.subtitle && <p className="mt-2 text-sm text-text-sec line-clamp-2">{s.subtitle}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {count > 1 && (
                <>
                  <button onClick={() => go(active - 1)} className="hidden sm:flex absolute left-3 lg:left-5 top-[38%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-bg-main/70 backdrop-blur border border-bg-border items-center justify-center text-text-main hover:bg-bg-main transition-colors" aria-label="Əvvəlki">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => go(active + 1)} className="hidden sm:flex absolute right-3 lg:right-5 top-[38%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-bg-main/70 backdrop-blur border border-bg-border items-center justify-center text-text-main hover:bg-bg-main transition-colors" aria-label="Növbəti">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Desktop thumbnails overlapping the slide */}
              <div className="hidden lg:grid absolute left-1/2 -translate-x-1/2 -bottom-24 z-20 w-[80%] gap-4" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
                {slides.map((s, i) => (
                  <button key={s.id} onClick={() => go(i)} className={`text-left rounded-xl overflow-hidden bg-bg-sec border transition-all ${i === active ? 'border-accent shadow-xl -translate-y-1' : 'border-bg-border hover:border-text-sec'}`} aria-label={s.title}>
                    <div className="aspect-video bg-bg-card overflow-hidden">
                      {s.image && <img src={s.image} alt="" className="w-full h-full object-cover" loading="lazy" />}
                    </div>
                    <p className={`p-3 text-[13px] font-semibold leading-snug line-clamp-3 min-h-[4.6em] ${i === active ? 'text-text-main' : 'text-text-sec'}`}>{s.title}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Mobile / tablet: dots */}
        {count > 1 && (
          <div className="lg:hidden flex justify-center gap-2 mt-4" role="tablist">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => go(i)} className={`h-2 rounded-full transition-all ${i === active ? 'w-6 bg-accent' : 'w-2 bg-bg-border'}`} aria-label={`Slayd ${i + 1}`} aria-selected={i === active} role="tab" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
