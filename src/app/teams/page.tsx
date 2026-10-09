'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    async function loadTeams() {
      const { data } = await supabase.from('teams').select('*, coaches(name), players(id)').order('created_at', { ascending: false });
      if (data) setTeams(data);
    }
    loadTeams();
  }, []);

  return (
    <div className="pt-header min-h-screen bg-bg-deep pb-20">
      
      {/* Header */}
      <PageHero title="Yarımada Komandaları" subtitle="Klubumuzun bütün yaş qrupları üzrə komandaları və onların liqalardakı iştirakı ilə yaxından tanış olun. Gələcəyin ulduzları məhz burada formalaşır." />

      {/* Teams Grid */}
      <div className="container mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {teams.map((team, i) => (
            <motion.div 
              key={team.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={`/teams/${team.id}`} className="block group">
                <div className="led-border led-hover card-fx bg-bg-sec border border-bg-border rounded-3xl p-8 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125"></div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter">{team.name}</h2>
                      <div className="w-12 h-12 rounded-full border-2 border-accent p-1 flex items-center justify-center">
                        <div className="w-full h-full bg-bg-deep rounded-full flex items-center justify-center relative overflow-hidden">
                          <img src="/Logo.JPG.jpeg" alt="Yarımada FK" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col border-b border-bg-border pb-3">
                        <span className="text-text-sec text-[10px] uppercase tracking-widest font-bold mb-1">Turnir / Liqa</span>
                        <span className="text-text-main text-sm font-medium">{team.league || 'Gənclər Liqası'}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-bg-border pb-3">
                        <div className="flex flex-col">
                          <span className="text-text-sec text-[10px] uppercase tracking-widest font-bold mb-1">Baş Məşqçi</span>
                          <span className="text-text-main text-sm font-medium">{team.coaches && team.coaches.length > 0 ? team.coaches[0].name : 'Təyin edilməyib'}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-text-sec text-[10px] uppercase tracking-widest font-bold mb-1">Oyunçu Sayı</span>
                          <span className="text-accent text-lg font-black">{team.players ? team.players.length : 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between w-full">
                    <span className="text-accent text-xs font-bold uppercase tracking-widest group-hover:text-text-main transition-colors">
                      Komanda Haqqında
                    </span>
                    <div className="w-8 h-8 rounded-full bg-bg-deep border border-bg-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-text-sec group-hover:text-on-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
