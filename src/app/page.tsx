'use client';
import Link from "next/link";


import NewsSection from '@/components/home/NewsSection';
import StandingsMatches from '@/components/home/StandingsMatches';
import QuickLinks from '@/components/home/QuickLinks';
import VideoSection from '@/components/home/VideoSection';
import Achievements from '@/components/home/Achievements';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('az-AZ', { hour12: false }));
      
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      setDate(now.toLocaleDateString('az-AZ', options));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 1. Hero / Main Slider placeholder */}
        <section className="relative w-full h-[700px] lg:h-[800px] bg-[#152741] flex items-center justify-center border-b border-gray-800 overflow-hidden">
          <motion.div 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center"
          ></motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a2d]/90 via-[#0d1a2d]/60 to-transparent"></div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full h-full flex items-center">
             <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mt-16 lg:mt-0">
               {/* Left Content */}
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                 className="max-w-xl w-full lg:w-1/2"
               >
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 48 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="h-[2px] bg-[#d7bf7b] mb-6"
                  ></motion.div>
                  <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-tight drop-shadow-lg">
                    YENİ MÖVSÜM, <br />
                    <span className="text-[#d7bf7b]">YENİ HƏDƏFLƏR</span>
                  </h1>
                  <p className="text-gray-300 font-bold text-base md:text-lg tracking-wide max-w-lg mb-10 drop-shadow-md">
                    Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!
                  </p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
                  >
                     <Link href="/teams" className="bg-[#d7bf7b] text-[#152741] hover:bg-white hover:text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-md transition-colors text-center inline-block shadow-[0_0_15px_rgba(215,191,123,0.3)]">
                       Komandalarımıza bax
                     </Link>
                  </motion.div>
               </motion.div>

               {/* Right Content: Clock & Next Match Widget */}
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                 className="w-full lg:w-[450px] flex flex-col space-y-6"
               >
                 {/* Clock & Date Widget */}
                 <div className="bg-[#0a1423]/70 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Təqvim</span>
                     <span className="text-white font-medium text-lg">{date}</span>
                   </div>
                   <div className="flex flex-col items-end">
                     <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Bakı vaxtı</span>
                     <span className="text-[#d7bf7b] font-mono font-bold tracking-widest text-xl drop-shadow-[0_0_8px_rgba(215,191,123,0.6)]">{time || '00:00:00'}</span>
                   </div>
                 </div>

                 {/* Next Match Widget */}
                 <div className="bg-gradient-to-br from-[#112240]/90 to-[#152741]/90 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#d7bf7b]/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110"></div>
                   
                   <div className="flex items-center justify-between mb-6">
                     <span className="text-[#d7bf7b] font-bold tracking-[0.2em] text-[10px] uppercase">Növbəti Oyun</span>
                     <span className="text-gray-400 text-[11px] font-medium tracking-wide">U-12 Premyer Liqa</span>
                   </div>

                   <div className="flex items-center justify-between mb-8 relative">
                     {/* Team 1 */}
                     <div className="flex flex-col items-center space-y-3 w-[40%]">
                       <div className="w-12 h-12 rounded-full border border-gray-700 bg-[#0d1a2d] flex items-center justify-center p-2 shadow-inner">
                         <div className="w-full h-full relative">
                           <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                         </div>
                       </div>
                       <span className="font-black text-white tracking-widest text-xs uppercase text-center">YARIMADA</span>
                     </div>
                     
                     {/* VS */}
                     <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-10px]">
                       <div className="w-8 h-8 rounded-full bg-[#0a1423] border border-gray-700 flex items-center justify-center shadow-lg">
                         <span className="text-[#d7bf7b] text-[10px] font-black italic">VS</span>
                       </div>
                     </div>

                     {/* Team 2 */}
                     <div className="flex flex-col items-center space-y-3 w-[40%]">
                       <div className="w-12 h-12 rounded-full border border-gray-700 bg-white flex items-center justify-center p-2 shadow-inner">
                         {/* Placeholder logo for opponent */}
                         <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                       </div>
                       <span className="font-black text-white tracking-widest text-xs uppercase text-center">NEFTÇİ</span>
                     </div>
                   </div>

                   <div className="w-full bg-[#0a1423] rounded-lg p-3 flex justify-between items-center border border-gray-800">
                     <div className="flex flex-col">
                       <span className="text-gray-500 text-[10px] uppercase tracking-widest mb-0.5">Tarix / Saat</span>
                       <span className="text-white text-xs font-bold">15 Okt • 20:00</span>
                     </div>
                     <Link href="/matches" className="text-[#d7bf7b] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center group-hover:underline underline-offset-4">
                       Ətraflı &rarr;
                     </Link>
                   </div>
                 </div>
               </motion.div>
             </div>
          </div>
        </section>

        {/* 2. Sürətli Keçidlər (4-lü Grid) */}
        <QuickLinks />

        {/* 3. Turnir cədvəli & Növbəti oyunlar */}
        <StandingsMatches />

        {/* 4. Xəbərlər (News) */}
        <NewsSection />

        {/* 5. Yarımada TV */}
        <VideoSection />

        {/* 6. Nailiyyətlər */}
        <Achievements />

      </motion.div>
    </AnimatePresence>
  );
}
