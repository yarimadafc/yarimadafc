import Link from 'next/link';

const tabs = [
  { key: 'fixtures', label: 'Təqvim', href: '/matches' },
  { key: 'results', label: 'Nəticələr', href: '/matches?tab=results' },
  { key: 'standings', label: 'Turnir cədvəli', href: '/standings' },
];

// Page frame shared by /matches and /standings (title + side tabs).
export default function MatchesShell({ active, children }: { active: 'fixtures' | 'results' | 'standings'; children: React.ReactNode }) {
  return (
    <div className="pt-[120px] xl:pt-[150px] pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <span className="block w-12 h-[3px] bg-accent mb-4" aria-hidden />
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main mb-8 md:mb-10">Matçlar</h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <nav aria-label="Oyunlar bölməsi" className="lg:w-72 shrink-0">
            <ul className="flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-visible lg:bg-bg-sec lg:rounded-xl lg:border lg:border-bg-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map(t => (
                <li key={t.key} className="shrink-0 lg:border-b last:border-b-0 border-bg-border">
                  <Link
                    href={t.href}
                    aria-current={active === t.key ? 'page' : undefined}
                    className={`block px-5 py-3 lg:py-5 rounded-lg lg:rounded-none text-sm lg:text-base font-bold transition-colors whitespace-nowrap ${active === t.key ? 'bg-bg-card lg:bg-transparent text-text-main' : 'bg-bg-sec lg:bg-transparent text-text-sec hover:text-text-main'}`}
                  >
                    {t.label}
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
