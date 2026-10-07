'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Trophy, ArrowLeft } from 'lucide-react';

export default function StandingsPage() {
  const [leagues, setLeagues] = useState<string[]>([]);
  const [activeLeague, setActiveLeague] = useState<string | null>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Get the categories/leagues
      const { data: tData } = await supabase.from('teams').select('name').order('name', { ascending: true });
      if (tData && tData.length > 0) {
        const names = tData.map(t => t.name).sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.replace(/\D/g, '')) || 0;
          return numA - numB;
        });
        // Remove duplicates just in case
        const uniqueNames = Array.from(new Set(names));
        setLeagues(uniqueNames);
      }
      
      const { data: sData } = await supabase.from('standings').select('*').order('points', { ascending: false });
      if (sData) {
        setStandings(sData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const activeStandings = activeLeague ? standings.filter(s => s.tournament_name === activeLeague) : [];

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
              Komandalarımızın iştirak etdiyi liqalardakı mövcud vəziyyəti.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 mt-12">
          {loading ? (
            <div className="text-[#d7bf7b] font-bold text-lg text-center animate-pulse">Yüklənir...</div>
          ) : (
            <AnimatePresence mode="wait">
              {!activeLeague ? (
                <motion.div 
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {leagues.map((league, i) => (
                    <div 
                      key={league}
                      onClick={() => setActiveLeague(league)}
                      className="bg-[#152741] border border-gray-800 hover:border-[#d7bf7b]/50 p-6 rounded-2xl cursor-pointer group transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-[#0d1a2d] flex items-center justify-center border border-gray-700 group-hover:border-[#d7bf7b]/50 transition-colors">
                          <Trophy className="w-6 h-6 text-[#d7bf7b]" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest group-hover:text-[#d7bf7b] transition-colors">{league}</h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#d7bf7b] transition-colors" />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="table"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <button 
                    onClick={() => setActiveLeague(null)}
                    className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest bg-[#152741] px-4 py-2 rounded-lg border border-gray-800 hover:border-[#d7bf7b]/50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Bütün Komandalara Qayıt
                  </button>

                  <div className="bg-[#152741] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                    <div className="bg-[#0d1a2d] py-6 px-8 border-b border-gray-800 flex items-center">
                      <Trophy className="w-6 h-6 text-[#d7bf7b] mr-3" />
                      <h2 className="text-2xl font-black text-white uppercase tracking-widest">{activeLeague} Qrupu</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-300 min-w-[600px]">
                        <thead className="bg-[#0d1a2d]/50 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                          <tr>
                            <th className="py-5 px-6">Komanda</th>
                            <th className="py-5 px-3 text-center" title="Oyun">O</th>
                            <th className="py-5 px-3 text-center" title="Qələbə">Q</th>
                            <th className="py-5 px-3 text-center" title="Heç-heçə">H</th>
                            <th className="py-5 px-3 text-center" title="Məğlubiyyət">M</th>
                            <th className="py-5 px-3 text-center text-green-400" title="Vurduğu Qol">VQ</th>
                            <th className="py-5 px-3 text-center text-red-400" title="Buraxdığı Top">BT</th>
                            <th className="py-5 px-6 text-center text-[#d7bf7b]" title="Xal">Xal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {activeStandings.map((team, idx) => (
                            <tr key={team.id} className="hover:bg-[#0d1a2d]/30 transition-colors">
                              <td className="py-4 px-6 flex items-center space-x-3">
                                <span className={`w-6 text-center font-bold text-xs ${idx < 3 ? 'text-[#d7bf7b]' : 'text-gray-500'}`}>{idx + 1}</span>
                                <span className="font-bold text-white tracking-wider">{team.team_name}</span>
                              </td>
                              <td className="py-4 px-3 text-center font-medium">{team.played}</td>
                              <td className="py-4 px-3 text-center font-medium">{team.won}</td>
                              <td className="py-4 px-3 text-center font-medium">{team.drawn}</td>
                              <td className="py-4 px-3 text-center font-medium">{team.lost}</td>
                              <td className="py-4 px-3 text-center font-medium text-green-400">{team.gf || 0}</td>
                              <td className="py-4 px-3 text-center font-medium text-red-400">{team.ga || 0}</td>
                              <td className="py-4 px-6 text-center text-[#d7bf7b] font-black text-base">{team.points}</td>
                            </tr>
                          ))}
                          {activeStandings.length === 0 && (
                            <tr>
                              <td colSpan={8} className="py-10 text-center text-gray-500 font-medium">
                                Bu qrup üçün cədvəl məlumatı yoxdur.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
