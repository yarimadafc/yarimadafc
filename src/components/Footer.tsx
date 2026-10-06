import Link from 'next/link';
import { Send, Music2, MessageCircle } from 'lucide-react';

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

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
              <YoutubeIcon />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <InstagramIcon />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <FacebookIcon />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-[#d7bf7b] hover:text-[#0a1628] transition-colors">
              <TwitterIcon />
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
