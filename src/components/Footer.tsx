import Link from 'next/link';
import { Youtube, Instagram, Facebook, Twitter, Send, Music2, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#06101e] border-t border-gray-800 pt-16 pb-8">
      {/* Sponsors Section */}
      <div className="container mx-auto px-4 lg:px-8 mb-16">
        <div className="flex flex-col items-center space-y-10">
          <div className="w-full flex justify-center">
            <h3 className="text-gray-500 font-bold tracking-widest text-sm uppercase">Tərəfdaşlarımız</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder for Sponsor Logos */}
            <div className="text-white text-2xl font-black">SOCAR</div>
            <div className="text-white text-xl font-bold">PALMS SPORTS</div>
            <div className="text-white text-xl font-bold">KAPPA</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pt-12 border-t border-gray-800/50">
          
          {/* Logo */}
          <div className="col-span-1 flex justify-start lg:justify-center">
            <Link href="/preview" className="flex flex-col items-center">
               <span className="text-[#d7bf7b] font-black text-4xl tracking-tighter uppercase">
                 Yarımada
               </span>
               <span className="text-white text-xs tracking-[0.3em] font-light mt-2 uppercase">
                 Futbol Klubu
               </span>
            </Link>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col space-y-4">
            <Link href="/preview/news" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Xəbərlər</Link>
            <Link href="/preview/club" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Klub</Link>
            <Link href="/preview/matches" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Oyunlar</Link>
            <Link href="/preview/social" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Sosial media</Link>
            <Link href="/preview/tickets" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Biletlər</Link>
            <Link href="/preview/media" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Media (TV)</Link>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col space-y-4">
            <Link href="/preview/teams" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Komandalar</Link>
            <Link href="/preview/academy" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Akademiya</Link>
            <Link href="/preview/history" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Tarix</Link>
            <Link href="/preview/sponsors" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Sponsorlar</Link>
            <Link href="/preview/shop" className="text-white font-bold text-sm hover:text-[#d7bf7b] transition-colors">Mağaza</Link>
          </div>

          {/* Contact & Address */}
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-2">
              <span className="text-white font-bold text-sm">Əlaqə</span>
              <a href="tel:+994551234567" className="text-white font-bold text-base hover:text-[#d7bf7b] transition-colors">
                (+994) 55 123 45 67
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-white font-bold text-sm">Ünvan</span>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">
                Bakı şəhəri, Suraxanı rayonu,<br />
                Qaraçuxur qəsəbəsi,<br />
                Neftçilər parkının yanı
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Section: Apps & Socials */}
        <div className="mt-16 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 pt-8 border-t border-gray-800/50">
          
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <span className="text-white font-bold text-sm">Proqramlarımızı yükləyin</span>
            <div className="flex space-x-4">
              <button className="bg-black border border-gray-700 hover:border-[#d7bf7b] transition-colors rounded-lg px-4 py-2 flex items-center space-x-2">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-gray-400 font-semibold">Yükləyin</span>
                  <span className="text-white text-sm font-bold">App Store</span>
                </div>
              </button>
              <button className="bg-black border border-gray-700 hover:border-[#d7bf7b] transition-colors rounded-lg px-4 py-2 flex items-center space-x-2">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-gray-400 font-semibold">Əldə edin</span>
                  <span className="text-white text-sm font-bold">Google Play</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <Send className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <Music2 className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

        </div>

        <div className="mt-8 text-center text-gray-600 font-semibold text-xs pb-4">
          © {new Date().getFullYear()} Yarımada FK. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
}
