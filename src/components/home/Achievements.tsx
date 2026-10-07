'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, Medal, Star } from 'lucide-react';

export default function Achievements() {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAchievements() {
      const { data } = await supabase.from('achievements').select('*').order('created_at', { ascending: false });
      if (data) setAchievements(data);
    }
    fetchAchievements();
  }, []);

  return (
    <section className="bg-[#152741] py-24 border-b border-gray-800/50 overflow-hidden relative">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#d7bf7b]/5 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Nailiyyətlər</h2>
        </motion.div>

        {/* Grid for Achievement Stats */}
        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {achievements.map((item, i) => (
              <Link href={`/achievements/${item.id}`} key={item.id} className="block group">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0a1423] border border-gray-800 p-8 rounded-2xl text-center shadow-xl hover:-translate-y-2 hover:border-[#d7bf7b]/30 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-center items-center"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 bg-[#d7bf7b]"></div>
                
                {item.image_url ? (
                  <div className="w-20 h-20 mx-auto mb-6 relative z-10 flex items-center justify-center">
                    <img src={item.image_url} alt="img" className="max-w-full max-h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                  </div>
                ) : (
                  <div className="flex justify-center mb-6 relative z-10">
                    {item.order_num === 1 && <Trophy className="w-12 h-12 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />}
                    {item.order_num === 2 && <Medal className="w-12 h-12 text-gray-300 drop-shadow-[0_0_15px_rgba(209,213,219,0.5)]" />}
                    {item.order_num === 3 && <Medal className="w-12 h-12 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />}
                    {(item.order_num === 0 || item.order_num === null) && <Star className="w-12 h-12 text-[#d7bf7b] drop-shadow-[0_0_15px_rgba(215,191,123,0.5)]" />}
                  </div>
                )}

                <div className="text-4xl md:text-5xl font-black text-white mb-3 relative z-10">{item.count}</div>
                <div className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed relative z-10">{item.title}</div>
              </motion.div>
            </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 border-2 border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm text-center">
              Tezliklə yeni nailiyyətlər əlavə olunacaq...
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
