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
      const { data } = await supabase.from('achievements').select('*').order('created_at', { ascending: false }).limit(4);
      if (data) setAchievements(data);
    }
    fetchAchievements();
  }, []);

  return (
    <section className="bg-bg-deep py-24 border-b border-bg-border">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mb-20"
        >
          <h2 className="text-4xl font-bold text-text-main tracking-tight">Nailiyyətlər</h2>
        </motion.div>

        {/* Grid for Achievement Stats */}
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1f1f1f]">
            {achievements.map((item, i) => (
              <Link href={`/achievements/${item.id}`} key={item.id} className="block group px-4 py-8 md:py-0 text-center flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  {/* Icon / Image */}
                  <div className="w-16 h-24 mb-6 flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt="img" className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_8px_rgba(215,191,123,0.3)] group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Trophy className="w-16 h-16 text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                  
                  {/* Number & Text */}
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-5xl md:text-6xl font-bold text-text-main">{item.count}</span>
                    <span className="text-xs md:text-sm text-text-sec font-medium leading-tight max-w-[120px]">{item.title}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-text-sec font-medium text-sm">
              Tezliklə yeni nailiyyətlər əlavə olunacaq...
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
