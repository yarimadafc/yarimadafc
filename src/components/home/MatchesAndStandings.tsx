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
    <section className="bg-bg-deep py-20 border-b border-bg-border">
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
              <span className="w-8 h-1 bg-accent"></span>
              <h2 className="text-3xl font-black text-text-main uppercase tracking-tight">Oyunlar</h2>
            </div>
            
            <div className="bg-gradient-to-br from-bg-sec to-bg-main rounded-3xl border border-bg-border p-8 flex flex-col relative overflow-hidden shadow-2xl h-full min-h-[400px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-10 -mt-10"></div>
              
              {nextMatch ? (
                <>
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <span className="text-accent font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-accent/10 rounded border border-accent/20">
                      Növbəti Oyun
                    </span>
                    <span className="text-text-sec font-bold text-xs uppercase tracking-widest">{nextMatch.date} • {nextMatch.time}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center flex-grow relative z-10 py-6">
                    {/* Home Team */}
                    <div className="flex flex-col items-center mb-6 w-full group">
                      <div className="w-20 h-20 bg-bg-deep rounded-full flex items-center justify-center mb-4 border-2 border-transparent group-hover:border-accent transition-all p-2 shadow-inner">
                        {nextMatch.home_logo ? (
                           <img src={nextMatch.home_logo} alt={nextMatch.home_team} className="max-w-full max-h-full object-contain" />
                        ) : (
                           <span className="text-xl font-black text-gray-600">{nextMatch.home_team?.substring(0,3)}</span>
                        )}
                      </div>
                      <span className="text-text-main font-black text-lg lg:text-2xl text-center leading-tight uppercase">{nextMatch.home_team}</span>
                    </div>

                    {/* VS */}
                    <div className="my-2 relative flex items-center justify-center w-full">
                       <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent absolute"></div>
                       <span className="bg-bg-sec px-4 py-1 rounded-full text-accent font-black italic tracking-widest text-xl lg:text-2xl relative z-10 py-1.5 px-5 border border-bg-border">
                         {nextMatch.status === 'finished' ? `${nextMatch.home_score} - ${nextMatch.away_score}` : 'VS'}
                       </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center mt-6 w-full group">
                      <div className="w-20 h-20 bg-bg-deep rounded-full flex items-center justify-center mb-4 border-2 border-transparent group-hover:border-accent transition-all p-2 shadow-inner">
                        {nextMatch.away_logo ? (
                           <img src={nextMatch.away_logo} alt={nextMatch.away_team} className="max-w-full max-h-full object-contain" />
                        ) : (
                           <span className="text-xl font-black text-gray-600">{nextMatch.away_team?.substring(0,3)}</span>
                        )}
                      </div>
                      <span className="text-text-sec font-black text-lg lg:text-2xl text-center leading-tight uppercase">{nextMatch.away_team}</span>
                    </div>
                  </div>

                  <div className="text-center relative z-10 bg-bg-deep/50 py-4 rounded-xl border border-bg-border mt-auto">
                    <span className="text-text-sec text-[11px] font-bold uppercase tracking-widest">
                      Stadion: {nextMatch.stadium || 'Məlumat Yoxdur'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                   <div className="text-accent mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                   <h3 className="text-text-main font-bold uppercase tracking-widest mb-2">Təqvim Boşdur</h3>
                   <p className="text-text-sec text-sm">Hazırda təyin olunmuş növbəti oyun yoxdur.</p>
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
                <span className="w-8 h-1 bg-accent"></span>
                <h2 className="text-3xl font-black text-text-main uppercase tracking-tight">Turnir Cədvəli</h2>
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
                    className={`text-sm font-bold tracking-widest transition-colors ${activeLeague === league ? 'text-accent border-b-2 border-accent pb-1' : 'text-text-sec hover:text-text-main pb-1 border-b-2 border-transparent'}`}
                  >
                    {league}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto flex-grow bg-bg-sec rounded-2xl border border-bg-border">
              <table className="w-full text-left text-sm text-text-sec min-w-[500px]">
                <thead className="bg-bg-main text-text-sec uppercase text-[10px] font-bold tracking-widest border-b border-bg-border">
                  <tr>
                    <th className="py-5 px-6">Komanda</th>
                    <th className="py-5 px-2 text-center">O</th>
                    <th className="py-5 px-2 text-center">Q</th>
                    <th className="py-5 px-2 text-center">H</th>
                    <th className="py-5 px-2 text-center">M</th>
                    <th className="py-5 px-2 text-center text-green-400">VQ</th>
                    <th className="py-5 px-2 text-center text-red-400">BT</th>
                    <th className="py-5 px-4 text-center text-accent">Xal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {standings.filter(s => (s.tournament_name || leagues[0]) === activeLeague).map((team, idx) => (
                    <tr 
                      key={team.id} 
                      className={`transition-colors ${team.team_name.includes('Yarımada') ? 'bg-accent/5' : 'hover:bg-bg-card'}`}
                    >
                      <td className="py-4 px-6 flex items-center space-x-4">
                        <span className={`w-5 font-black text-xs ${idx < 3 ? 'text-accent' : 'text-text-sec'}`}>{idx + 1}</span>
                        <span className={`font-bold text-xs md:text-sm uppercase tracking-wide ${team.team_name.includes('Yarımada') ? 'text-accent' : 'text-text-main'}`}>
                          {team.team_name}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center font-medium">{team.played}</td>
                      <td className="py-4 px-3 text-center font-medium">{team.won}</td>
                      <td className="py-4 px-3 text-center font-medium">{team.drawn}</td>
                      <td className="py-4 px-3 text-center font-medium">{team.lost}</td>
                      <td className="py-4 px-3 text-center font-medium text-green-400">{team.gf || 0}</td>
                      <td className="py-4 px-3 text-center font-medium text-red-400">{team.ga || 0}</td>
                      <td className="py-4 px-6 text-center text-accent font-black text-base">{team.points}</td>
                    </tr>
                  ))}
                  {standings.filter(s => (s.tournament_name || leagues[0]) === activeLeague).length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-text-sec font-medium">Cədvəl məlumatı yoxdur.</td>
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
