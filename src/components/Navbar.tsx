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
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }} 
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[3rem] flex items-center justify-between w-full max-w-[1400px] py-5 px-6 md:px-12">
          
          {/* Logo Section */}
          <Link href="/" onClick={handleLogoClick} className="flex items-center gap-4 shrink-0 group">
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-[var(--ks-kinpaku)] transition-all duration-300">
              <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
            </div>
            <span className="text-white font-black font-condensed uppercase tracking-wider text-2xl md:text-4xl mt-1 hidden lg:block group-hover:text-[var(--ks-kinpaku)] transition-colors">
              Yarımada FC
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden xl:flex items-center justify-center gap-8 flex-1 mx-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`uppercase font-black font-condensed tracking-widest transition-all duration-200 text-lg md:text-xl whitespace-nowrap ${pathname === link.href ? 'text-[var(--ks-kinpaku)]' : 'text-white/80 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Social Icons (Navbar) */}
            <div className="hidden md:flex items-center gap-3">
              <a href="#" className="text-white/50 hover:text-[var(--ks-kinpaku)] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="text-white/50 hover:text-[var(--ks-kinpaku)] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#" className="text-white/50 hover:text-[var(--ks-kinpaku)] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
            </div>

            {/* Lang Switcher */}
            <div className="hidden md:flex gap-2 text-[12px] font-black uppercase text-white/40 bg-white/5 px-4 py-2 rounded-full border border-white/10">
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
              className="ks-button !bg-[var(--ks-kinpaku)] !text-white !border-none hover:!bg-[#b39542] !rounded-full !font-black uppercase tracking-widest shadow-sm transition-all duration-200 hidden sm:flex !min-h-[44px] !px-8 !text-[13px]"
            >
              QEYDİYYAT
            </Link>

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
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[60] bg-[#0a1628]/95 backdrop-blur-2xl p-6 flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8 shrink-0 border-b border-white/10 pb-6">
              <Link href="/" onClick={(e) => { handleLogoClick(e); setMobileOpen(false); }} className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--ks-kinpaku)] shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                  <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
                </div>
                <span className="text-white font-black font-condensed text-2xl uppercase tracking-wider mt-1">
                  Yarımada FC
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-3 bg-white/10 rounded-full border border-white/20 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-4 flex-grow justify-center items-center pb-8 text-center">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-white text-3xl font-black font-condensed uppercase tracking-widest hover:text-[var(--ks-kinpaku)] transition-colors">Ana Səhifə</Link>
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-3xl font-black font-condensed uppercase tracking-widest hover:text-[var(--ks-kinpaku)] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-8 flex gap-6 text-xl font-black uppercase text-white/30 bg-white/5 px-8 py-3 rounded-full">
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

              <div className="mt-6 flex items-center gap-6">
                {/* Social Icons Mobile */}
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[var(--ks-kinpaku)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[var(--ks-kinpaku)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[var(--ks-kinpaku)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>

              <Link 
                href="/qeydiyyat" 
                onClick={() => setMobileOpen(false)}
                className="mt-6 ks-button !w-full max-w-sm !rounded-full !py-4 !bg-[var(--ks-kinpaku)] !text-white !font-black !text-xl uppercase tracking-widest"
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
