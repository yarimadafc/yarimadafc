'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MatchesSection() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      // Get the next 4 matches
      const { data } = await supabase.from('matches').select('*').order('date', { ascending: false }).limit(4);
      if (data) setMatches(data);
    }
    fetchMatches();
  }, []);

  return (
    <section className="bg-bg-deep py-20 border-b border-bg-border">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight">Təqvim və nəticələr</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/matches" className="text-text-sec font-medium text-sm hover:text-text-main transition-colors border-b border-transparent hover:border-white pb-1">
              Bütün nəticələr
            </Link>
          </motion.div>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {matches.map((m, i) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-bg-main rounded-xl border border-bg-border flex flex-col items-center pt-6 pb-4 hover:border-bg-border transition-colors group"
              >
                {/* League */}
                <div className="text-text-main font-bold text-[15px] mb-4 text-center">
                  {m.tournament || 'Yoldaşlıq'}
                </div>
                
                <div className="w-full h-px bg-[#1f1f1f] mb-4"></div>

                {/* Date & Stadium */}
                <div className="text-text-sec text-[11px] font-medium text-center mb-6">
                  {m.date || '??'} {m.time || '??'}<br />
                  {m.stadium || 'Palms Sports Arena'}
                </div>

                {/* Teams */}
                <div className="flex items-center justify-center w-full px-4 mb-8">
                  <div className="flex flex-col items-center w-2/5">
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                      {m.home_logo ? (
                        <img src={m.home_logo} alt={m.home_team} className="max-w-full max-h-full object-contain" />
                      ) : m.home_team?.includes('Yarımada') ? (
                        <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-10 h-10 object-cover rounded-full" />
                      ) : (
                        <div className="w-10 h-10 bg-bg-sec rounded-full flex items-center justify-center text-[10px] text-text-sec text-center leading-none px-1 overflow-hidden">{m.home_team?.substring(0,3)}</div>
                      )}
                    </div>
                    <span className="text-text-main font-medium text-[11px] text-center leading-tight truncate w-full">{m.home_team}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center w-1/5">
                    <span className="text-text-main font-bold text-xl">
                      {m.status === 'finished' ? `${m.home_score} - ${m.away_score}` : '-'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center w-2/5">
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                      {m.away_logo ? (
                        <img src={m.away_logo} alt={m.away_team} className="max-w-full max-h-full object-contain" />
                      ) : m.away_team?.includes('Yarımada') ? (
                        <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-10 h-10 object-cover rounded-full" />
                      ) : (
                        <div className="w-10 h-10 bg-bg-sec rounded-full flex items-center justify-center text-[10px] text-text-sec text-center leading-none px-1 overflow-hidden">{m.away_team?.substring(0,3)}</div>
                      )}
                    </div>
                    <span className="text-text-main font-medium text-[11px] text-center leading-tight truncate w-full">{m.away_team}</span>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-auto">
                  <Link href="/matches" className="text-accent font-medium text-[13px] hover:text-[#ebd38a] transition-colors">
                    Təqvim
                  </Link>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 border border-bg-border rounded-xl">
            <p className="text-text-sec font-medium text-sm text-center">
              Hazırda təyin olunmuş oyun yoxdur.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
