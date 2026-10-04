'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState('AZ');
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'Klub', href: '/klub' },
    { name: 'Komandalar', href: '/komandalar' },
    { name: 'Oyunlar', href: '/oyunlar' },
    { name: 'Təqvim', href: '/teqvim' },
    { name: 'Turnir', href: '/turnir-cedveli' },
    { name: 'Xəbərlər', href: '/xeberler' },
    { name: 'Media', href: '/media' },
    { name: 'Məşqçilər', href: '/mesqciler' },
    { name: 'Əlaqə', href: '/elaqe' },
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
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] flex items-center justify-between w-full max-w-[1200px] py-3 px-6 md:px-8">
          
          {/* Logo Section */}
          <Link href="/" onClick={handleLogoClick} className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/20 group-hover:border-[var(--ks-kinpaku)] transition-all duration-500">
              <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
            </div>
            <span className="text-white font-black font-condensed uppercase tracking-wider text-xl md:text-2xl mt-1 hidden lg:block group-hover:text-[var(--ks-kinpaku)] transition-colors">
              Yarımada FC
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden xl:flex items-center justify-center gap-5 flex-1 mx-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`uppercase font-bold tracking-wider transition-all duration-300 text-[12px] whitespace-nowrap ${pathname === link.href ? 'text-[var(--ks-kinpaku)]' : 'text-white/70 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Lang Switcher */}
            <div className="hidden md:flex gap-2 text-[11px] font-black uppercase text-white/40 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              {['AZ', 'RU', 'EN'].map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  className={`hover:text-white transition-colors ${lang === l ? 'text-white' : ''}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <Link 
              href="/qeydiyyat" 
              className="ks-button !bg-[var(--ks-kinpaku)] !text-white !border-none hover:!bg-[#b39542] !rounded-full !font-black uppercase tracking-widest shadow-sm transition-all duration-300 hidden sm:flex !min-h-[40px] !px-6 !text-[12px]"
            >
              QEYDİYYAT
            </Link>

            {/* Mobile / Tablet Menu Button */}
            <button 
              className="xl:hidden text-white shrink-0 p-2 ml-2 bg-white/10 rounded-full border border-white/20"
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
            initial={{ opacity: 0, y: -20, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.98, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-[#0a1628]/95 backdrop-blur-2xl p-6 flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10 shrink-0 border-b border-white/10 pb-6">
              <Link href="/" onClick={(e) => { handleLogoClick(e); setMobileOpen(false); }} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--ks-kinpaku)] shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                  <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
                </div>
                <span className="text-white font-black font-condensed text-3xl uppercase tracking-wider mt-1">
                  Yarımada FC
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-3 bg-white/10 rounded-full border border-white/20 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-6 flex-grow justify-center items-center pb-12 text-center">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-white text-4xl font-black font-condensed uppercase tracking-widest hover:text-[var(--ks-kinpaku)] transition-colors">Ana Səhifə</Link>
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-4xl font-black font-condensed uppercase tracking-widest hover:text-[var(--ks-kinpaku)] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-8 flex gap-6 text-2xl font-black uppercase text-white/30 bg-white/5 px-8 py-3 rounded-full">
                {['AZ', 'RU', 'EN'].map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`hover:text-white transition-colors ${lang === l ? 'text-[var(--ks-kinpaku)]' : ''}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <Link 
                href="/qeydiyyat" 
                onClick={() => setMobileOpen(false)}
                className="mt-10 ks-button !w-full max-w-sm !rounded-full !py-5 !bg-[var(--ks-kinpaku)] !text-white !font-black !text-xl uppercase tracking-widest"
              >
                QEYDİYYAT
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
