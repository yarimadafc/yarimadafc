'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

import Image from 'next/image';
import { Send, Music2, MessageCircle } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useSyncVersion } from '@/lib/siteSync';

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const FALLBACK_SPONSORS = ['SOCAR', 'PALMS SPORTS', 'KAPPA', 'ADQ', 'SEA BREEZE'];

// Endless sponsor strip. One "set" is repeated until it is wider than the screen, and the strip holds two
// identical sets that slide by exactly one set's width, so it never has an empty gap — even with a single sponsor.
function SponsorMarquee({ sponsors }: { sponsors: any[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(1);
  const [unit, setUnit] = useState(0); // width of one set, for a constant scroll speed
  const items: { key: string; node: React.ReactNode }[] = sponsors.length > 0
    ? sponsors.map(s => ({
        key: s.id,
        node: s.logo_url
          ? <img src={s.logo_url} alt={s.name} className="h-10 md:h-14 w-auto max-w-[220px] object-contain transition-transform duration-300 hover:scale-105" />
          : <span className="text-text-main/70 hover:text-text-main transition-colors text-lg font-black uppercase tracking-widest">{s.name}</span>,
      }))
    : FALLBACK_SPONSORS.map(n => ({ key: n, node: <span className="text-text-main text-base font-bold uppercase tracking-widest">{n}</span> }));
  const signature = items.map(i => i.key).join('|');

  useEffect(() => {
    const wrap = wrapRef.current, set = setRef.current;
    if (!wrap || !set) return;
    const measure = () => {
      const one = set.scrollWidth / repeat; // width of a single pass over the sponsors
      if (!one) return;
      const need = Math.max(1, Math.ceil(wrap.clientWidth / one));
      setRepeat(r => (r === need ? r : need));
      setUnit(one * need);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    set.querySelectorAll('img').forEach(img => img.addEventListener('load', measure));
    return () => ro.disconnect();
  }, [signature, repeat]);

  const renderSet = (id: string) => (
    <div ref={id === 'a' ? setRef : undefined} className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={id === 'b'}>
      {Array.from({ length: repeat }).flatMap((_, r) =>
        items.map(i => <div key={`${id}-${r}-${i.key}`} className="shrink-0 flex items-center">{i.node}</div>))}
    </div>
  );

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden whitespace-nowrap">
      <div
        className="flex w-max hover:[animation-play-state:paused]"
        style={{ animation: `marquee ${Math.max(12, unit / 70)}s linear infinite` }}
      >
        {renderSet('a')}
        {renderSet('b')}
      </div>
    </div>
  );
}

export default function Footer() {
  const { t } = useLang();
  const [sponsors, setSponsors] = useState<any[]>([]);

  const sync = useSyncVersion();
  useEffect(() => {
    async function fetchSponsors() {
      const { data } = await supabase.from('sponsors').select('*').order('created_at', { ascending: true });
      if (data) setSponsors(data);
    }
    fetchSponsors();
  }, [sync]);

  return (
    <footer className="w-full bg-bg-main pt-0 pb-8 overflow-hidden">
      <div className="led-bar h-[2px] w-full mb-8" aria-hidden />
      {/* Sponsors Section - Marquee */}
      <div className="w-full border-b border-bg-border/50 pb-6 mb-10 overflow-hidden">
        <div className="container mb-4">
          <h3 className="text-text-sec font-bold tracking-widest text-xs uppercase flex items-center">
            <span className="w-8 h-[1px] bg-accent mr-3"></span>
            SPONSORLAR
          </h3>
        </div>
        <SponsorMarquee sponsors={sponsors} />
      </div>

      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 pt-12 border-t border-bg-border/50">
          
          {/* Logo & Slogan */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start md:items-center lg:items-start gap-5">
            <Link href="/" className="flex items-center gap-4 group" aria-label="Yarımada FK">
               <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-accent shrink-0 led-glow">
                 <Image src="/Logo.JPG.jpeg" alt="Yarımada FK" fill sizes="80px" className="object-cover" />
               </div>
               <span className="flex flex-col leading-none">
                 <span className="text-xl md:text-2xl font-extrabold tracking-tight text-text-main">Yarımada FK</span>
                 <span className="mt-1.5 text-[10px] font-semibold tracking-[0.25em] uppercase text-text-sec">{t('Uşaq futbol akademiyası')}</span>
               </span>
            </Link>
            <p className="max-w-xs text-text-sec text-sm leading-relaxed md:text-center lg:text-left">
              {t('Xırdalanda uşaq və yeniyetmələr üçün futbol akademiyası. Yaş qruplarına uyğun məşqlər, təcrübəli məşqçilər və rəsmi turnirlərdə oyun təcrübəsi.')}
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col space-y-3 md:space-y-4 col-span-1">
            <Link href="/news" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Xəbərlər</Link>
            <Link href="/club" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Haqqımızda</Link>
            <Link href="/matches" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Oyunlar</Link>
            <Link href="/stats" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Statistika</Link>
            <Link href="/social" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Sosial media</Link>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col space-y-3 md:space-y-4 col-span-1">
            <Link href="/teams" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Komandalar</Link>
            <Link href="/academy" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Akademiya</Link>
            <Link href="/courses" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Məşqçi Kursu</Link>
            <Link href="/transfers" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Transferlər</Link>
            <Link href="/sponsors" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Sponsorlar</Link>
            <Link href="/shop" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Mağaza</Link>
            <Link href="/privacy" className="inline-block text-text-main font-bold text-xs md:text-sm hover:text-accent hover:translate-x-1 transition-all duration-300">Məxfilik siyasəti</Link>
          </div>

          {/* Contact & Address */}
          <div className="col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-3">
              <span className="text-accent font-bold text-xs md:text-sm tracking-widest uppercase">Əlaqə</span>
              <a href="tel:+994504671321" className="text-text-main font-medium text-sm hover:text-accent hover:translate-x-1 transition-all flex items-center space-x-2">
                <span>055 447 74 67</span> <span className="text-text-sec text-xs">(WhatsApp)</span>
              </a>
              <a href="mailto:info@yarimadafc.com" className="text-text-main font-medium text-sm hover:text-accent transition-colors">
                info@yarimadafc.com
              </a>
              <p className="text-text-sec font-medium text-xs leading-relaxed mt-2">
                Kristal Abşeron 1,<br />
                Xırdalan şəhəri
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="text-accent font-bold text-xs md:text-sm tracking-widest uppercase">Sosial Media</span>
              <div className="flex flex-col space-y-2">
                <a href="https://www.instagram.com/yarimada_fk/" target="_blank" rel="noopener noreferrer" className="text-text-main font-medium text-sm hover:text-accent hover:translate-x-1 transition-all flex items-center space-x-2">
                   <InstagramIcon /> <span>Instagram</span>
                </a>
                <a href="https://www.youtube.com/@yarimada_fk" target="_blank" rel="noopener noreferrer" className="text-text-main font-medium text-sm hover:text-accent hover:translate-x-1 transition-all flex items-center space-x-2">
                   <YoutubeIcon /> <span>YouTube</span>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61590640762611" target="_blank" rel="noopener noreferrer" className="text-text-main font-medium text-sm hover:text-accent hover:translate-x-1 transition-all flex items-center space-x-2">
                   <FacebookIcon /> <span>Facebook</span>
                </a>
                <a href="https://www.tiktok.com/@yarimadafk" target="_blank" rel="noopener noreferrer" className="text-text-main font-medium text-sm hover:text-accent hover:translate-x-1 transition-all flex items-center space-x-2">
                   <TiktokIcon /> <span>TikTok</span>
                </a>
                <a href="https://t.me/yarimadafk?fbclid=PAZXh0bgNhZW0CMTEAcGRvZgRzcnRjBmFwcF9pZAwyNTYyODEwNDA1NTgAAafK0KsTFGaHEdkdFqPvdB_YUJuYByPtPKvdfmdCKantOLunANZ5C8nrnroI0A_aem_3_m_V6XwTbX1OL0eUZhRoA" target="_blank" rel="noopener noreferrer" className="text-text-main font-medium text-sm hover:text-accent hover:translate-x-1 transition-all flex items-center space-x-2">
                   <TelegramIcon /> <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Socials */}
        <div className="mt-12 flex flex-col items-center justify-center pt-8 border-t border-bg-border/50">
          <div className="text-text-sec font-semibold text-[10px] md:text-xs">
            © {new Date().getFullYear()} Yarımada FK. {t('Bütün hüquqlar qorunur.')}
          </div>
        </div>
      </div>
    </footer>
  );
}
