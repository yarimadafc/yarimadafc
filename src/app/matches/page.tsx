'use client';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    async function loadMatches() {
      const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
      if (data) setMatches(data);
      setLoading(false);
    }
    loadMatches();
  }, []);

  // Determine if a match is past based on date
  const isPast = (m: any) => {
    if (!m.match_date) return false;
    const matchDateTime = new Date(`${m.match_date}T${m.match_time || '00:00'}`);
    return matchDateTime < new Date();
  };

  const upcomingMatches = matches.filter(m => !isPast(m));
  const pastMatches = matches.filter(m => isPast(m)).sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime()); // Past matches sorted newest first

  const displayMatches = activeTab === 'upcoming' ? upcomingMatches : pastMatches;

  return (
    <PageTransition title="BÜTÜN OYUNLAR">
      <div className="min-h-screen bg-[#0a1423] pt-24 pb-20">
        
        <div className="w-full bg-[#152741] py-16 md:py-24 border-b border-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
            >
              BÜTÜN <span className="text-[#d7bf7b]">OYUNLAR</span>
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-[#d7bf7b] mx-auto mb-6"
            ></motion.div>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
              Komandalarımızın qarşıdakı oyun təqvimi və keçmiş oyunların nəticələri.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 mt-12">
          
          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#152741] p-1 rounded-xl flex border border-gray-800">
              <button 
                onClick={() => setActiveTab('upcoming')}
                className={`px-8 py-3 rounded-lg font-black uppercase text-xs tracking-widest transition-colors ${activeTab === 'upcoming' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white'}`}
              >
                Qarşıdakı Oyunlar
              </button>
              <button 
                onClick={() => setActiveTab('past')}
                className={`px-8 py-3 rounded-lg font-black uppercase text-xs tracking-widest transition-colors ${activeTab === 'past' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white'}`}
              >
                Keçmiş Oyunlar
              </button>
            </div>
          </div>

          {/* Matches Grid */}
          {loading ? (
            <div className="text-center py-20 text-[#d7bf7b] font-bold tracking-widest animate-pulse uppercase">Yüklənir...</div>
          ) : displayMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {displayMatches.map((m, i) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-[#152741] rounded-2xl border border-gray-800 p-6 flex flex-col md:flex-row items-center justify-between hover:border-[#d7bf7b]/30 transition-colors shadow-lg"
                >
                  {/* Date & Info */}
                  <div className="flex flex-col items-center justify-center w-full md:w-1/4 mb-6 md:mb-0 border-b md:border-b-0 md:border-r border-gray-800 pb-6 md:pb-0 md:pr-6 shrink-0">
                     <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1 text-center line-clamp-1">{m.tournament || 'Yoldaşlıq'}</span>
                     <span className="text-white font-black text-2xl">{m.match_date?.split('-')[2] || '??'}</span>
                     <span className="text-[#d7bf7b] font-bold text-xs uppercase">{m.match_date?.split('-')[1] ? new Date(m.match_date).toLocaleString('az-AZ', { month: 'short' }) : 'Ay'}</span>
                     
                     {activeTab === 'past' ? (
                        <div className="mt-3 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          BİTDİ
                        </div>
                     ) : (
                        <span className="text-gray-500 font-bold text-[10px] mt-2">{m.match_time}</span>
                     )}
                     <span className="text-gray-600 font-medium text-[9px] mt-1 text-center leading-tight line-clamp-1">{m.stadium}</span>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between w-full md:w-3/4 md:pl-6">
                    <div className="flex flex-col items-center w-2/5">
                      <div className="w-16 h-16 bg-[#0a1423] rounded-full border border-gray-700 flex items-center justify-center p-1 mb-3 shadow-inner overflow-hidden">
                        {m.home_logo ? (
                          <img src={m.home_logo} alt={m.home_team} className="w-full h-full object-contain bg-white rounded-full p-1" />
                        ) : m.home_team.includes('Yarımada') ? (
                          <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full bg-gray-800 rounded-full"></div>
                        )}
                      </div>
                      <span className="text-white font-black text-xs md:text-sm text-center uppercase leading-tight line-clamp-2">{m.home_team}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center w-1/5 shrink-0">
                      {activeTab === 'past' && m.home_score !== null && m.away_score !== null ? (
                        <div className="flex items-center space-x-2">
                           <span className="text-white font-black text-2xl">{m.home_score}</span>
                           <span className="text-gray-500 font-bold">-</span>
                           <span className="text-white font-black text-2xl">{m.away_score}</span>
                        </div>
                      ) : (
                        <span className="text-[#d7bf7b] font-black text-lg italic opacity-50">VS</span>
                      )}
                    </div>

                    <div className="flex flex-col items-center w-2/5">
                      <div className="w-16 h-16 bg-[#0a1423] rounded-full border border-gray-700 flex items-center justify-center p-1 mb-3 shadow-inner overflow-hidden">
                        {m.away_logo ? (
                          <img src={m.away_logo} alt={m.away_team} className="w-full h-full object-contain bg-white rounded-full p-1" />
                        ) : m.away_team.includes('Yarımada') ? (
                          <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full bg-gray-800 rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-300 font-black text-xs md:text-sm text-center uppercase leading-tight line-clamp-2">{m.away_team}</span>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-40 border-2 border-dashed border-gray-800 rounded-2xl max-w-5xl mx-auto">
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm text-center">
                Bu bölmədə oyun tapılmadı.
              </p>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
