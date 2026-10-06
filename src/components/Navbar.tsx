'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, Menu, X, Ticket, ShoppingBag, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('az-AZ', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'XƏBƏRLƏR', href: '/news' },
    { name: 'KOMANDALAR', href: '/teams' },
    { name: 'OYUNLAR', href: '/matches' },
    { name: 'KLUB', href: '/club' },
    { name: 'AKADEMİYA', href: '/academy' },
    { name: 'MEDIA', href: '/media' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-[#0a1628]/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50 transition-all duration-300"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo & Clock */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#d7bf7b]"
              >
                <Image src="/Logo.JPG.jpeg" alt="Yarımada FK" fill className="object-cover" />
              </motion.div>
            </Link>

            {/* Live Clock */}
            <div className="hidden md:flex items-center space-x-2 text-[#d7bf7b] bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold tracking-widest text-sm">{time || '00:00:00'}</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {menuItems.map((item, i) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-white hover:text-[#d7bf7b] font-bold text-[13px] tracking-widest transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#d7bf7b] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/tickets" className="text-[#d7bf7b] flex items-center space-x-2 hover:text-white transition-colors group">
              <Ticket className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[13px] tracking-widest">BİLETLƏR</span>
            </Link>
            
            <Link href="/shop" className="text-white flex items-center space-x-2 hover:text-[#d7bf7b] transition-colors group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[13px] tracking-widest">MAĞAZA</span>
            </Link>
            
            <div className="flex items-center space-x-3 text-[13px] font-bold text-gray-400 border-l border-gray-700 pl-6">
              <button className="text-[#d7bf7b]">AZ</button>
              <button className="hover:text-white transition-colors">EN</button>
              <button className="hover:text-white transition-colors">RU</button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#d7bf7b] focus:outline-none p-2"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[#06101e] border-t border-gray-800 absolute w-full overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {/* Mobile Clock */}
              <div className="flex items-center justify-center space-x-2 text-[#d7bf7b] bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-800 mb-4">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold tracking-widest text-sm">{time || '00:00:00'}</span>
              </div>

              {menuItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block py-3 text-white font-bold text-sm tracking-widest border-b border-gray-800/50 hover:text-[#d7bf7b]"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 flex flex-col space-y-4">
                <Link href="/tickets" className="flex items-center space-x-2 text-[#d7bf7b] font-bold text-sm tracking-widest">
                  <Ticket className="w-5 h-5" />
                  <span>BİLETLƏR</span>
                </Link>
                <Link href="/shop" className="flex items-center space-x-2 text-white font-bold text-sm tracking-widest">
                  <ShoppingBag className="w-5 h-5" />
                  <span>MAĞAZA</span>
                </Link>
                <div className="flex space-x-4 pt-4 border-t border-gray-800/50 text-sm font-bold text-gray-400">
                   <button className="text-[#d7bf7b]">AZ</button>
                   <button>EN</button>
                   <button>RU</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
