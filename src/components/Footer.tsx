'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] text-white pt-24 pb-12 w-full mt-auto border-t-[8px] border-[var(--ks-kinpaku)]">
      <div className="w-full px-6 md:px-12 lg:px-24">
        
        {/* TOP SECTION: Logo + Slogan */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-12 mb-16">
          <div className="flex items-center gap-6 mb-8 md:mb-0">
            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-[var(--ks-kinpaku)] shadow-[0_0_30px_rgba(201,168,76,0.15)]">
              <Image src="/Logo.JPG.jpeg" alt="Yarımada FK Logo" fill className="object-cover" />
            </div>
            <div>
              {/* Removed Team Name, added large Slogan */}
              <h2 className="text-3xl md:text-5xl font-black font-condensed uppercase tracking-wide text-white leading-tight">
                GƏLƏCƏYİN ULDUZLARI<br/>BURADA YETİŞİR.
              </h2>
            </div>
          </div>
          <a href="https://wa.me/994554477467?text=Salam,%20Akademiyaya%20qeydiyyatdan%20keçmək%20istəyirəm." target="_blank" className="ks-button !bg-[var(--ks-kinpaku)] !text-[#0a1628] hover:!bg-white !rounded-full !px-10 !py-5 font-black uppercase tracking-widest text-lg md:text-xl shadow-lg transition-colors">
            Qeydiyyatdan Keç
          </a>
        </div>

        {/* MIDDLE SECTION: Grid of ALL links, widened to edges */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 w-full">
          {/* Col 1 */}
          <div>
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-2xl md:text-3xl uppercase tracking-widest mb-6">Klub</h3>
            <ul className="space-y-4 font-bold text-gray-400 text-sm md:text-base">
              <li><Link href="/klub" className="hover:text-white transition-colors">Haqqımızda</Link></li>
              <li><Link href="/klub#rehberlik" className="hover:text-white transition-colors">Rəhbərlik</Link></li>
              <li><Link href="/klub#nailiyyetler" className="hover:text-white transition-colors">Nailiyyətlər</Link></li>
              <li><Link href="/teqvim" className="hover:text-white transition-colors">Təqvim</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-2xl md:text-3xl uppercase tracking-widest mb-6">Komandalar</h3>
            <ul className="space-y-4 font-bold text-gray-400 text-sm md:text-base">
              <li><Link href="/komandalar" className="hover:text-white transition-colors">Bütün Komandalar</Link></li>
              <li><Link href="/komandalar?age=U-12" className="hover:text-white transition-colors">U-12</Link></li>
              <li><Link href="/komandalar?age=U-11" className="hover:text-white transition-colors">U-11</Link></li>
              <li><Link href="/komandalar?age=U-10" className="hover:text-white transition-colors">U-10</Link></li>
              <li><Link href="/komandalar?age=U-9" className="hover:text-white transition-colors">U-9</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-2xl md:text-3xl uppercase tracking-widest mb-6">Oyun Günü</h3>
            <ul className="space-y-4 font-bold text-gray-400 text-sm md:text-base">
              <li><Link href="/oyunlar" className="hover:text-white transition-colors">Oyunlar</Link></li>
              <li><Link href="/turnir-cedveli" className="hover:text-white transition-colors">Turnir Cədvəli</Link></li>
              <li><Link href="/teqvim" className="hover:text-white transition-colors">Məşq Cədvəli</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-2xl md:text-3xl uppercase tracking-widest mb-6">Media</h3>
            <ul className="space-y-4 font-bold text-gray-400 text-sm md:text-base">
              <li><Link href="/xeberler" className="hover:text-white transition-colors">Xəbərlər</Link></li>
              <li><Link href="/media?tab=videolar" className="hover:text-white transition-colors">Videolar</Link></li>
              <li><Link href="/media?tab=fotolar" className="hover:text-white transition-colors">Fotoqalereya</Link></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-2xl md:text-3xl uppercase tracking-widest mb-6">İcma</h3>
            <ul className="space-y-4 font-bold text-gray-400 text-sm md:text-base">
              <li><Link href="/mesqciler" className="hover:text-white transition-colors">Məşqçilər</Link></li>
              <li><Link href="/elaqe" className="hover:text-white transition-colors">Əlaqə</Link></li>
              <li className="flex gap-4 pt-2 flex-wrap">
                {/* Social Icons */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors" title="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-colors" title="Instagram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-colors" title="YouTube"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors" title="TikTok"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.16-3.44-3.37-3.41-5.7.04-2.39 1.47-4.59 3.53-5.69 1.25-.66 2.7-.93 4.11-.79v4.03c-1.34-.09-2.73.43-3.54 1.48-.84 1.05-.98 2.53-.35 3.7.67 1.23 2.11 1.91 3.48 1.63 1.25-.26 2.21-1.28 2.39-2.55.03-.22.04-.45.04-.67.01-4.73.01-9.45.01-14.18z"/></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors" title="WhatsApp"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.46c-1.6-.05-3.15-.46-4.57-1.19l-5.11 1.34 1.36-4.99c-.83-1.48-1.27-3.14-1.25-4.83.03-5.28 4.33-9.56 9.61-9.56 5.28 0 9.57 4.29 9.57 9.57.01 5.27-4.27 9.56-9.55 9.56zm4.99-6.85c-.27-.14-1.61-.8-1.86-.89-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.43-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.55.13-.12.27-.31.41-.47.14-.16.19-.27.28-.45.09-.18.05-.34-.02-.47-.07-.14-.61-1.48-.84-2.02-.22-.52-.45-.45-.61-.46h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.63 1.11 2.81c.14.18 1.91 2.92 4.63 4.09.65.28 1.15.45 1.54.58.65.21 1.24.18 1.71.11.53-.08 1.61-.66 1.84-1.3.23-.64.23-1.19.16-1.3-.06-.11-.25-.18-.52-.31z"/></svg></a>
              </li>
            </ul>
          </div>

          {/* Col 6 - Hüquqi bölmələr olaraq üstdə çıxdı */}
          <div>
            <h3 className="text-[var(--ks-kinpaku)] font-black font-condensed text-2xl md:text-3xl uppercase tracking-widest mb-6">Hüquqi</h3>
            <ul className="space-y-4 font-bold text-gray-400 text-sm md:text-base">
              <li><Link href="/mexfilik" className="hover:text-white transition-colors">Məxfilik Siyasəti</Link></li>
              <li><Link href="/istifade-sertleri" className="hover:text-white transition-colors">İstifadə Şərtləri</Link></li>
              <li><Link href="/cookie" className="hover:text-white transition-colors">Cookie Siyasəti</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col items-start w-full">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm md:text-base">
            &copy; 2026 Bütün hüquqlar qorunur. Yarımada FK.
          </p>
        </div>
      </div>
    </footer>
  );
}
