'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, Sun, Moon, Phone } from 'lucide-react';
import NextMatchStrip from '@/components/NextMatchStrip';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SocialLinks } from '@/components/SocialIcons';
import { useLang } from '@/lib/i18n';

type Item = { name: string; href: string; wide?: boolean };

// `wide` items move into the "Daha çox" dropdown on smaller desktops.
const menuItems: Item[] = [
  { name: 'Xəbərlər', href: '/news' },
  { name: 'Komandalar', href: '/teams' },
  { name: 'Klub', href: '/club' },
  { name: 'Akademiya', href: '/academy' },
  { name: 'Oyunlar', href: '/matches' },
  { name: 'Turnir cədvəli', href: '/standings' },
  { name: 'Mağaza', href: '/shop' },
  { name: 'Media', href: '/media', wide: true },
  { name: 'Məşqçilər', href: '/coaches', wide: true },
  { name: 'Tarix', href: '/history', wide: true },
  { name: 'Sosial media', href: '/social', wide: true },
  { name: 'Sponsorlar', href: '/sponsors', wide: true },
  { name: 'Biletlər', href: '/tickets', wide: true },
];

const moreItems: Item[] = [
  { name: 'Transferlər', href: '/transfers' },
  { name: 'Məşqçi kursu', href: '/courses' },
  { name: 'Əlaqə', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale } = useLang();
  const headerRef = useRef<HTMLElement>(null);
  const [headerH, setHeaderH] = useState(120);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  const [scrolled, setScrolled] = useState(false);
  const [clock, setClock] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    try { setTheme(localStorage.getItem('theme') || 'dark'); } catch { /* ignore */ }
  }, []);

  // live date + clock (localized)
  useEffect(() => {
    const AZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
    const AZ_DAYS = ['bazar', 'bazar ertəsi', 'çərşənbə axşamı', 'çərşənbə', 'cümə axşamı', 'cümə', 'şənbə'];
    const intl = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
    const fmtDate = (d: Date) => (locale === 'az-AZ' ? `${d.getDate()} ${AZ_MONTHS[d.getMonth()]} ${d.getFullYear()} • ${AZ_DAYS[d.getDay()]}` : intl.format(d));
    const tick = () => {
      const d = new Date();
      setClock({ date: fmtDate(d), time: d.toLocaleTimeString(locale, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [locale]);

  // collapse the top bar / match strip once the page is scrolled
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 40));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  // keep the mobile menu aligned under the header whatever its current height
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeaderH(el.getBoundingClientRect().height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setIsSearchOpen(false);
    setIsOpen(false);
  };

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const linkClass = (href: string) =>
    `relative whitespace-nowrap text-[13px] 2xl:text-sm font-semibold transition-all duration-300 hover:-translate-y-px ${isActive(href) ? 'text-text-main' : 'text-text-sec hover:text-text-main'}`;
  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 bg-bg-main/95 backdrop-blur-md shadow-[0_8px_30px_-12px_rgba(0,0,0,.6)] animate-[slide-down_.8s_ease-out_both]">
        {/* Top bar: phone, date, clock | slogan, social, language */}
        <div className="bg-bg-deep border-b border-bg-border">
          <div className="container flex items-center justify-between gap-4 h-9 text-[12px]">
            <div className="flex items-center gap-4 min-w-0 flex-1 text-text-sec">
              <a href="tel:0554477467" className="hidden sm:flex items-center gap-2 font-bold tracking-wider hover:text-accent transition-colors whitespace-nowrap">
                <Phone className="w-3.5 h-3.5" /> 055 447 74 67
              </a>
              <span className="hidden sm:block w-px h-4 bg-bg-border" />
              <span className="flex items-center gap-2 text-accent font-semibold min-w-0 flex-1 whitespace-nowrap overflow-hidden" suppressHydrationWarning>
                <span className="truncate capitalize">{clock?.date}</span>
                <span className="text-bg-border">|</span>
                <span className="text-text-main tabular-nums shrink-0">{clock?.time}</span>
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="hidden 2xl:block text-accent font-semibold tracking-wide pr-4 border-r border-bg-border">{t('Gələcəyin çempionları burada yetişir!')}</span>
              <SocialLinks className="hidden xl:flex" iconClass="w-4 h-4" gap="gap-4" />
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="flex items-stretch">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 py-2 xl:py-3 xl:pr-8 shrink-0 group" aria-label="Yarımada FK">
              <span className="relative w-10 h-10 xl:w-14 xl:h-14 rounded-full overflow-hidden border-2 border-accent shrink-0 transition-transform duration-500 group-hover:rotate-[360deg] led-glow">
                <Image src="/Logo.JPG.jpeg" alt="Yarımada FK" fill sizes="56px" className="object-cover" priority />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-lg xl:text-2xl font-bold tracking-tight text-text-main whitespace-nowrap">Yarımada FK</span>
                <span className="hidden xl:block mt-1.5 text-[10px] tracking-[0.3em] uppercase text-text-sec">{t('Rəsmi veb sayt')}</span>
              </span>
            </Link>

            {/* Desktop: match strip row + menu row */}
            <div className="hidden xl:flex flex-1 min-w-0 flex-col">
              <div className="flex items-center justify-between gap-6 h-12 border-b border-bg-border">
                <div className="min-w-0 flex-1"><NextMatchStrip /></div>
                <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-bg-border h-full">
                  <button onClick={toggleTheme} className="text-text-sec hover:text-text-main hover:rotate-45 transition-all duration-300 p-1.5" aria-label={t('Rejimi dəyiş')}>
                    <ThemeIcon className="w-[18px] h-[18px]" />
                  </button>
                  <Link href="/contact" className="btn-fx led-border bg-accent text-on-accent font-bold text-xs px-5 py-2 rounded-full whitespace-nowrap">
                    {t('Bizə qoşul')}
                  </Link>
                </div>
              </div>

              <nav className="flex items-center justify-between h-12 gap-4" aria-label="Main">
                <div className="flex items-center gap-5 2xl:gap-6 min-w-0">
                  {menuItems.map(item => (
                    <Link key={item.href} href={item.href} className={`${linkClass(item.href)} ${item.wide ? 'hidden 2xl:inline' : ''}`}>
                      {t(item.name)}
                      <span className={`absolute -bottom-[15px] left-0 right-0 h-[2px] led-bar origin-left transition-transform duration-300 ${isActive(item.href) ? 'scale-x-100' : 'scale-x-0'}`} />
                    </Link>
                  ))}
                  <div className="relative shrink-0" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
                    <button onClick={() => setMoreOpen(o => !o)} className="flex items-center gap-1 text-[13px] 2xl:text-sm font-semibold text-text-sec hover:text-text-main transition-colors whitespace-nowrap" aria-expanded={moreOpen}>
                      {t('Daha çox')} <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {moreOpen && (
                      <div className="absolute right-0 top-full pt-3 z-50">
                        <div className="min-w-[210px] bg-bg-sec border border-bg-border rounded-xl py-2 shadow-2xl animate-[fade-in_.2s_ease-out_both]">
                          {menuItems.filter(i => i.wide).map(item => (
                            <Link key={item.href} href={item.href} className="2xl:hidden block px-5 py-2.5 text-sm font-medium text-text-sec hover:text-text-main hover:bg-bg-card hover:pl-6 transition-all">{t(item.name)}</Link>
                          ))}
                          {moreItems.map(item => (
                            <Link key={item.href} href={item.href} className="block px-5 py-2.5 text-sm font-medium text-text-sec hover:text-text-main hover:bg-bg-card hover:pl-6 transition-all">{t(item.name)}</Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => setIsSearchOpen(o => !o)} className="text-text-main hover:text-accent hover:scale-110 transition-all p-1.5 shrink-0 ml-2" aria-label={t('Axtarış')}>
                  {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </button>
              </nav>
            </div>

            {/* Mobile / tablet controls */}
            <div className="xl:hidden ml-auto flex items-center gap-1">
              <button onClick={() => setIsSearchOpen(o => !o)} className="text-text-main p-2.5" aria-label={t('Axtarış')}>
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
              <button onClick={toggleTheme} className="text-text-main p-2.5" aria-label={t('Rejimi dəyiş')}>
                <ThemeIcon className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(o => !o)} className="text-text-main p-2.5 -mr-2.5" aria-label={isOpen ? t('Menyunu bağla') : t('Menyunu aç')} aria-expanded={isOpen}>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: slim next-match bar (collapses on scroll) */}
        <div className={`xl:hidden border-t border-bg-border bg-bg-sec/60 ${scrolled ? 'max-h-0 opacity-0 overflow-hidden' : 'h-8 opacity-100'} transition-all duration-300`}>
          <NextMatchStrip compact />
        </div>

        {/* animated LED line under the header */}
        <div className="h-[2px] led-bar" aria-hidden />

        {isSearchOpen && (
          <div className="bg-bg-sec border-t border-bg-border">
            <form onSubmit={handleSearch} className="container py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-sec" />
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('Saytda axtarış...')}
                  className="w-full bg-bg-main text-text-main border border-bg-border rounded-xl py-3 pl-12 pr-28 text-base focus:outline-none focus:border-accent transition-colors"
                />
                <button type="submit" className="btn-fx absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-on-accent px-4 py-1.5 rounded-lg font-bold text-sm">{t('Axtar')}</button>
              </div>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu (outside the blurred header so `fixed` works) */}
      {isOpen && (
        <div className="xl:hidden fixed inset-x-0 bottom-0 z-40 bg-bg-main overflow-y-auto overscroll-contain border-t border-bg-border animate-[fade-in_.25s_ease-out_both]" style={{ top: headerH }}>
          <div className="container py-4">
            <nav className="flex flex-col" aria-label="Mobile">
              {[...menuItems, ...moreItems].map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`flex items-center justify-between py-4 border-b border-bg-border text-lg font-semibold animate-[fade-in_.4s_ease-out_both] ${isActive(item.href) ? 'text-text-main' : 'text-text-sec'}`}
                >
                  {t(item.name)}
                  {isActive(item.href) && <span className="w-2 h-2 rounded-full bg-accent led-glow" />}
                </Link>
              ))}
            </nav>
            <Link href="/contact" className="btn-fx led-border mt-6 block w-full text-center bg-accent text-on-accent font-bold py-4 rounded-xl">{t('Bizə qoşul')}</Link>
            <div className="flex flex-col items-center gap-5 mt-8 pb-10">
              <a href="tel:0554477467" className="flex items-center gap-2 text-text-sec font-bold tracking-wider"><Phone className="w-4 h-4" /> 055 447 74 67</a>
              <SocialLinks iconClass="w-6 h-6" gap="gap-7" />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
