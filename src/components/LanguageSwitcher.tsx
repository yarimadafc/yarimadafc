'use client';
import { LANGS, useLang } from '@/lib/i18n';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center rounded-full border border-bg-border p-0.5 ${className}`} role="group" aria-label="Language">
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 ${lang === l.code ? 'bg-accent text-on-accent shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_45%,transparent)]' : 'text-text-sec hover:text-text-main'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
