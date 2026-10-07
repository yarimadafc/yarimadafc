'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('az-AZ', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      const days = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
      const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
      setCurrentDate(`${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} • ${days[now.getDay()]}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/' || window.location.pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
    }
  };

  const menuItems = [
    { name: 'ANA SƏHİFƏ', href: '/' },
    { name: 'KLUB', href: '/club' },
    { name: 'KOMANDALAR', href: '/teams' },
    { name: 'OYUNLAR', href: '/matches' },
    { name: 'TURNİR CƏDVƏLİ', href: '/standings' },
    { name: 'XƏBƏRLƏR', href: '/news' },
    { name: 'MEDİA', href: '/media' },
    { name: 'MƏŞQÇİLƏR', href: '/coaches' },
    
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed w-full top-0 z-50 flex flex-col"
    >
      {/* Top Bar */}
      <div className="bg-[#0a1423]">
        <div className="container mx-auto px-4 lg:px-8 h-10 flex items-center justify-between">
          {/* Left: Phone & Slogan */}
          <div className="flex items-center justify-between w-full lg:w-auto lg:space-x-6">
            <a href="tel:0554477467" className="hover:text-[#d7bf7b] transition-colors hidden sm:flex items-center text-gray-400 text-xs font-bold tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              055 447 74 67
            </a>
            
            {mounted && currentTime && (
              <div className="text-[#d7bf7b] text-[10px] uppercase font-bold tracking-widest border-l border-gray-800 pl-6 flex items-center space-x-3">
                <span>{currentDate}</span>
                <span className="text-gray-600">|</span>
                <span className="text-white w-[50px]">{currentTime}</span>
              </div>
            )}
            

          </div>
          
          {/* Right: Social, Language */}
          <div className="hidden lg:flex items-center space-x-6">
            <span className="text-[#d7bf7b] text-[10px] uppercase font-bold tracking-widest border-r border-gray-800 pr-6">
              Gələcəyin Çempionları Burada Yetişir!
            </span>
            <div className="flex items-center space-x-4 text-gray-400">
              <a href="https://www.instagram.com/yarimada_fk/" target="_blank" rel="noopener noreferrer" className="hover:text-[#d7bf7b] transition-colors"><InstagramIcon /></a>
              <a href="https://www.facebook.com/profile.php?id=61590640762611" target="_blank" rel="noopener noreferrer" className="hover:text-[#d7bf7b] transition-colors"><FacebookIcon /></a>
              <a href="https://www.youtube.com/@yarimada_fk" target="_blank" rel="noopener noreferrer" className="hover:text-[#d7bf7b] transition-colors"><YoutubeIcon /></a>
              <a href="https://www.tiktok.com/@yarimadafk" target="_blank" rel="noopener noreferrer" className="hover:text-[#d7bf7b] transition-colors"><TiktokIcon /></a>
              <a href="https://t.me/yarimadafk?fbclid=PAZXh0bgNhZW0CMTEAcGRvZgRzcnRjBmFwcF9pZAwyNTYyODEwNDA1NTgAAafK0KsTFGaHEdkdFqPvdB_YUJuYByPtPKvdfmdCKantOLunANZ5C8nrnroI0A_aem_3_m_V6XwTbX1OL0eUZhRoA" target="_blank" rel="noopener noreferrer" className="hover:text-[#d7bf7b] transition-colors"><TelegramIcon /></a>
              
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#0d1a2d]/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" onClick={() => { if(window.location.pathname === '/') window.scrollTo({top: 0, behavior: 'smooth'}) }} className="flex items-center group cursor-pointer space-x-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#d7bf7b] flex-shrink-0"
                >
                  <Image src="/Logo.JPG.jpeg" alt="Yarımada FK" fill className="object-cover" />
                </motion.div>
                <div className="flex flex-col">
                   <span className="text-white font-black text-base md:text-xl tracking-tighter uppercase group-hover:text-[#d7bf7b] transition-colors whitespace-nowrap">Yarımada FK</span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden xl:flex items-center space-x-5 2xl:space-x-7">
              {menuItems.map((item, i) => (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    href={item.href} 
                    className="font-bold text-[12px] 2xl:text-[13px] tracking-widest text-white hover:text-[#d7bf7b] transition-colors relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#d7bf7b] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-white hover:text-[#d7bf7b] transition-colors p-2"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
              <Link href="/contact" className="bg-[#d7bf7b] text-[#152741] hover:bg-white transition-colors font-black text-[11px] tracking-widest px-6 py-2.5 rounded-full uppercase">
                BİZƏ QOŞUL
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center space-x-3">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-white hover:text-[#d7bf7b] focus:outline-none p-1"
              >
                {isSearchOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-[#d7bf7b] focus:outline-none p-1"
              >
                {isOpen ? <X className="w-7 h-7 md:w-8 md:h-8" /> : <Menu className="w-7 h-7 md:w-8 md:h-8" />}
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
              className="xl:hidden bg-[#0d1a2d] border-t border-gray-800 absolute w-full overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="px-6 py-4 space-y-1">
                <div className="flex items-center justify-center mb-6 px-2 mt-4">
                  <div className="flex space-x-6 text-gray-400">
                    <a href="https://www.instagram.com/yarimada_fk/" target="_blank" rel="noopener noreferrer"><InstagramIcon className="w-6 h-6 hover:text-[#d7bf7b] transition-colors" /></a>
                    <a href="https://www.facebook.com/profile.php?id=61590640762611" target="_blank" rel="noopener noreferrer"><FacebookIcon className="w-6 h-6 hover:text-[#d7bf7b] transition-colors" /></a>
                    <a href="https://www.youtube.com/@yarimada_fk" target="_blank" rel="noopener noreferrer"><YoutubeIcon className="w-6 h-6 hover:text-[#d7bf7b] transition-colors" /></a>
                    <a href="https://www.tiktok.com/@yarimadafk" target="_blank" rel="noopener noreferrer"><TiktokIcon className="w-6 h-6 hover:text-[#d7bf7b] transition-colors" /></a>
                    <a href="https://t.me/yarimadafk?fbclid=PAZXh0bgNhZW0CMTEAcGRvZgRzcnRjBmFwcF9pZAwyNTYyODEwNDA1NTgAAafK0KsTFGaHEdkdFqPvdB_YUJuYByPtPKvdfmdCKantOLunANZ5C8nrnroI0A_aem_3_m_V6XwTbX1OL0eUZhRoA" target="_blank" rel="noopener noreferrer"><TelegramIcon className="w-6 h-6 hover:text-[#d7bf7b] transition-colors" /></a>
                  </div>
                </div>

                {menuItems.map((item) => (
                  <motion.div key={item.name}>
                    <Link
                      href={item.href} 
                      className="block py-3.5 font-bold text-sm tracking-widest text-white hover:text-[#d7bf7b] border-b border-gray-800/50 transition-colors"
                      onClick={(e) => { setIsOpen(false); if(item.href === '/' && window.location.pathname === '/') { window.scrollTo({top: 0, behavior: 'smooth'}) } }}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="pt-6 pb-4 flex">
                  <Link href="/contact" onClick={() => setIsOpen(false)} className="bg-[#d7bf7b] text-[#152741] w-full text-center hover:bg-white transition-colors font-black text-sm tracking-widest px-6 py-4 rounded-xl uppercase">
                    BİZƏ QOŞUL
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
