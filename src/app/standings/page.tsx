'use client';
import { motion } from 'framer-motion';
import MatchesAndStandings from '@/components/home/MatchesAndStandings';

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen bg-[#0a1423] pt-[140px] pb-20">
      <div className="w-full bg-[#152741] py-12 md:py-16 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            TURNİR <span className="text-[#d7bf7b]">CƏDVƏLİ</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d7bf7b] mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Komandalarımızın iştirak etdiyi liqalardakı mövcud vəziyyəti və növbəti oyunları.
          </p>
        </div>
      </div>
      <MatchesAndStandings />
      </div>
    </motion.div>
  );
}
