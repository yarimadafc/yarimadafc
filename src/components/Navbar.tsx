'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, Ticket, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'XƏBƏRLƏR', href: '/preview/news' },
    { name: 'KOMANDALAR', href: '/preview/teams' },
    { name: 'OYUNLAR', href: '/preview/matches' },
    { name: 'KLUB', href: '/preview/club' },
    { name: 'AKADEMİYA', href: '/preview/academy' },
    { name: 'MEDIA', href: '/preview/media' },
  ];

  return (
    <header className="w-full bg-[#0a1628]/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/preview" className="flex-shrink-0 flex items-center group">
            <div className="flex flex-col items-center">
               <span className="text-[#d7bf7b] font-black text-3xl tracking-tighter uppercase group-hover:text-white transition-colors">
                 Yarımada
               </span>
               <span className="text-white text-[10px] tracking-[0.3em] font-light mt-1 uppercase">
                 Futbol Klubu
               </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-[#d7bf7b] font-bold text-[13px] tracking-widest transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#d7bf7b] transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/preview/tickets" className="text-[#d7bf7b] flex items-center space-x-2 hover:text-white transition-colors group">
              <Ticket className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[13px] tracking-widest">BİLETLƏR</span>
            </Link>
            
            <Link href="/preview/shop" className="text-white flex items-center space-x-2 hover:text-[#d7bf7b] transition-colors group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[13px] tracking-widest">MAĞAZA</span>
            </Link>
            
            <button className="text-white hover:text-[#d7bf7b] transition-colors p-2">
              <Search className="w-5 h-5" />
            </button>
            
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
      <div className={`lg:hidden bg-[#06101e] border-t border-gray-800 absolute w-full transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-3 text-white font-bold text-sm tracking-widest border-b border-gray-800/50 hover:text-[#d7bf7b]"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col space-y-4">
            <Link href="/preview/tickets" className="flex items-center space-x-2 text-[#d7bf7b] font-bold text-sm tracking-widest">
              <Ticket className="w-5 h-5" />
              <span>BİLETLƏR</span>
            </Link>
            <Link href="/preview/shop" className="flex items-center space-x-2 text-white font-bold text-sm tracking-widest">
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
      </div>
    </header>
  );
}
