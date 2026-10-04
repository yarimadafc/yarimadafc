'use client';
import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/routing';

export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const changeLang = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  const currentLang = locale.toUpperCase();

  return (
    <div className="relative z-50" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 md:gap-2 text-white/90 hover:text-white font-bold text-[13px] md:text-sm tracking-widest px-2 md:px-3 py-1.5 md:py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-all"
      >
        <svg className="w-4 h-4 text-[var(--ks-kinpaku)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {currentLang}
        <svg className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-16 md:w-20 bg-white rounded-xl shadow-xl overflow-hidden py-1 border border-black/5 flex flex-col">
          {['az', 'en', 'ru'].map((l) => (
            // @ts-ignore
            <Link
              key={l}
              href={pathname}
              locale={l}
              onClick={() => setOpen(false)}
              className={`block text-center py-2 md:py-2.5 text-[13px] md:text-sm font-bold tracking-wider transition-colors ${locale === l ? 'bg-[#0a1628] text-[var(--ks-kinpaku)]' : 'text-[#0a1628] hover:bg-gray-100'}`}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
