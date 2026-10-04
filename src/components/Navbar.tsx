'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Klub', href: '/klub' },
    { name: 'Komandalar', href: '/komandalar' },
    { name: 'Oyunlar', href: '/oyunlar' },
    { name: 'Xəbərlər', href: '/xeberler' },
    { name: 'Media', href: '/media' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[1.5rem] px-5 py-3 flex items-center gap-6 md:gap-10 w-full max-w-[1400px] justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:border-[var(--ks-kinpaku)] transition-colors">
              <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
            </div>
            <span className="text-white font-black text-sm uppercase tracking-widest hidden sm:block">
              Yarımada FC
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-white/80 hover:text-white hover:text-[var(--ks-kinpaku)] font-medium text-[13px] transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action */}
          <div className="flex items-center shrink-0">
            <Link 
              href="/qeydiyyat" 
              className="ks-button !bg-white !text-[#0a1628] !border-none hover:!bg-[var(--ks-kinpaku)] !min-h-[40px] !px-6 !text-[13px] !rounded-full !font-bold shadow-sm"
            >
              Akademiyaya Qoşul
            </Link>
            <button 
              className="ml-4 lg:hidden text-white shrink-0 p-1"
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
            className="fixed inset-0 z-[60] bg-[#0a1628] p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
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

            <nav className="flex flex-col gap-6">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-white text-2xl font-black uppercase tracking-widest hover:text-[var(--ks-kinpaku)] transition-colors">Ana Səhifə</Link>
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-2xl font-black uppercase tracking-widest hover:text-[var(--ks-kinpaku)] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/qeydiyyat" 
                onClick={() => setMobileOpen(false)}
                className="mt-8 ks-button ks-button-primary w-full !rounded-xl !py-4 !bg-[var(--ks-kinpaku)] !text-[#0a1628]"
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
