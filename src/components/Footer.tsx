import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] text-white pt-16 pb-8 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP: Logo & Description */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 border-b border-gray-800 pb-12">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700 bg-white flex-shrink-0">
            <Image
              src="/IMG_7966.JPG.jpeg"
              alt="Yarımada FC Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left max-w-2xl">
            <h2 className="text-[#00e5a0] font-black text-3xl uppercase tracking-widest mb-2">
              Yarımada FC
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Azərbaycanın gənc və iddialı futbol klubu. Gələcəyin ulduzlarını bu gün yetişdiririk. Peşəkar yanaşma, intizam və qələbə əzmi ilə daha böyük uğurlara doğru.
            </p>
          </div>
        </div>

        {/* MIDDLE: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-[#00e5a0] font-bold text-sm uppercase tracking-wider mb-4">Klub</h3>
            <ul className="space-y-3">
              <li><Link href="/klub" className="text-gray-400 hover:text-white text-sm transition-colors">Haqqımızda</Link></li>
              <li><Link href="/klub#nailiyyetler" className="text-gray-400 hover:text-white text-sm transition-colors">Nailiyyətlər</Link></li>
              <li><Link href="/klub#rehberlik" className="text-gray-400 hover:text-white text-sm transition-colors">Rəhbərlik</Link></li>
              <li><Link href="/akademiya" className="text-gray-400 hover:text-white text-sm transition-colors">Akademiya</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-[#00e5a0] font-bold text-sm uppercase tracking-wider mb-4">Komandalar</h3>
            <ul className="space-y-3">
              <li><Link href="/komandalar?age=U-12" className="text-gray-400 hover:text-white text-sm transition-colors">U-12</Link></li>
              <li><Link href="/komandalar?age=U-11" className="text-gray-400 hover:text-white text-sm transition-colors">U-11</Link></li>
              <li><Link href="/komandalar?age=U-10" className="text-gray-400 hover:text-white text-sm transition-colors">U-10</Link></li>
              <li><Link href="/komandalar?age=U-9" className="text-gray-400 hover:text-white text-sm transition-colors">U-9</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-[#00e5a0] font-bold text-sm uppercase tracking-wider mb-4">Oyunlar</h3>
            <ul className="space-y-3">
              <li><Link href="/oyunlar" className="text-gray-400 hover:text-white text-sm transition-colors">Oyunlar</Link></li>
              <li><Link href="/turnir-cedveli" className="text-gray-400 hover:text-white text-sm transition-colors">Turnir cədvəli</Link></li>
              <li><Link href="/mesq-cedveli" className="text-gray-400 hover:text-white text-sm transition-colors">Məşq cədvəli</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-[#00e5a0] font-bold text-sm uppercase tracking-wider mb-4">Media</h3>
            <ul className="space-y-3">
              <li><Link href="/xeberler" className="text-gray-400 hover:text-white text-sm transition-colors">Xəbərlər</Link></li>
              <li><Link href="/media?tab=videos" className="text-gray-400 hover:text-white text-sm transition-colors">Videolar</Link></li>
              <li><Link href="/media?tab=photos" className="text-gray-400 hover:text-white text-sm transition-colors">Fotolar</Link></li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="text-[#00e5a0] font-bold text-sm uppercase tracking-wider mb-4">İcma</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Instagram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Facebook</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">YouTube</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">TikTok</a></li>
            </ul>
          </div>

          {/* Column 6 */}
          <div>
            <h3 className="text-[#00e5a0] font-bold text-sm uppercase tracking-wider mb-4">Hüquqi</h3>
            <ul className="space-y-3">
              <li><Link href="/elaqe" className="text-gray-400 hover:text-white text-sm transition-colors">Əlaqə</Link></li>
              <li><Link href="/mexfilik" className="text-gray-400 hover:text-white text-sm transition-colors">Məxfilik siyasəti</Link></li>
              <li><Link href="/sertler" className="text-gray-400 hover:text-white text-sm transition-colors">İstifadə şərtləri</Link></li>
              <li><Link href="/cookie" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie siyasəti</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM: Copyright & Socials */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#00e5a0] text-sm">
            &copy; {new Date().getFullYear()} Yarımada FC. Bütün hüquqlar qorunur.
          </p>
          <div className="flex gap-4">
            {/* Instagram */}
            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M21.582 6.186a2.615 2.615 0 00-1.84-1.841C18.12 3.93 12 3.93 12 3.93s-6.12 0-7.741.415a2.615 2.615 0 00-1.84 1.841C2 7.807 2 12 2 12s0 4.193.419 5.814a2.615 2.615 0 001.84 1.841C5.88 20.07 12 20.07 12 20.07s6.12 0 7.741-.415a2.615 2.615 0 001.84-1.841C22 16.193 22 12 22 12s0-4.193-.418-5.814zM9.982 15.01l6.103-3.005-6.103-3.005v6.01z" clipRule="evenodd" />
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.26-1.17 4.45-2.86 5.92-1.65 1.45-3.87 2.19-6.09 2.03-2.31-.15-4.48-1.21-5.96-3-1.42-1.74-2.11-4.04-1.89-6.32.22-2.3 1.34-4.43 3.12-5.86 1.73-1.4 3.99-2.07 6.22-1.86.01 1.38.02 2.76 0 4.14-1.3-.12-2.61.16-3.71.85-1.08.67-1.86 1.8-2.06 3.03-.19 1.17.15 2.41.91 3.31.75.87 1.93 1.36 3.09 1.35 1.32-.01 2.55-.66 3.31-1.69.64-.88.98-1.99.98-3.08.01-6.73-.01-13.45.02-20.18z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
