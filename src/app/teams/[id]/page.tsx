'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MatchesAndStandings from '@/components/home/MatchesAndStandings';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TeamDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [team, setTeam] = useState<any>(null);
  const [teamPos, setTeamPos] = useState('');
  const [teamImg, setTeamImg] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      const { data: teamData } = await supabase.from('teams').select('*, coaches(name)').eq('id', id).single();
      if (teamData) setTeam(teamData);

      const { data: playersData } = await supabase.from('players').select('*').eq('team_id', id).order('jersey_number', { ascending: true });
      if (playersData) setPlayers(playersData);
      
      const keys = [`team_${id}_pos`, `team_${id}_desc`, `team_${id}_img`];
      const { data: imgData } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
      if (imgData) {
        imgData.forEach(item => {
          if (item.section_key.endsWith('_pos')) setTeamPos(item.image_url);
          if (item.section_key.endsWith('_desc')) setTeamDesc(item.image_url);
          if (item.section_key.endsWith('_img')) setTeamImg(item.image_url);
        });
      }
      setLoading(false);
    }
    loadTeam();
  }, [id]);

  if (loading) return <div className="pt-[180px] min-h-screen bg-bg-deep pb-20 flex justify-center"><div className="text-accent font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div></div>;
  if (!team) return <div className="pt-[180px] min-h-screen bg-bg-deep pb-20 flex justify-center"><div className="text-red-400 font-bold tracking-widest uppercase">Komanda tapılmadı</div></div>;
  

  return (
    <div className="pt-[180px] min-h-screen bg-bg-deep pb-20">
      
      {/* Header Profile */}
      <div className="w-full bg-bg-sec py-12 md:py-16 border-b border-bg-border relative overflow-hidden">
        {teamImg ? (
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${teamImg})` }}></div>
        ) : (
          <div className="absolute inset-0 bg-[url('/placeholder-hero.jpg')] bg-cover bg-center opacity-10 blur-sm"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-[#000000]/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-accent p-1 mb-6 bg-bg-deep shadow-[0_0_30px_rgba(215,191,123,0.3)]">
            <div className="w-full h-full rounded-full relative overflow-hidden flex items-center justify-center">
              <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-black text-text-main uppercase tracking-tighter mb-2"
          >
            {team.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-accent font-bold text-sm uppercase tracking-widest mb-8"
          >
            {team.league || 'Gənclər Liqası'}
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 bg-bg-main/80 backdrop-blur-md border border-bg-border rounded-2xl p-6 shadow-2xl">
            <div className="text-center px-4">
              <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Baş Məşqçi</div>
              <div className="text-text-main text-sm md:text-base font-bold">{team.coaches && team.coaches.length > 0 ? team.coaches[0].name : 'Təyin edilməyib'}</div>
            </div>
            <div className="w-[1px] bg-gray-800 hidden md:block"></div>
            <div className="text-center px-4">
              <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Oyunçu Sayı</div>
              <div className="text-text-main text-sm md:text-base font-bold">{players.length}</div>
            </div>
            <div className="w-[1px] bg-gray-800 hidden md:block"></div>
            <div className="text-center px-4">
              <div className="text-text-sec text-[10px] font-bold uppercase tracking-widest mb-1">Cari Mövqe</div>
              <div className="text-accent text-sm md:text-base font-black">{teamPos || 'Məlumat Yoxdur'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Heyət (Squad) */}
      <div className="container mx-auto px-4 lg:px-8 mt-20">
        <div className="flex items-center justify-between mb-10 border-b border-bg-border pb-4 text-center flex justify-center">
          <h2 className="text-2xl md:text-3xl font-black text-text-main uppercase tracking-tighter">Komanda Heyəti</h2>
          <span className="text-text-sec text-sm font-bold bg-bg-sec px-4 py-1.5 rounded-full border border-bg-border">Sezon 2026/27</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {players.map((player, i) => (
            <motion.div 
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="bg-bg-sec border border-bg-border rounded-2xl overflow-hidden hover:border-accent/50 transition-colors group cursor-pointer relative shadow-lg">
                <div className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-bg-deep/80 backdrop-blur-sm border border-bg-border rounded-full flex items-center justify-center z-10 shadow-lg">
                  <span className="text-accent font-black text-xs md:text-sm">{player.jersey_number || '-'}</span>
                </div>
                <div className="w-full h-48 md:h-64 bg-bg-deep relative overflow-hidden">
                   {/* Placeholder user icon if image is missing */}
                   {player.image_url ? (
                     <img src={player.image_url} alt={player.name} className="absolute inset-0 w-full h-full object-cover" />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center bg-bg-main">
                       <svg className="w-16 h-16 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                     </div>
                   )}
                </div>
                <div className="p-4 md:p-6 text-center border-t border-bg-border bg-gradient-to-t from-bg-deep to-bg-sec">
                  <h3 className="text-text-main font-bold text-sm md:text-base uppercase tracking-wider mb-1 truncate">{player.name}</h3>
                  <p className="text-accent text-[10px] md:text-xs font-bold uppercase tracking-widest">{player.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Standings & Matches reusing the home module */}
      <div className="mt-24">
         <MatchesAndStandings />
      </div>

    </div>
  );
}
