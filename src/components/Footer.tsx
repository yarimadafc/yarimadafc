import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#0a1628] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12 border-b border-gray-800 pb-8">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <Link href="/" className="flex items-center gap-4 mb-4">
              <Image 
                src="/IMG_7966.JPG.jpeg" 
                alt="Yarımada FC Logo" 
                width={50} 
                height={50} 
                className="rounded-full object-cover"
              />
              <span className="font-bold uppercase tracking-wider text-2xl text-[#00e5a0]">YARIMADA FC</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md text-center md:text-left">
              Peşəkar futbol komandası və akademiyası. Gələcəyin ulduzlarını burada yetişdiririk. Qələbəyə gedən yol!
            </p>
          </div>
          <div className="flex space-x-6">
            {/* Social Icons Placeholders */}
            <a href="#" className="text-gray-400 hover:text-[#00e5a0] transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00e5a0] transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00e5a0] transition-colors">
              <span className="sr-only">YouTube</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00e5a0] transition-colors font-bold text-xl uppercase">
              TT
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          <div>
            <h3 className="text-[#00e5a0] font-bold uppercase tracking-wider mb-4 text-sm">Klub</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/haqqimizda" className="hover:text-white transition-colors">Haqqımızda</Link></li>
              <li><Link href="/nailiyyetler" className="hover:text-white transition-colors">Nailiyyətlər</Link></li>
              <li><Link href="/rehberlik" className="hover:text-white transition-colors">Rəhbərlik</Link></li>
              <li><Link href="/karyera" className="hover:text-white transition-colors">Karyera</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#00e5a0] font-bold uppercase tracking-wider mb-4 text-sm">Komandalar</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/komandalar/u12" className="hover:text-white transition-colors">U-12</Link></li>
              <li><Link href="/komandalar/u11" className="hover:text-white transition-colors">U-11</Link></li>
              <li><Link href="/komandalar/u10" className="hover:text-white transition-colors">U-10</Link></li>
              <li><Link href="/komandalar/u9" className="hover:text-white transition-colors">U-9</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#00e5a0] font-bold uppercase tracking-wider mb-4 text-sm">Oyun günü</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/oyunlar" className="hover:text-white transition-colors">Oyunlar</Link></li>
              <li><Link href="/turnir-cedveli" className="hover:text-white transition-colors">Turnir cədvəli</Link></li>
              <li><Link href="/akademiya" className="hover:text-white transition-colors">Akademiya</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#00e5a0] font-bold uppercase tracking-wider mb-4 text-sm">Media</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/xeberler" className="hover:text-white transition-colors">Xəbərlər</Link></li>
              <li><Link href="/videolar" className="hover:text-white transition-colors">Videolar</Link></li>
              <li><Link href="/fotolar" className="hover:text-white transition-colors">Fotolar</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#00e5a0] font-bold uppercase tracking-wider mb-4 text-sm">İcma</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/sosial" className="hover:text-white transition-colors">Sosial şəbəkələr</Link></li>
              <li><Link href="/terefdaslar" className="hover:text-white transition-colors">Tərəfdaşlar</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#00e5a0] font-bold uppercase tracking-wider mb-4 text-sm">Hüquqi</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/elaqe" className="hover:text-white transition-colors">Əlaqə</Link></li>
              <li><Link href="/mexfilik" className="hover:text-white transition-colors">Məxfilik siyasəti</Link></li>
              <li><Link href="/istifade-sertleri" className="hover:text-white transition-colors">İstifadə şərtləri</Link></li>
              <li><Link href="/cookie" className="hover:text-white transition-colors">Cookie siyasəti</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-[#00e5a0] text-sm font-semibold">
            Copyright Yarımada FC 2026. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
