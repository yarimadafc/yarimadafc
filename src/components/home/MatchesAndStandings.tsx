'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MatchesAndStandings() {
  const [standings, setStandings] = useState<any[]>([]);
  const [activeLeague, setActiveLeague] = useState('U-12');
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [nextMatch, setNextMatch] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: sData } = await supabase.from('standings').select('*').order('points', { ascending: false });
      if (sData) setStandings(sData);

      const { data: mData } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
      if (mData) {
        setAllMatches(mData);
        setNextMatch(mData.find((m: any) => (m.tournament || 'U-12') === 'U-12') || null);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="bg-[#0a1423] py-20 border-b border-gray-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d7bf7b]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Növbəti Oyun */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col h-full"
          >
            <div className="flex items-center space-x-4 mb-8">
              <span className="w-8 h-1 bg-[#d7bf7b]"></span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Növbəti Oyun</h2>
            </div>

            <div className="bg-gradient-to-br from-[#152741] to-[#0d1a2d] rounded-3xl border border-gray-800 p-8 flex flex-col relative overflow-hidden shadow-2xl h-full justify-between">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern.png')] opacity-5"></div>
              
              {nextMatch ? (
                <>
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <span className="bg-[#d7bf7b] text-[#152741] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      {nextMatch.tournament || 'Gənclər Liqası'}
                    </span>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest bg-[#0a1423] px-3 py-1 rounded-full border border-gray-800">
                      {nextMatch.match_date}
                    </span>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between relative z-10 mb-8">
                    <div className="flex flex-col items-center space-y-3 w-2/5">
                      <div className="w-20 h-20 bg-[#0a1423] rounded-full border-2 border-gray-700 flex items-center justify-center p-3 shadow-inner">
                        <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                      <span className="text-white font-black text-lg text-center leading-tight uppercase">{nextMatch.home_team}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center w-1/5">
                      <span className="text-[#d7bf7b] font-black text-3xl mb-1">VS</span>
                      <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{nextMatch.match_time}</span>
                    </div>

                    <div className="flex flex-col items-center space-y-3 w-2/5">
                      <div className="w-20 h-20 bg-[#0a1423] rounded-full border-2 border-gray-700 flex items-center justify-center p-3 shadow-inner">
                         <div className="w-12 h-12 rounded-full bg-gray-800"></div>
                      </div>
                      <span className="text-gray-300 font-black text-lg text-center leading-tight uppercase">{nextMatch.away_team}</span>
                    </div>
                  </div>

                  <div className="text-center relative z-10 bg-[#0a1423]/50 py-4 rounded-xl border border-gray-800/50 mt-auto">
                    <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                      Stadion: {nextMatch.stadium || 'Məlumat Yoxdur'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                   <div className="text-[#d7bf7b] text-4xl mb-4">⚽</div>
                   <h3 className="text-white font-bold uppercase tracking-widest mb-2">Təqvim Boşdur</h3>
                   <p className="text-gray-500 text-sm">Hazırda təyin olunmuş növbəti oyun yoxdur.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Turnir Cədvəli */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col h-full mt-12 lg:mt-0"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <span className="w-8 h-1 bg-[#d7bf7b]"></span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Turnir Cədvəli</h2>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {['U-12', 'U-11', 'U-10', 'U-9'].map(league => (
                  <button 
                    key={league}
                    onClick={() => {
                      setActiveLeague(league);
                      setNextMatch(allMatches.find((m: any) => (m.tournament || 'U-12') === league) || null);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${activeLeague === league ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400 border border-gray-800 hover:text-white'}`}
                  >
                    {league}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#152741] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="overflow-x-auto flex-grow">
                <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
                  <thead className="bg-[#0d1a2d] text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                    <tr>
                      <th className="py-5 px-6">Komanda</th>
                      <th className="py-5 px-3 text-center">O</th>
                      <th className="py-5 px-3 text-center">Q</th>
                      <th className="py-5 px-3 text-center">H</th>
                      <th className="py-5 px-3 text-center">M</th>
                      <th className="py-5 px-6 text-center text-[#d7bf7b]">Xal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.filter(s => (s.tournament_name || 'U-12') === activeLeague).map((team, idx) => (
                      <tr 
                        key={team.id} 
                        className={`border-t border-gray-800 transition-colors ${team.team_name.includes('Yarımada') ? 'bg-[#d7bf7b]/10' : 'hover:bg-[#1a2e4c]'}`}
                      >
                        <td className="py-4 px-6 flex items-center space-x-4">
                          <span className={`w-5 font-black text-xs ${idx < 3 ? 'text-[#d7bf7b]' : 'text-gray-500'}`}>{idx + 1}</span>
                          <span className={`font-bold ${team.team_name.includes('Yarımada') ? 'text-[#d7bf7b]' : 'text-white'}`}>
                            {team.team_name}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center font-medium">{team.played}</td>
                        <td className="py-4 px-3 text-center font-medium">{team.won}</td>
                        <td className="py-4 px-3 text-center font-medium">{team.drawn}</td>
                        <td className="py-4 px-3 text-center font-medium">{team.lost}</td>
                        <td className="py-4 px-6 text-center text-[#d7bf7b] font-black text-base">{team.points}</td>
                      </tr>
                    ))}
                    {standings.filter(s => (s.tournament_name || 'U-12') === activeLeague).length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-500 font-medium">Cədvəl məlumatı yoxdur.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
