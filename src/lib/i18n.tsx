'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dictionary } from '@/lib/dictionary';

export type Lang = 'az' | 'en' | 'ru';
export const LANGS: { code: Lang; label: string; locale: string }[] = [
  { code: 'az', label: 'AZ', locale: 'az-AZ' },
  { code: 'en', label: 'EN', locale: 'en-GB' },
  { code: 'ru', label: 'RU', locale: 'ru-RU' },
];

interface Ctx {
  lang: Lang;
  locale: string;
  setLang: (l: Lang) => void;
  /** Translate a UI string written in Azerbaijani. Unknown strings stay as-is. */
  t: (az: string) => string;
  /** Pick `field_en` / `field_ru` from a database row, falling back to Azerbaijani. */
  loc: (row: Record<string, any> | null | undefined, field: string) => string;
}

const LangContext = createContext<Ctx>({
  lang: 'az', locale: 'az-AZ', setLang: () => {}, t: s => s, loc: (row, f) => row?.[`${f}_az`] ?? row?.[f] ?? '',
});

const STORAGE_KEY = 'lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('az');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && LANGS.some(l => l.code === saved)) setLangState(saved);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  const value = useMemo<Ctx>(() => ({
    lang,
    locale: LANGS.find(l => l.code === lang)!.locale,
    setLang,
    t: (az: string) => (lang === 'az' ? az : dictionary[az]?.[lang] ?? az),
    loc: (row, field) => {
      if (!row) return '';
      return (lang !== 'az' && row[`${field}_${lang}`]) || row[`${field}_az`] || row[field] || '';
    },
  }), [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
