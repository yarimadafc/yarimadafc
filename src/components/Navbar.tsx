"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Komandalar', href: '/komandalar' },
    { name: 'Xəbərlər', href: '/xeberler' },
    { name: 'Oyunlar', href: '/oyunlar' },
    { name: 'Turnir cədvəli', href: '/turnir-cedveli' },
    { name: 'Klub', href: '/klub' },
    { name: 'Media', href: '/media' },
    { name: 'Əlaqə', href: '/elaqe' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a1628]/95 backdrop-blur-sm border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <Image 
                src="/IMG_7966.JPG.jpeg" 
                alt="Yarımada FC Logo" 
                width={40} 
                height={40} 
                className="rounded-full object-cover"
              />
              <span className="font-bold uppercase tracking-wider text-xl hidden sm:block">Yarımada FC</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-gray-300 hover:text-[#00e5a0] transition-colors font-medium text-sm lg:text-base uppercase tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Button */}
          <div className="hidden md:flex items-center">
            <Link 
              href="/akademiyaya-qosul"
              className="border border-white hover:border-[#00e5a0] hover:text-[#00e5a0] text-white px-4 py-2 rounded-full font-medium transition-colors text-sm uppercase tracking-wide"
            >
              Akademiyaya Qoşul
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a1628] border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-[#00e5a0] hover:bg-gray-800 uppercase"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/akademiyaya-qosul"
              className="block px-3 py-2 mt-4 text-center border border-white text-white rounded-full font-medium hover:border-[#00e5a0] hover:text-[#00e5a0] uppercase"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Akademiyaya Qoşul
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
