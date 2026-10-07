'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { calculateLiveMinute } from '@/lib/matchTimer';

const isTimePassed = (date: string, time: string) => {
  if (!date || !time) return false;
  return new Date(`${date}T${time}`) <= new Date();
};

export default function MatchesAndStandings() {
  const [activeLeague, setActiveLeague] = useState<string>('');
  const [leagues, setLeagues] = useState<string[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [nextMatch, setNextMatch] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: stData } = await supabase.from('standings').select('*').order('points', { ascending: false });
      if (stData && stData.length > 0) {
        setStandings(stData);
        const uniqueLeagues = Array.from(new Set(stData.map(s => s.tournament_name || 'U-6'))).sort();
        setLeagues(uniqueLeagues as string[]);
        const defaultLeague = uniqueLeagues.length > 0 ? (uniqueLeagues[0] as string) : 'U-6';
        setActiveLeague(defaultLeague);
      } else {
        setLeagues(['U-6']);
        setActiveLeague('U-6');
      }

      const { data: mtData } = await supabase.from('matches').select('*').order('date', { ascending: true });
      if (mtData) {
        setAllMatches(mtData);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (activeLeague && allMatches.length > 0) {
      const leagueMatches = allMatches.filter(m => (m.tournament || 'U-6') === activeLeague);
      const upcoming = leagueMatches.filter(m => m.status !== 'finished' && !isTimePassed(m.date, m.time));
      if (upcoming.length > 0) {
        setNextMatch(upcoming[0]);
      } else if (leagueMatches.length > 0) {
        setNextMatch(leagueMatches[leagueMatches.length - 1]);
      } else {
        setNextMatch(null);
      }
    }
  }, [activeLeague, allMatches]);

  return (
    <section className="bg-[#000000] py-20 border-b border-[#1f1f1f]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-12 lg:gap-8">
          
          {/* Oyunlar Cədvəli (Sol) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-3 flex flex-col h-full"
          >
            <div className="flex items-center space-x-4 mb-8">
              <span className="w-8 h-1 bg-[#d7bf7b]"></span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Oyunlar</h2>
            </div>
            
            <div className="bg-gradient-to-br from-[#141414] to-[#0a0a0a] rounded-3xl border border-[#1f1f1f] p-8 flex flex-col relative overflow-hidden shadow-2xl h-full min-h-[400px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d7bf7b]/5 rounded-bl-full -mr-10 -mt-10"></div>
              
              {nextMatch ? (
                <>
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <span className="text-[#d7bf7b] font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-[#d7bf7b]/10 rounded border border-[#d7bf7b]/20">
                      Növbəti Oyun
                    </span>
                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{nextMatch.date} • {nextMatch.time}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center flex-grow relative z-10 py-6">
                    {/* Home Team */}
                    <div className="flex flex-col items-center mb-6 w-full group">
                      <div className="w-20 h-20 bg-[#000000] rounded-full flex items-center justify-center mb-4 border-2 border-transparent group-hover:border-[#d7bf7b] transition-all p-2 shadow-inner">
                        {nextMatch.home_logo ? (
                           <img src={nextMatch.home_logo} alt={nextMatch.home_team} className="max-w-full max-h-full object-contain" />
                        ) : (
                           <span className="text-xl font-black text-gray-600">{nextMatch.home_team?.substring(0,3)}</span>
                        )}
                      </div>
                      <span className="text-white font-black text-lg lg:text-xl text-center leading-tight uppercase">{nextMatch.home_team}</span>
                    </div>

                    {/* VS */}
                    <div className="my-2 relative flex items-center justify-center w-full">
                       <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent absolute"></div>
                       <span className="bg-[#141414] px-4 py-1 rounded-full text-[#d7bf7b] font-black italic tracking-widest text-lg relative z-10 border border-[#1f1f1f]">
                         {nextMatch.status === 'finished' ? `${nextMatch.home_score} - ${nextMatch.away_score}` : 'VS'}
                       </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center mt-6 w-full group">
                      <div className="w-20 h-20 bg-[#000000] rounded-full flex items-center justify-center mb-4 border-2 border-transparent group-hover:border-[#d7bf7b] transition-all p-2 shadow-inner">
                        {nextMatch.away_logo ? (
                           <img src={nextMatch.away_logo} alt={nextMatch.away_team} className="max-w-full max-h-full object-contain" />
                        ) : (
                           <span className="text-xl font-black text-gray-600">{nextMatch.away_team?.substring(0,3)}</span>
                        )}
                      </div>
                      <span className="text-gray-300 font-black text-lg lg:text-xl text-center leading-tight uppercase">{nextMatch.away_team}</span>
                    </div>
                  </div>

                  <div className="text-center relative z-10 bg-[#000000]/50 py-4 rounded-xl border border-[#1f1f1f] mt-auto">
                    <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
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

          {/* Turnir Cədvəli (Sağ) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-6 flex flex-col h-full mt-12 lg:mt-0"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <span className="w-8 h-1 bg-[#d7bf7b]"></span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Turnir Cədvəli</h2>
              </div>
              <div className="flex flex-wrap gap-6 pb-2 md:pb-0">
                {leagues.map(league => (
                  <button 
                    key={league}
                    onClick={() => {
                      setActiveLeague(league);
                      const leagueNext = allMatches.find((m: any) => m.tournament === league && m.status !== 'finished');
                      setNextMatch(leagueNext || null);
                    }}
                    className={`text-sm font-bold tracking-widest transition-colors ${activeLeague === league ? 'text-[#d7bf7b] border-b-2 border-[#d7bf7b] pb-1' : 'text-gray-400 hover:text-white pb-1 border-b-2 border-transparent'}`}
                  >
                    {league}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto flex-grow bg-[#141414] rounded-2xl border border-[#1f1f1f]">
              <table className="w-full text-left text-sm text-gray-300 min-w-[500px]">
                <thead className="bg-[#0a0a0a] text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-[#1f1f1f]">
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
                <tbody className="divide-y divide-[#1f1f1f]">
                  {standings.filter(s => (s.tournament_name || leagues[0]) === activeLeague).map((team, idx) => (
                    <tr 
                      key={team.id} 
                      className={`transition-colors ${team.team_name.includes('Yarımada') ? 'bg-[#d7bf7b]/5' : 'hover:bg-[#1a1a1a]'}`}
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
                      <td colSpan={8} className="text-center py-10 text-gray-500 font-medium">Cədvəl məlumatı yoxdur.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
