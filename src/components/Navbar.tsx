'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, Sun, Moon, Play } from 'lucide-react';
import NextMatchStrip from '@/components/NextMatchStrip';

// `wide` items sit in the "Daha çox" dropdown until the screen is >= 2xl.
const menuItems: { name: string; href: string; wide?: boolean }[] = [
  { name: 'Xəbərlər', href: '/news' },
  { name: 'Komandalar', href: '/teams' },
  { name: 'Klub', href: '/club' },
  { name: 'Akademiya', href: '/academy' },
  { name: 'Oyunlar', href: '/matches' },
  { name: 'Tarix', href: '/history', wide: true },
  { name: 'Sosial media', href: '/social', wide: true },
  { name: 'Sponsorlar', href: '/sponsors', wide: true },
  { name: 'Biletlər', href: '/tickets' },
  { name: 'Mağaza', href: '/shop' },
];

const tvItem = { name: 'Yarımada TV', href: '/media' };

const moreItems = [
  { name: 'Məşqçilər', href: '/coaches' },
  { name: 'Transferlər', href: '/transfers' },
  { name: 'Məşqçi kursu', href: '/courses' },
  { name: 'Turnir cədvəli', href: '/standings' },
  { name: 'Əlaqə', href: '/contact' },
];

const socials = [
  { name: 'Instagram', href: 'https://www.instagram.com/yarimada_fk/' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590640762611' },
  { name: 'YouTube', href: 'https://www.youtube.com/@yarimada_fk' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@yarimadafk' },
  { name: 'Telegram', href: 'https://t.me/yarimadafk' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    try { setTheme(localStorage.getItem('theme') || 'dark'); } catch { /* ignore */ }
  }, []);

  // close overlays on navigation
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // lock page scroll while the mobile menu is open
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
    `relative whitespace-nowrap text-[13px] 2xl:text-sm font-semibold transition-colors ${isActive(href) ? 'text-text-main' : 'text-text-sec hover:text-text-main'}`;

  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 bg-bg-main/95 backdrop-blur-md border-b border-bg-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-stretch">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 py-2 xl:py-3 xl:pr-8 shrink-0" aria-label="Yarımada FK - ana səhifə">
            <span className="relative w-10 h-10 xl:w-14 xl:h-14 rounded-full overflow-hidden border-2 border-accent shrink-0">
              <Image src="/Logo.JPG.jpeg" alt="Yarımada FK" fill sizes="56px" className="object-cover" priority />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-lg xl:text-2xl font-bold tracking-tight text-text-main whitespace-nowrap">Yarımada FK</span>
              <span className="hidden xl:block mt-1.5 text-[10px] tracking-[0.3em] uppercase text-text-sec">Rəsmi veb sayt</span>
            </span>
          </Link>

          {/* Desktop: two rows */}
          <div className="hidden xl:flex flex-1 min-w-0 flex-col">
            <div className="flex items-center justify-between gap-6 h-12 border-b border-bg-border">
              <div className="min-w-0 flex-1"><NextMatchStrip /></div>
              <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-bg-border h-full">
                <button onClick={toggleTheme} className="text-text-sec hover:text-text-main transition-colors p-1.5" aria-label="Rejimi dəyiş">
                  <ThemeIcon className="w-[18px] h-[18px]" />
                </button>
                <Link href="/contact" className="bg-accent text-on-accent hover:opacity-90 transition-opacity font-bold text-xs px-5 py-2 rounded-full whitespace-nowrap">
                  Bizə qoşul
                </Link>
              </div>
            </div>

            <nav className="flex items-center justify-between h-12 gap-4" aria-label="Əsas menyu">
              <div className="flex items-center gap-5 2xl:gap-6 min-w-0">
                {menuItems.map(item => (
                  <Link key={item.href} href={item.href} className={`${linkClass(item.href)} ${item.wide ? 'hidden 2xl:inline' : ''}`}>
                    {item.name}
                    {isActive(item.href) && <span className="absolute -bottom-[15px] left-0 right-0 h-[2px] bg-accent" />}
                  </Link>
                ))}
                <Link href={tvItem.href} className={`${linkClass(tvItem.href)} flex items-center gap-1.5`}>
                  <Play className="w-4 h-4 fill-current" />
                  {tvItem.name}
                </Link>
                <div className="relative shrink-0" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
                  <button
                    onClick={() => setMoreOpen(o => !o)}
                    className="flex items-center gap-1 text-[13px] 2xl:text-sm font-semibold text-text-sec hover:text-text-main transition-colors whitespace-nowrap"
                    aria-expanded={moreOpen}
                  >
                    Daha çox <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {moreOpen && (
                    <div className="absolute right-0 top-full pt-3 z-50">
                      <div className="min-w-[200px] bg-bg-sec border border-bg-border rounded-xl py-2 shadow-2xl">
                        {menuItems.filter(i => i.wide).map(item => (
                          <Link key={item.href} href={item.href} className="2xl:hidden block px-5 py-2.5 text-sm font-medium text-text-sec hover:text-text-main hover:bg-bg-card transition-colors">
                            {item.name}
                          </Link>
                        ))}
                        {moreItems.map(item => (
                          <Link key={item.href} href={item.href} className="block px-5 py-2.5 text-sm font-medium text-text-sec hover:text-text-main hover:bg-bg-card transition-colors">
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setIsSearchOpen(o => !o)} className="text-text-main hover:text-accent transition-colors p-1.5 shrink-0 ml-2" aria-label="Axtarış">
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </nav>
          </div>

          {/* Mobile / tablet controls */}
          <div className="xl:hidden ml-auto flex items-center gap-1">
            <button onClick={() => setIsSearchOpen(o => !o)} className="text-text-main p-2.5" aria-label="Axtarış">
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <button onClick={toggleTheme} className="text-text-main p-2.5" aria-label="Rejimi dəyiş">
              <ThemeIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setIsOpen(o => !o)} className="text-text-main p-2.5 -mr-2.5" aria-label={isOpen ? 'Menyunu bağla' : 'Menyunu aç'} aria-expanded={isOpen}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: slim next-match bar */}
      <div className="xl:hidden h-8 border-t border-bg-border bg-bg-sec/60">
        <NextMatchStrip compact />
      </div>

      {/* Search */}
      {isSearchOpen && (
        <div className="bg-bg-sec border-t border-bg-border">
          <form onSubmit={handleSearch} className="container mx-auto px-4 lg:px-8 py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-sec" />
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Saytda axtarış..."
                className="w-full bg-bg-main text-text-main border border-bg-border rounded-xl py-3 pl-12 pr-24 text-base focus:outline-none focus:border-accent transition-colors"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-on-accent px-4 py-1.5 rounded-lg font-bold text-sm">
                Axtar
              </button>
            </div>
          </form>
        </div>
      )}

    </header>

      {/* Mobile menu */}
      {isOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[90px] bottom-0 z-40 bg-bg-main overflow-y-auto overscroll-contain border-t border-bg-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col" aria-label="Mobil menyu">
              {[...menuItems, tvItem, ...moreItems].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between py-4 border-b border-bg-border text-lg font-semibold transition-colors ${isActive(item.href) ? 'text-text-main' : 'text-text-sec'}`}
                >
                  {item.name}
                  {isActive(item.href) && <span className="w-2 h-2 rounded-full bg-accent" />}
                </Link>
              ))}
            </nav>
            <Link href="/contact" className="mt-6 block w-full text-center bg-accent text-on-accent font-bold py-4 rounded-xl">
              Bizə qoşul
            </Link>
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center mt-8 pb-8 text-sm text-text-sec">
              {socials.map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-text-main transition-colors">{s.name}</a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
