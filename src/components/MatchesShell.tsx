'use client';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';

const tabs = [
  { key: 'fixtures', label: 'Təqvim', href: '/matches' },
  { key: 'results', label: 'Nəticələr', href: '/matches?tab=results' },
  { key: 'standings', label: 'Turnir cədvəli', href: '/standings' },
];

// Page frame shared by /matches and /standings (title + side tabs).
export default function MatchesShell({ active, children }: { active: 'fixtures' | 'results' | 'standings'; children: React.ReactNode }) {
  const { t } = useLang();
  return (
    <div className="pt-header pb-20 min-h-screen">
      <div className="container">
        <span className="block w-14 h-[3px] led-bar rounded-full mb-4" aria-hidden />
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-main mb-8 md:mb-10">{t('Matçlar')}</h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <nav aria-label="Matches" className="lg:w-72 xl:w-80 shrink-0">
            <ul className="flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-visible no-scrollbar lg:bg-bg-sec lg:rounded-xl lg:border lg:border-bg-border">
              {tabs.map(tab => (
                <li key={tab.key} className="shrink-0 lg:border-b last:border-b-0 border-bg-border">
                  <Link
                    href={tab.href}
                    aria-current={active === tab.key ? 'page' : undefined}
                    className={`block px-5 py-3 lg:py-5 rounded-lg lg:rounded-none text-sm lg:text-base font-bold transition-all whitespace-nowrap lg:hover:pl-7 ${active === tab.key ? 'bg-bg-card lg:bg-bg-card/60 text-text-main lg:border-l-4 lg:border-accent' : 'bg-bg-sec lg:bg-transparent text-text-sec hover:text-text-main'}`}
                  >
                    {t(tab.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
