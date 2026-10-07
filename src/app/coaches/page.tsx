'use client';
import { motion } from 'framer-motion';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<any[]>([]);

  useEffect(() => {
    async function loadCoaches() {
      const { data } = await supabase.from('coaches').select('*, teams(name)').order('created_at', { ascending: false });
      if (data) setCoaches(data);
    }
    loadCoaches();
  }, []);

  return (
    <div className="pt-[140px] min-h-screen bg-[#0a1423] pb-20">
      
      {/* Header */}
      <div className="w-full bg-[#152741] py-12 md:py-16 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            MƏŞQÇİLƏR <span className="text-[#d7bf7b]">HEYƏTİ</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d7bf7b] mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Gələcəyin ulduzlarını yetişdirən, yüksək lisenziyalı və təcrübəli məşqçi heyətimizlə tanış olun.
          </p>
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="container mx-auto px-4 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {coaches.map((coach, i) => (
            <motion.div 
              key={coach.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#152741] border border-gray-800 rounded-3xl overflow-hidden hover:border-[#d7bf7b]/50 transition-all duration-300 shadow-xl group"
            >
              <Link href={`/coaches/${coach.id}`} className="block w-full h-72 bg-[#0d1a2d] relative overflow-hidden group-hover:opacity-90 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-t from-[#152741] to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {coach.image_url ? (
                    <img src={coach.image_url} alt={coach.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <svg className="w-20 h-20 text-gray-700 relative z-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  )}
                </div>
              </Link>
              
              <div className="p-6 relative z-20 -mt-10">
                <Link href={`/coaches/${coach.id}`} className="hover:text-[#d7bf7b] transition-colors"><h3 className="text-xl font-black text-white uppercase tracking-widest mb-1">{coach.name}</h3></Link>
                <p className="text-[#d7bf7b] font-bold text-xs uppercase tracking-widest mb-4">{coach.role}</p>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 h-16 line-clamp-3">
                  {coach.teams ? `Aid olduğu komanda: ${coach.teams.name}` : 'Akademiya və Ümumi Məşqçi'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  
                  
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
