'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState('AZ');

  const navLinks = [
    { name: 'Klub', href: '/klub' },
    { name: 'Komandalar', href: '/komandalar' },
    { name: 'Oyunlar', href: '/oyunlar' },
    { name: 'Turnir', href: '/turnir-cedveli' },
    { name: 'Xəbərlər', href: '/xeberler' },
    { name: 'Media', href: '/media' },
    { name: 'Məşqçilər', href: '/mesqciler' },
    { name: 'Əlaqə', href: '/elaqe' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[1.5rem] px-5 py-3 flex items-center gap-4 xl:gap-8 w-full max-w-[1400px] justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-8 h-8 xl:w-10 xl:h-10 rounded-full overflow-hidden border border-white/20 group-hover:border-[var(--ks-kinpaku)] transition-colors">
              <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
            </div>
            <span className="text-white font-black text-sm xl:text-base uppercase tracking-widest hidden sm:block">
              Yarımada FC
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-white/80 hover:text-white hover:text-[var(--ks-kinpaku)] font-medium text-[12px] xl:text-[13px] transition-all whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3 xl:gap-4 shrink-0">
            {/* Lang Switcher */}
            <div className="hidden md:flex gap-1 text-xs font-bold text-white/50">
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

            {/* Social Icons (Simple SVGs) */}
            <div className="hidden md:flex gap-2">
              <Link href="https://instagram.com" target="_blank" className="text-white/70 hover:text-[var(--ks-kinpaku)] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </Link>
              <Link href="https://facebook.com" target="_blank" className="text-white/70 hover:text-[var(--ks-kinpaku)] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </Link>
              <Link href="https://youtube.com" target="_blank" className="text-white/70 hover:text-[var(--ks-kinpaku)] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </Link>
            </div>

            <Link 
              href="/qeydiyyat" 
              className="ks-button !bg-white !text-[#0a1628] !border-none hover:!bg-[var(--ks-kinpaku)] !min-h-[36px] xl:!min-h-[40px] !px-4 xl:!px-6 !text-[12px] xl:!text-[13px] !rounded-full !font-bold shadow-sm whitespace-nowrap"
            >
              Bizə Qoşul
            </Link>
            <button 
              className="ml-2 lg:hidden text-white shrink-0 p-1"
              onClick={() => setMobileOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[60] bg-[#0a1628] p-4 flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--ks-kinpaku)]">
                  <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
                </div>
                <span className="text-white font-black text-lg uppercase tracking-widest">
                  Yarımada FC
                </span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-5 flex-grow justify-center pb-12">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-white text-3xl font-black font-condensed uppercase tracking-wide hover:text-[var(--ks-kinpaku)] transition-colors">Ana Səhifə</Link>
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-3xl font-black font-condensed uppercase tracking-wide hover:text-[var(--ks-kinpaku)] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-4 flex gap-4 text-xl font-bold text-white/50">
                {['AZ', 'RU', 'EN'].map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`hover:text-white transition-colors ${lang === l ? 'text-white border-b-2 border-[var(--ks-kinpaku)]' : ''}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <Link 
                href="/qeydiyyat" 
                onClick={() => setMobileOpen(false)}
                className="mt-6 ks-button ks-button-primary w-full !rounded-xl !py-4 !bg-[var(--ks-kinpaku)] !text-[#0a1628] !font-black !text-lg uppercase tracking-widest"
              >
                Akademiyaya Qoşul
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
