'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LangSwitcher({ lang, setLang }: { lang: string, setLang: (l: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const langs = [
    { code: 'AZ', label: 'Azərbaycanca' },
    { code: 'EN', label: 'English' },
    { code: 'RU', label: 'Русский' }
  ];

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--ks-kinpaku)] transition-all group"
      >
        <svg className="w-5 h-5 text-white/70 group-hover:text-[var(--ks-kinpaku)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-36 bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                  // Quick hack to force re-render across the app if needed, usually we'd use Context
                  document.cookie = `NEXT_LOCALE=${l.code}; path=/`;
                  router.refresh();
                }}
                className={`flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors ${lang === l.code ? 'bg-[var(--ks-kinpaku)]/10 text-[var(--ks-kinpaku)]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              >
                {l.label}
                {lang === l.code && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
