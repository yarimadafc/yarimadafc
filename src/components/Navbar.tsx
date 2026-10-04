'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const SOCIALS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/yarimada_fk/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/></svg>
    )
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61590640762611',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/></svg>
    )
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@yarimada_fk?fbclid=PAZXh0bgNhZW0CMTEAcGRvZgRzcnRjBmFwcF9pZAwyNTYyODEwNDA1NTgAAadY0gbU_HBhYX3MqWlHhZ0jqbCS_BETchUqgtu_bg3IKJ1JVyrYif3vNmAN-A_aem_ezNKcQulOhtqNdlAsWV5tw',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.05c-.01 2.37-.88 4.67-2.45 6.42-1.6 1.78-3.87 2.84-6.27 2.95-2.4.11-4.82-.6-6.66-2.1-1.84-1.49-3-3.67-3.23-6.04-.24-2.38.38-4.78 1.77-6.72 1.39-1.95 3.47-3.3 5.8-3.8 2.34-.5 4.8.04 6.78 1.43v4.46c-1.44-.88-3.15-1.2-4.8-1-1.65.2-3.18.96-4.28 2.1-1.11 1.14-1.72 2.67-1.74 4.27-.02 1.6.57 3.14 1.65 4.3 1.07 1.16 2.58 1.88 4.19 2.02 1.6.14 3.2-.42 4.45-1.53 1.25-1.12 2.03-2.67 2.18-4.32V.02z"/></svg>
    )
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@yarimada_fk',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M21.582 6.186a2.6 2.6 0 00-1.83-1.83C18.137 3.93 12 3.93 12 3.93s-6.137 0-7.752.426a2.6 2.6 0 00-1.83 1.83C2 7.801 2 12 2 12s0 4.199.418 5.814a2.6 2.6 0 001.83 1.83C5.863 20.07 12 20.07 12 20.07s6.137 0 7.752-.426a2.6 2.6 0 001.83-1.83C22 16.199 22 12 22 12s0-4.199-.418-5.814zM9.99 15.174v-6.35l5.96 3.175-5.96 3.175z" clipRule="evenodd"/></svg>
    )
  },
  {
    name: 'Telegram',
    href: 'https://t.me/yarimadafk?fbclid=PAZXh0bgNhZW0CMTEAcGRvZgRzcnRjBmFwcF9pZAwyNTYyODEwNDA1NTgAAadQ9GGJki6F3Txo8n2q6aZfYEIrQm8WXLYBFJzG-4dI3EI5C2afj5rIo4yvEg_aem_1-Zws9RZkBTHwrBLPDU0wg',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.66 8.35c-.32 1.96-1.63 8.3-2.3 11.16-.28.81-.66 1.09-1.02 1.12-1.34.12-2.36-1.36-3.66-2.5-1.57-1.38-2.47-2.22-3.99-3.26-1.74-1.2-.61-1.86.68-3.2.34-.35 6.22-5.69 6.34-6.18.01-.06.03-.29-.1-.4-.12-.11-.29-.07-.42-.04-.18.04-3.04 2.01-8.58 5.76-.81.56-1.54.83-2.19.82-.71-.01-2.08-.41-3.09-.75-1.24-.41-2.22-.64-2.13-1.35.05-.37.52-.75 1.42-1.15 5.59-2.44 9.32-4.04 11.19-4.81 5.31-2.19 6.42-2.58 7.15-2.59.16 0 .52.04.76.2.2.14.28.34.3.54.02.19.04.6.02 1.07z"/></svg>
    )
  }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Ana Səhifə', href: '/' },
    { name: 'Klub', href: '/klub' },
    { name: 'Komandalar', href: '/komandalar' },
    { name: 'Oyunlar', href: '/oyunlar' },
    { name: 'Xəbərlər', href: '/xeberler' },
    { name: 'Media', href: '/media' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a1628]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 z-50">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#c9a84c] shadow-lg">
              <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
            </div>
            <span className="text-white font-black text-xl uppercase tracking-widest hidden sm:block drop-shadow-md">
              Yarımada FC
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-white hover:text-[#c9a84c] font-bold text-[13px] uppercase tracking-[0.15em] transition-colors drop-shadow-md"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right actions (Socials + Button) */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-3 border-r border-white/20 pr-5">
              {SOCIALS.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#c9a84c] transition-colors drop-shadow-md"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <Link 
              href="/qeydiyyat" 
              className="px-6 py-2.5 bg-[#c9a84c] border border-[#c9a84c] text-[#0a1628] hover:bg-transparent hover:text-[#c9a84c] rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300"
            >
              Akademiyaya Qoşul
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white z-50 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0a1628] z-40 flex flex-col justify-center items-center px-4"
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-white text-3xl font-black uppercase tracking-widest hover:text-[#c9a84c] transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: navLinks.length * 0.1 }}
                 className="flex gap-4 mt-6"
              >
                {SOCIALS.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#c9a84c] transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </motion.div>

              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: (navLinks.length + 1) * 0.1 }}
              >
                <Link 
                  href="/qeydiyyat" 
                  onClick={() => setMobileOpen(false)}
                  className="mt-6 px-10 py-4 bg-[#c9a84c] text-[#0a1628] rounded-full font-bold uppercase tracking-wider text-sm inline-block w-full text-center"
                >
                  Akademiyaya Qoşul
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
