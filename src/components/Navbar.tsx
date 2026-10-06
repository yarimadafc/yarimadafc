'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [time, setTime] = useState<string>('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('az-AZ', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/' || pathname === '/az' || pathname === '/en' || pathname === '/ru') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`"${searchQuery}" üçün axtarış funksiyası tezliklə aktiv olacaq.`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const menuItems = [
    { name: 'ANA SƏHİFƏ', href: '/', onClick: handleHomeClick },
    { name: 'XƏBƏRLƏR', href: '/news' },
    { name: 'KOMANDALAR', href: '/teams' },
    { name: 'OYUNLAR', href: '/matches' },
    { name: 'KLUB', href: '/club' },
    { name: 'AKADEMİYA', href: '/academy' },
    { name: 'MEDIA', href: '/media' },
    { name: 'BİLETLƏR', href: '/tickets', highlight: true },
    { name: 'ƏLAQƏ', href: '/contact' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-[#152741]/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50 transition-all duration-300"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo & Text */}
          <div className="flex items-center space-x-4">
            <a href="/" onClick={handleHomeClick} className="flex-shrink-0 flex items-center group cursor-pointer space-x-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#d7bf7b]"
              >
                <Image src="/Logo.JPG.jpeg" alt="Yarımada FK" fill className="object-cover" />
              </motion.div>
              <div className="flex flex-col">
                 <span className="text-white font-black text-xl md:text-2xl tracking-tighter uppercase group-hover:text-[#d7bf7b] transition-colors">
                   Yarımada FK
                 </span>
              </div>
            </a>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {menuItems.map((item, i) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {item.onClick ? (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className={`font-bold text-[11px] xl:text-[12px] tracking-widest transition-colors relative group cursor-pointer ${item.highlight ? 'text-[#d7bf7b] hover:text-white' : 'text-white hover:text-[#d7bf7b]'}`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-2 left-0 w-0 h-[2px] ${item.highlight ? 'bg-white' : 'bg-[#d7bf7b]'} transition-all duration-300 group-hover:w-full`}></span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-bold text-[11px] xl:text-[12px] tracking-widest transition-colors relative group ${item.highlight ? 'text-[#d7bf7b] hover:text-white' : 'text-white hover:text-[#d7bf7b]'}`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-2 left-0 w-0 h-[2px] ${item.highlight ? 'bg-white' : 'bg-[#d7bf7b]'} transition-all duration-300 group-hover:w-full`}></span>
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            
            {/* LED Glow Clock on Desktop */}
            <div className="relative p-[2px] rounded-lg overflow-hidden group">
               {/* Spinning LED Border */}
               <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,#d7bf7b_360deg)] animate-[spin_2s_linear_infinite]"></div>
               {/* Clock Content */}
               <div className="relative flex items-center justify-center bg-[#0d1a2d] px-4 py-2 rounded-md h-full w-full">
                 <span className="text-[#d7bf7b] font-mono font-bold tracking-widest text-sm drop-shadow-[0_0_5px_rgba(215,191,123,0.8)]">{time || '00:00:00'}</span>
               </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-[#d7bf7b] transition-colors p-2"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-[#d7bf7b] focus:outline-none"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#d7bf7b] focus:outline-none p-2"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Dropdown */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-[#152741] border-t border-gray-800 overflow-hidden"
          >
            <form onSubmit={handleSearch} className="container mx-auto px-4 lg:px-8 py-4">
              <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Saytda axtarış..." 
                  className="w-full bg-[#0d1a2d] text-white border border-gray-700 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:border-[#d7bf7b] transition-colors"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <button type="submit" className="absolute right-2 top-2 bg-[#d7bf7b] text-[#152741] px-4 py-1.5 rounded-md font-bold text-sm hover:bg-white transition-colors">
                  Axtar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[#0d1a2d] border-t border-gray-800 absolute w-full overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 space-y-1">
              
              {/* LED Glow Clock on Mobile */}
              <div className="relative p-[2px] rounded-lg overflow-hidden mb-6 flex w-full">
                 <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,#d7bf7b_360deg)] animate-[spin_2s_linear_infinite]"></div>
                 <div className="relative flex items-center justify-center bg-[#152741] w-full px-4 py-3 rounded-md">
                   <span className="text-[#d7bf7b] font-mono font-bold tracking-widest text-sm drop-shadow-[0_0_5px_rgba(215,191,123,0.8)]">{time || '00:00:00'}</span>
                 </div>
              </div>

              {menuItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {item.onClick ? (
                    <a
                      href={item.href}
                      onClick={(e) => { item.onClick(e); setIsOpen(false); }}
                      className={`block py-3 font-bold text-sm tracking-widest border-b border-gray-800/50 transition-colors ${item.highlight ? 'text-[#d7bf7b] hover:text-white' : 'text-white hover:text-[#d7bf7b]'}`}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block py-3 font-bold text-sm tracking-widest border-b border-gray-800/50 transition-colors ${item.highlight ? 'text-[#d7bf7b] hover:text-white' : 'text-white hover:text-[#d7bf7b]'}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
