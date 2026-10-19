'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

import Image from 'next/image';
import { socials } from '@/components/SocialIcons';
import { useLang } from '@/lib/i18n';
import { useSyncVersion } from '@/lib/siteSync';
import { CONTACT_DEFAULTS, telHref, useSiteTexts } from '@/lib/siteTexts';

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
  const contact = useSiteTexts(CONTACT_DEFAULTS);

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
              <a href={telHref(contact.contact_phone)} className="text-text-main font-medium text-sm hover:text-accent hover:translate-x-1 transition-all flex items-center space-x-2">
                <span>{contact.contact_phone}</span> <span className="text-text-sec text-xs">(WhatsApp)</span>
              </a>
              <a href={`mailto:${contact.contact_email}`} className="text-text-main font-medium text-sm hover:text-accent transition-colors">
                {contact.contact_email}
              </a>
              <p className="text-text-sec font-medium text-xs leading-relaxed mt-2 whitespace-pre-line">
                {contact.contact_address}
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="text-accent font-bold text-xs md:text-sm tracking-widest uppercase">Sosial Media</span>
              <div className="flex flex-col space-y-2">
                {socials.map(({ name, href, Icon }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="text-text-main font-medium text-sm hover:text-accent hover:translate-x-1 transition-all flex items-center space-x-2">
                    <Icon className="w-[18px] h-[18px]" /> <span>{name}</span>
                  </a>
                ))}
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
