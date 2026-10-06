'use client';

import NewsSection from '@/components/home/NewsSection';
import StandingsMatches from '@/components/home/StandingsMatches';
import QuickLinks from '@/components/home/QuickLinks';
import VideoSection from '@/components/home/VideoSection';
import Achievements from '@/components/home/Achievements';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 1. Hero / Main Slider placeholder */}
        <section className="relative w-full h-[600px] lg:h-[800px] bg-[#0a1628] flex items-center justify-center border-b border-gray-800 overflow-hidden">
          <motion.div 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center"
          ></motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#06101e]/90 via-[#06101e]/60 to-transparent"></div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
             <motion.div 
               initial={{ opacity: 0, x: -100 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
               className="max-w-3xl"
             >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="h-[2px] bg-[#d7bf7b] mb-6"
                ></motion.div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-tight drop-shadow-lg">
                  YENİ MÖVSÜM, <br />
                  <span className="text-[#d7bf7b]">YENİ HƏDƏFLƏR</span>
                </h1>
                <p className="text-gray-300 font-bold text-lg md:text-xl tracking-wide max-w-xl mb-10 drop-shadow-md">
                  Komandamız yeni mövsüm hazırlıqlarını başa çatdırdı və ilk oyuna tam hazırdır. 
                </p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex space-x-6"
                >
                   <button className="bg-[#d7bf7b] text-[#0a1628] hover:bg-white hover:text-black font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-md transition-colors">
                     Ətraflı oxu
                   </button>
                   <button className="border-2 border-[#d7bf7b] text-[#d7bf7b] hover:bg-[#d7bf7b] hover:text-[#0a1628] font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-md transition-colors">
                     Bilet al
                   </button>
                </motion.div>
             </motion.div>
          </div>
        </section>

        {/* 2. Sürətli Keçidlər (4-lü Grid) */}
        <QuickLinks />

        {/* 3. Xəbərlər (News) */}
        <NewsSection />

        {/* 4. Turnir cədvəli & Növbəti oyunlar */}
        <StandingsMatches />

        {/* 5. Yarımada TV */}
        <VideoSection />

        {/* 6. Nailiyyətlər */}
        <Achievements />

      </motion.div>
    </AnimatePresence>
  );
}
