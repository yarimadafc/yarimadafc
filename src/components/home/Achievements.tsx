'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Achievements() {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAchievements() {
      const { data } = await supabase.from('achievements').select('*').order('order_num', { ascending: true });
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
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0a1423] border border-gray-800 p-8 rounded-2xl text-center shadow-xl hover:border-[#d7bf7b]/30 transition-colors"
              >
                <div className="text-4xl md:text-5xl font-black text-[#d7bf7b] mb-3">{item.count}</div>
                <div className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed">{item.title}</div>
              </motion.div>
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
