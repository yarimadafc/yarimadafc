'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MatchesSection() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      // Get the next 3 or 4 matches
      const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true }).limit(4);
      if (data) setMatches(data);
    }
    fetchMatches();
  }, []);

  return (
    <section className="bg-[#0a1423] py-24 border-b border-gray-800/50 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <span className="w-8 h-1 bg-[#d7bf7b]"></span>
              <span className="text-[#d7bf7b] font-bold tracking-widest text-sm uppercase">Təqvim</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Qarşıdakı Oyunlar</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link href="/matches" className="text-[#d7bf7b] font-bold uppercase tracking-widest text-xs hover:text-white transition-colors flex items-center group">
              Bütün Oyunlara Bax 
              <span className="ml-2 group-hover:translate-x-2 transition-transform">&rarr;</span>
            </Link>
          </motion.div>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((m, i) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#152741] rounded-2xl border border-gray-800 p-6 flex flex-col md:flex-row items-center justify-between hover:border-[#d7bf7b]/30 transition-colors group"
              >
                {/* Date & Time */}
                <div className="flex flex-col items-center justify-center w-full md:w-1/4 mb-6 md:mb-0 border-b md:border-b-0 md:border-r border-gray-800 pb-6 md:pb-0 md:pr-6">
                   <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">{m.tournament || 'Yoldaşlıq'}</span>
                   <span className="text-white font-black text-2xl">{m.match_date?.split('-')[2] || '??'}</span>
                   <span className="text-[#d7bf7b] font-bold text-xs uppercase">{m.match_date?.split('-')[1] ? new Date(m.match_date).toLocaleString('az-AZ', { month: 'short' }) : 'Ay'}</span>
                   <span className="text-gray-500 font-bold text-[10px] mt-2">{m.match_time}</span>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between w-full md:w-3/4 md:pl-6">
                  <div className="flex flex-col items-center w-2/5">
                    <div className="w-16 h-16 bg-[#0a1423] rounded-full border border-gray-700 flex items-center justify-center p-2 mb-3 shadow-inner">
                      {m.home_logo ? (
                        <img src={m.home_logo} alt={m.home_team} className="w-full h-full object-contain bg-white rounded-full p-1" />
                      ) : m.home_team.includes('Yarımada') ? (
                        <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-white font-black text-sm text-center uppercase leading-tight">{m.home_team}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center w-1/5">
                    <span className="text-[#d7bf7b] font-black text-xl italic mb-1">VS</span>
                  </div>

                  <div className="flex flex-col items-center w-2/5">
                    <div className="w-16 h-16 bg-[#0a1423] rounded-full border border-gray-700 flex items-center justify-center p-2 mb-3 shadow-inner">
                      {m.away_logo ? (
                        <img src={m.away_logo} alt={m.away_team} className="w-full h-full object-contain bg-white rounded-full p-1" />
                      ) : m.away_team.includes('Yarımada') ? (
                        <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-300 font-black text-sm text-center uppercase leading-tight">{m.away_team}</span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 border-2 border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm text-center">
              Hazırda təyin olunmuş oyun yoxdur.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
