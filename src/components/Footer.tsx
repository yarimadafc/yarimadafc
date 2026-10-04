'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const [lang, setLang] = useState('AZ');

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
    if (match && match[1]) {
      setLang(match[1]);
    }
    
    // Listen for custom lang change event
    const handleLangChange = (e: any) => setLang(e.detail);
    window.addEventListener('langChange', handleLangChange);
    return () => window.removeEventListener('langChange', handleLangChange);
  }, []);

  return (
    <footer className="bg-[#0a1628] pt-8 md:pt-10 pb-6 relative overflow-hidden flex-shrink-0 w-full mt-auto text-white">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-[var(--ks-kinpaku)]/50 to-transparent"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        {/* TOP SECTION: Logo + Club Name + Slogan — left on desktop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-10 w-full gap-4">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 overflow-hidden shrink-0">
              <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black font-condensed uppercase tracking-wider text-xl md:text-2xl leading-tight">
                Yarımada FK
              </span>
              <span className="text-white/50 italic text-sm">
                Gələcəyin ulduzları burada yetişir
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Grid of ALL links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6 w-full justify-items-center md:justify-items-start">
          {/* Col 1 */}
          <div className="text-center md:text-left">
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-lg md:text-xl uppercase tracking-widest mb-4">Klub</h3>
            <ul className="space-y-2 font-bold text-gray-400 text-sm">
              <li><Link href="/klub" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Haqqımızda</Link></li>
              <li><Link href="/klub#nailiyyetler" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Nailiyyətlər</Link></li>
              <li><Link href="/klub#rehberlik" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Rəhbərlik</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="text-center md:text-left">
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-lg md:text-xl uppercase tracking-widest mb-4">{lang === "EN" ? "Teams" : lang === "RU" ? "Команды" : "Komandalar"}</h3>
            <ul className="space-y-2 font-bold text-gray-400 text-sm">
              <li><Link href="/komandalar" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Bütün Komandalar</Link></li>
              <li><Link href="/komandalar?age=U-12" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> U-12</Link></li>
              <li><Link href="/komandalar?age=U-11" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> U-11</Link></li>
              <li><Link href="/komandalar?age=U-10" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> U-10</Link></li>
              <li><Link href="/komandalar?age=U-9" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> U-9</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="text-center md:text-left">
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-lg md:text-xl uppercase tracking-widest mb-4">Oyun Günü</h3>
            <ul className="space-y-2 font-bold text-gray-400 text-sm">
              <li><Link href="/oyunlar" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Oyunlar</Link></li>
              <li><Link href="/turnir-cedveli" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Turnir Cədvəli</Link></li>
              <li><Link href="/teqvim" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Məşq Cədvəli</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="text-center md:text-left">
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-lg md:text-xl uppercase tracking-widest mb-4">{lang === "EN" ? "Media" : lang === "RU" ? "Медиа" : "Media"}</h3>
            <ul className="space-y-2 font-bold text-gray-400 text-sm">
              <li><Link href="/xeberler" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Xəbərlər</Link></li>
              <li><Link href="/media?tab=videolar" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Videolar</Link></li>
              <li><Link href="/media?tab=fotolar" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Fotoqalereya</Link></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div className="text-center md:text-left">
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-lg md:text-xl uppercase tracking-widest mb-4">{lang === "EN" ? "Community" : lang === "RU" ? "Сообщество" : "İcma"}</h3>
            <ul className="space-y-2 font-bold text-gray-400 text-sm">
              <li><Link href="/mesqciler" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Məşqçilər</Link></li>
              <li><Link href="/elaqe" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Əlaqə</Link></li>
              <li className="flex justify-center md:justify-start gap-3 pt-4 flex-wrap w-[150px] mx-auto md:mx-0">
                <a href="https://www.facebook.com/profile.php?id=61590640762611" target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 shadow-lg" title="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a>
                <a href="https://www.instagram.com/yarimada_fk/" target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all duration-300 shadow-lg" title="Instagram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                <a href="https://www.youtube.com/@yarimada_fk" target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all duration-300 shadow-lg" title="YouTube"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                <a href="https://t.me/yarimadafk" target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] transition-all duration-300 shadow-lg" title="Telegram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm5.894-16.48l-2.028 11.23c-.15.69-.56.85-1.14.52l-3.15-2.32-1.52 1.46c-.17.17-.31.31-.64.31l.23-3.21 5.84-5.28c.25-.23-.06-.35-.39-.14l-7.22 4.54-3.11-.97c-.68-.21-.69-.68.14-1.01l12.16-4.68c.56-.22 1.05.13.83 1.05z"/></svg></a>
                <a href="https://www.tiktok.com/@yarimada_fk" target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00f2fe] hover:text-white hover:border-[#00f2fe] transition-all duration-300 shadow-lg" title="TikTok"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.02 4.46-2.66 5.92-1.67 1.48-4.04 2.15-6.26 1.82-2.43-.37-4.57-1.92-5.59-4.13-1.07-2.36-.88-5.34.46-7.53 1.11-1.84 3.12-3.09 5.25-3.32.22-.02.43-.02.65-.02v4.06c-1.58.12-3.22.99-3.99 2.4-.95 1.7-.56 4.11 1.01 5.27 1.61 1.18 4.09.91 5.33-.67 1.02-1.28 1.19-3.14 1.13-4.74V.02h.62z"/></svg></a>
              </li>
            </ul>
          </div>

          {/* Col 6 */}
          <div className="text-center md:text-left">
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-lg md:text-xl uppercase tracking-widest mb-4">{lang === "EN" ? "Legal" : lang === "RU" ? "Правовая инф." : "Hüquqi"}</h3>
            <ul className="space-y-2 font-bold text-gray-400 text-sm">
              <li><Link href="/mexfilik" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Məxfilik Siyasəti</Link></li>
              <li><Link href="/istifade-sertleri" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> İstifadə Şərtləri</Link></li>
              <li><Link href="/cookie" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors group"><span className="text-[var(--ks-kinpaku)] text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">■</span> Cookie Siyasəti</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col items-center justify-center w-full text-center">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] sm:text-sm text-center whitespace-nowrap">
            &copy; 2026 {lang === "EN" ? "All rights reserved" : lang === "RU" ? "Все права защищены" : "{lang === "EN" ? "All rights reserved" : lang === "RU" ? "Все права защищены" : "Bütün hüquqlar qorunur"}"}. Yarımada FK.
          </p>
        </div>
      </div>
    </footer>
  );
}
