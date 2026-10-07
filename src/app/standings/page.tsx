'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight } from 'lucide-react';

export default function StandingsPage() {
  const [activeLeague, setActiveLeague] = useState<string>('');
  const [leagues, setLeagues] = useState<string[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStandings() {
      const { data } = await supabase.from('standings').select('*').order('points', { ascending: false });
      if (data && data.length > 0) {
        setStandings(data);
        const uniqueLeagues = Array.from(new Set(data.map(s => s.tournament_name || 'U-6'))).sort();
        setLeagues(uniqueLeagues as string[]);
        setActiveLeague(uniqueLeagues.length > 0 ? (uniqueLeagues[0] as string) : 'U-6');
      } else {
        setLeagues(['U-6']);
        setActiveLeague('U-6');
      }
      setLoading(false);
    }
    loadStandings();
  }, []);

  return (
    <div className="pt-[140px] min-h-screen bg-[#0d1a2d] pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-white tracking-tight mb-8 border-b border-[#1c2d47] pb-4 flex items-center"
        >
          <div className="relative">
            <div className="absolute -top-4 left-0 w-8 h-[2px] bg-[#d7bf7b]"></div>
            Turnir Cədvəlləri
          </div>
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex flex-col space-y-2 border-r border-[#1c2d47] pr-4">
             <div className="bg-[#152741] text-white p-4 rounded-lg font-bold flex items-center justify-between cursor-pointer border-l-4 border-[#d7bf7b]">
               <span>Turnir cədvəli</span>
               <ChevronRight className="w-4 h-4 text-[#d7bf7b]" />
             </div>
             <div className="text-gray-400 p-4 rounded-lg font-bold hover:bg-[#152741] hover:text-white transition-colors cursor-pointer flex items-center justify-between">
               <span>Təqvim</span>
               <ChevronRight className="w-4 h-4" />
             </div>
             <div className="text-gray-400 p-4 rounded-lg font-bold hover:bg-[#152741] hover:text-white transition-colors cursor-pointer flex items-center justify-between">
               <span>Nəticələr</span>
               <ChevronRight className="w-4 h-4" />
             </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            
            {/* Filter */}
            <div className="mb-6 flex flex-wrap gap-4 border-b border-[#1c2d47] pb-4">
              {leagues.map(league => (
                <button 
                  key={league}
                  onClick={() => setActiveLeague(league)}
                  className={`text-sm font-bold tracking-widest uppercase transition-colors ${activeLeague === league ? 'text-[#d7bf7b] border-b-2 border-[#d7bf7b] pb-1' : 'text-gray-400 hover:text-white pb-1'}`}
                >
                  {league}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-20 text-[#d7bf7b] font-medium text-sm">Yüklənir...</div>
            ) : (
              <div className="overflow-x-auto bg-[#152741] rounded-xl border border-[#1c2d47]">
                <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
                  <thead className="bg-[#0a1423] text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-[#1c2d47]">
                    <tr>
                      <th className="py-5 px-6">Komanda</th>
                      <th className="py-5 px-2 text-center">O</th>
                      <th className="py-5 px-2 text-center">Q</th>
                      <th className="py-5 px-2 text-center">H</th>
                      <th className="py-5 px-2 text-center">M</th>
                      <th className="py-5 px-2 text-center text-green-400">VQ</th>
                      <th className="py-5 px-2 text-center text-red-400">BT</th>
                      <th className="py-5 px-4 text-center text-[#d7bf7b]">Xal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c2d47]">
                    {standings.filter(s => (s.tournament_name || leagues[0]) === activeLeague).map((team, idx) => (
                      <tr 
                        key={team.id} 
                        className={`transition-colors ${team.team_name.includes('Yarımada') ? 'bg-[#d7bf7b]/5' : 'hover:bg-[#1a2e4c]'}`}
                      >
                        <td className="py-4 px-6 flex items-center space-x-4">
                          <span className={`w-5 font-black text-xs ${idx < 3 ? 'text-[#d7bf7b]' : 'text-gray-500'}`}>{idx + 1}</span>
                          <span className={`font-bold text-xs md:text-sm uppercase tracking-wide ${team.team_name.includes('Yarımada') ? 'text-[#d7bf7b]' : 'text-white'}`}>
                            {team.team_name}
                          </span>
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
                    {standings.filter(s => (s.tournament_name || leagues[0]) === activeLeague).length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-10 text-gray-500 font-medium">Bu qrup üçün məlumat yoxdur.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
