'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import LangSwitcher from "./LangSwitcher";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
    if (match && match[1]) {
      
    }
  }, []);


    const getNavLinks = (l: string) => [
    { name: l === 'EN' ? 'Club' : l === 'RU' ? 'Клуб' : 'Klub', href: '/klub' },
    { name: l === 'EN' ? 'Teams' : l === 'RU' ? 'Команды' : 'Komandalar', href: '/komandalar' },
    { name: l === 'EN' ? 'Matches' : l === 'RU' ? 'Матчи' : 'Oyunlar', href: '/oyunlar' },
    { name: l === 'EN' ? 'Calendar' : l === 'RU' ? 'Календарь' : 'Təqvim', href: '/teqvim' },
    { name: l === 'EN' ? 'Standings' : l === 'RU' ? 'Таблица' : 'Turnir', href: '/turnir-cedveli' },
    { name: l === 'EN' ? 'News' : l === 'RU' ? 'Новости' : 'Xəbərlər', href: '/xeberler' },
    { name: l === 'EN' ? 'Media' : l === 'RU' ? 'Медиа' : 'Media', href: '/media' },
    { name: l === 'EN' ? 'Coaches' : l === 'RU' ? 'Тренеры' : 'Məşqçilər', href: '/mesqciler' },
    { name: l === 'EN' ? 'Contact' : l === 'RU' ? 'Контакты' : 'Əlaqə', href: '/elaqe' },
  ];
  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('club'), href: '/klub' },
    { name: t('teams'), href: '/komandalar' },
    { name: t('matches'), href: '/oyunlar' },
    { name: t('coaches'), href: '/mesqciler' },
    { name: t('media'), href: '/media' },
    { name: t('contact'), href: '/elaqe' },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.44, 0, 0.56, 1] }} 
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[3rem] flex items-center justify-between relative w-full max-w-[1350px] py-3 px-4 md:py-4 md:px-8">
          
          {/* LEFT SIDE (Logo + Desktop Text) */}
          <div className="flex items-center gap-3 z-20 shrink-0">
            <Link href="/" onClick={handleLogoClick}>
              <div className="relative w-11 h-11 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[var(--ks-kinpaku)] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:border-white transition-all duration-300 shrink-0">
                <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
              </div>
            </Link>
            <Link href="/" onClick={handleLogoClick} className="block">
              <span className="text-white font-black font-condensed uppercase tracking-wider text-[22px] md:text-lg whitespace-nowrap hover:text-[var(--ks-kinpaku)] transition-colors leading-none mt-1">
                Yarımada FK
              </span>
            </Link>
          </div>

          

          {/* Links */}
          <nav className="hidden xl:flex items-center justify-center gap-5 flex-1 mx-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`uppercase font-black font-condensed tracking-widest transition-all duration-200 text-sm md:text-base whitespace-nowrap font-medium ${pathname === link.href ? 'text-[var(--ks-kinpaku)]' : 'text-white/80 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-2 md:gap-5 shrink-0">
            

            {/* Lang Switcher */}
            <LangSwitcher />

            <div className="hidden lg:block">
              <a 
                href="https://wa.me/994554477467?text=Salam,%20Akademiyaya%20qeydiyyatdan%20keçmək%20istəyirəm." 
                target="_blank"
                className="ks-button !bg-[var(--ks-kinpaku)] !text-white !border-none hover:!bg-[#d7bf7b] !rounded-full !font-black uppercase tracking-widest shadow-sm transition-all duration-200 !min-h-[44px] !px-8 !text-[13px]"
              >
                QEYDİYYAT
              </a>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button 
              className="xl:hidden text-white shrink-0 p-3 ml-2 bg-white/10 rounded-full border border-white/20"
              onClick={() => setMobileOpen(true)}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: [0.44, 0, 0.56, 1] }}
            className="absolute top-[80px] right-4 w-[240px] z-[60] bg-[var(--ks-instrument-deep)] backdrop-blur-3xl p-6 flex flex-col shadow-2xl rounded-2xl border border-white/10"
          >
            <nav className="flex flex-col gap-4 items-start pb-2">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-white text-base font-black font-condensed uppercase tracking-widest hover:text-[var(--ks-kinpaku)] transition-colors w-full text-left">{t('home')}</Link>
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-base font-black font-condensed uppercase tracking-widest hover:text-[var(--ks-kinpaku)] transition-colors w-full text-left"
                >
                  {link.name}
                </Link>
              ))}
              
              <a 
                href="https://wa.me/994554477467?text=Salam,%20Akademiyaya%20qeydiyyatdan%20keçmək%20istəyirəm." 
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="text-[var(--ks-kinpaku)] text-base font-black font-condensed uppercase tracking-widest hover:text-white transition-colors mt-2 w-full text-left"
              >
                QEYDİYYAT
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
