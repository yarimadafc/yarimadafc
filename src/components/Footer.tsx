'use client';

import Link from 'next/link';
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

import Image from 'next/image';
import { Send, Music2, MessageCircle } from 'lucide-react';

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

export default function Footer() {
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSponsors() {
      const { data } = await supabase.from('sponsors').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) setSponsors(data);
    }
    fetchSponsors();
  }, []);

  return (
    <footer className="w-full bg-[#0d1a2d] border-t border-gray-800 pt-8 pb-8 overflow-hidden">
      {/* Sponsors Section - Marquee */}
      <div className="w-full border-b border-gray-800/50 pb-6 mb-10 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 mb-4">
          <h3 className="text-gray-500 font-bold tracking-widest text-xs uppercase flex items-center">
            <span className="w-8 h-[1px] bg-[#d7bf7b] mr-3"></span>
            SPONSORLAR
          </h3>
        </div>
        <div className="relative w-full flex whitespace-nowrap transition-all duration-500 overflow-hidden">
          {/* We duplicate the content to make an infinite marquee loop */}
          <div className="flex animate-[marquee_25s_linear_infinite] items-center space-x-16 px-8 min-w-max">
            {sponsors.length > 0 ? (
              <>
                {[...Array(10)].map((_, i) => (
                  <div key={`s1-group-${i}`} className="flex items-center space-x-16 shrink-0">
                    {sponsors.map(s => (
                      <div key={`s1-${i}-${s.id}`} className="text-white text-lg font-black uppercase tracking-widest flex items-center shrink-0">
                        <img src={s.logo_url} alt={s.name} className="h-10 md:h-14 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="text-white text-lg font-black uppercase tracking-widest shrink-0">SOCAR</div>
                <div className="text-white text-base font-bold uppercase tracking-widest shrink-0">PALMS SPORTS</div>
                <div className="text-white text-base font-bold uppercase tracking-widest shrink-0">KAPPA</div>
                <div className="text-white text-base font-bold uppercase tracking-widest shrink-0">ADQ</div>
                <div className="text-white text-base font-bold uppercase tracking-widest shrink-0">SEA BREEZE</div>
                
                {/* Duplicates for seamless loop */}
                <div className="text-white text-lg font-black uppercase tracking-widest shrink-0">SOCAR</div>
                <div className="text-white text-base font-bold uppercase tracking-widest shrink-0">PALMS SPORTS</div>
                <div className="text-white text-base font-bold uppercase tracking-widest shrink-0">KAPPA</div>
                <div className="text-white text-base font-bold uppercase tracking-widest shrink-0">ADQ</div>
                <div className="text-white text-base font-bold uppercase tracking-widest shrink-0">SEA BREEZE</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 pt-12 border-t border-gray-800/50">
          
          {/* Logo & Slogan */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start md:items-center lg:items-start space-y-4">
            <Link href="/" className="flex items-center space-x-3">
               <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#d7bf7b]">
                 <Image src="/Logo.JPG.jpeg" alt="Yarımada FK" fill className="object-cover" />
               </div>
               <div className="flex flex-col">
                 <span className="text-[#d7bf7b] font-black text-2xl md:text-3xl tracking-tighter uppercase">
                   Yarımada
                 </span>
                 <span className="text-white text-[10px] md:text-xs tracking-[0.3em] font-light mt-1 uppercase">
                   Futbol Klubu
                 </span>
               </div>
            </Link>
            <p className="text-gray-400 font-medium text-xs md:text-sm italic pl-2 md:text-center lg:text-left">
              "Gələcəyin çempionları<br />burada yetişir!"
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col space-y-3 md:space-y-4 col-span-1">
            <Link href="/news" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Xəbərlər</Link>
            <Link href="/club" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Haqqımızda</Link>
            <Link href="/matches" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Oyunlar</Link>
            <Link href="/social" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Sosial media</Link>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col space-y-3 md:space-y-4 col-span-1">
            <Link href="/teams" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Komandalar</Link>
            <Link href="/academy" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Akademiya</Link>
            <Link href="/courses" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Məşqçi Kursu</Link>
            <Link href="/sponsors" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Sponsorlar</Link>
            <Link href="/shop" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Mağaza</Link>
            <Link href="/privacy" className="text-white font-bold text-xs md:text-sm hover:text-[#d7bf7b] transition-colors">Məxfilik siyasəti</Link>
          </div>

          {/* Contact & Address */}
          <div className="col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-3">
              <span className="text-[#d7bf7b] font-bold text-xs md:text-sm tracking-widest uppercase">Əlaqə</span>
              <a href="tel:+994504671321" className="text-white font-medium text-sm hover:text-[#d7bf7b] transition-colors flex items-center space-x-2">
                <span>055 447 74 67</span> <span className="text-gray-500 text-xs">(WhatsApp)</span>
              </a>
              <a href="mailto:info@yarimadafc.com" className="text-white font-medium text-sm hover:text-[#d7bf7b] transition-colors">
                info@yarimadafc.com
              </a>
              <p className="text-gray-400 font-medium text-xs leading-relaxed mt-2">
                Kristal Abşeron 1,<br />
                Xırdalan şəhəri
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="text-[#d7bf7b] font-bold text-xs md:text-sm tracking-widest uppercase">Sosial Media</span>
              <div className="flex flex-col space-y-2">
                <a href="https://www.instagram.com/yarimada_fk/" target="_blank" rel="noopener noreferrer" className="text-white font-medium text-sm hover:text-[#d7bf7b] transition-colors flex items-center space-x-2">
                   <InstagramIcon /> <span>Instagram</span>
                </a>
                <a href="https://www.youtube.com/@yarimada_fk" target="_blank" rel="noopener noreferrer" className="text-white font-medium text-sm hover:text-[#d7bf7b] transition-colors flex items-center space-x-2">
                   <YoutubeIcon /> <span>YouTube</span>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61590640762611" target="_blank" rel="noopener noreferrer" className="text-white font-medium text-sm hover:text-[#d7bf7b] transition-colors flex items-center space-x-2">
                   <FacebookIcon /> <span>Facebook</span>
                </a>
                <a href="https://www.tiktok.com/@yarimadafk" target="_blank" rel="noopener noreferrer" className="text-white font-medium text-sm hover:text-[#d7bf7b] transition-colors flex items-center space-x-2">
                   <TiktokIcon /> <span>TikTok</span>
                </a>
                <a href="https://t.me/yarimadafk?fbclid=PAZXh0bgNhZW0CMTEAcGRvZgRzcnRjBmFwcF9pZAwyNTYyODEwNDA1NTgAAafK0KsTFGaHEdkdFqPvdB_YUJuYByPtPKvdfmdCKantOLunANZ5C8nrnroI0A_aem_3_m_V6XwTbX1OL0eUZhRoA" target="_blank" rel="noopener noreferrer" className="text-white font-medium text-sm hover:text-[#d7bf7b] transition-colors flex items-center space-x-2">
                   <TelegramIcon /> <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Socials */}
        <div className="mt-12 flex flex-col items-center justify-center pt-8 border-t border-gray-800/50">
          <div className="text-gray-600 font-semibold text-[10px] md:text-xs">
            © {new Date().getFullYear()} Yarımada FK. Bütün hüquqlar qorunur.
          </div>
        </div>
      </div>
    </footer>
  );
}
