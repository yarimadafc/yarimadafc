'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { calculateLiveMinute } from '@/lib/matchTimer';

const isTimePassed = (date: string, time: string) => {
  if (!date || !time) return false;
  return new Date(`${date}T${time}`) <= new Date();
};

export default function MatchesAndStandings() {
  const [standings, setStandings] = useState<any[]>([]);
  const [activeLeague, setActiveLeague] = useState('U-12');
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [nextMatch, setNextMatch] = useState<any>(null);
  const [leagues, setLeagues] = useState<string[]>(['U-12', 'U-11', 'U-10', 'U-9']);

  useEffect(() => {
    async function fetchData() {
      const { data: tData } = await supabase.from('teams').select('name').order('name', { ascending: true });
      if (tData && tData.length > 0) {
        const names = tData.map(t => t.name).sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.replace(/\D/g, '')) || 0;
          return numA - numB;
        });
        setLeagues(names);
        setActiveLeague(names[0]);
      }
      const { data: sData } = await supabase.from('standings').select('*').order('points', { ascending: false });
      if (sData) setStandings(sData);

      const { data: mData } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
      if (mData) {
        setAllMatches(mData);
        // Find the next match that is NOT the hero match (or fallback to hero if it's the only one)
        const nonHeroNext = mData.find(m => m.status !== 'finished' && !m.is_hero);
        const heroNext = mData.find(m => m.status !== 'finished' && m.is_hero);
        setNextMatch(nonHeroNext || heroNext || null);
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
                      <div className="w-20 h-20 bg-[#0a1423] rounded-full border-2 border-gray-700 flex items-center justify-center p-2 shadow-inner overflow-hidden">
                        {nextMatch.home_logo ? (
                          <img src={nextMatch.home_logo} alt={nextMatch.home_team} className="w-full h-full object-contain bg-white rounded-full p-1 drop-shadow-lg" />
                        ) : nextMatch.home_team?.includes('Yarımada') ? (
                          <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full drop-shadow-lg" />
                        ) : (
                          <div className="w-full h-full bg-gray-600 rounded-full"></div>
                        )}
                      </div>
                      <span className="text-white font-black text-sm lg:text-lg text-center leading-tight uppercase line-clamp-2">{nextMatch.home_team}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center w-[30%]">
                      {nextMatch.status === 'live' ? (
                        <div className="flex flex-col items-center animate-pulse">
                          <div className="text-red-500 font-black text-xs tracking-widest uppercase mb-2">{calculateLiveMinute(nextMatch.timer_status, nextMatch.timer_started_at, nextMatch.elapsed_seconds, nextMatch.half_1_duration, nextMatch.half_2_duration, nextMatch.extra_time_1, nextMatch.extra_time_2, nextMatch.match_date || nextMatch.date, nextMatch.match_time || nextMatch.time)}</div>
                          <div className="flex items-center space-x-2 bg-[#0a1423] border border-gray-700 px-3 py-1.5 rounded-lg shadow-inner">
                            <span className="text-white font-black text-xl md:text-2xl">{nextMatch.home_score !== null ? nextMatch.home_score : '-'}</span>
                            <span className="text-gray-500 font-bold">:</span>
                            <span className="text-white font-black text-xl md:text-2xl">{nextMatch.away_score !== null ? nextMatch.away_score : '-'}</span>
                          </div>
                        </div>
                      ) : nextMatch.status === 'finished' ? (
                        <div className="flex flex-col items-center">
                          <div className="text-gray-500 font-black text-[10px] tracking-widest uppercase mb-1">NƏTİCƏ</div>
                          <div className="flex items-center space-x-2 bg-[#0a1423] border border-gray-700 px-3 py-1.5 rounded-lg shadow-inner">
                            <span className="text-white font-black text-xl md:text-2xl">{nextMatch.home_score !== null ? nextMatch.home_score : '-'}</span>
                            <span className="text-gray-500 font-bold">:</span>
                            <span className="text-white font-black text-xl md:text-2xl">{nextMatch.away_score !== null ? nextMatch.away_score : '-'}</span>
                          </div>
                        </div>
                      ) : isTimePassed(nextMatch.match_date, nextMatch.match_time) ? (
                        <div className="flex flex-col items-center animate-pulse">
                          <span className="text-red-500 font-black text-[10px] tracking-widest uppercase mb-1">OYUN BAŞLADI</span>
                          <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{nextMatch.match_time || '00:00'}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-[#d7bf7b] font-black text-3xl mb-1">VS</span>
                          <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{nextMatch.match_time || '00:00'}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center space-y-3 w-2/5">
                      <div className="w-20 h-20 bg-[#0a1423] rounded-full border-2 border-gray-700 flex items-center justify-center p-2 shadow-inner overflow-hidden">
                        {nextMatch.away_logo ? (
                          <img src={nextMatch.away_logo} alt={nextMatch.away_team} className="w-full h-full object-contain bg-white rounded-full p-1 drop-shadow-lg" />
                        ) : nextMatch.away_team?.includes('Yarımada') ? (
                          <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full drop-shadow-lg" />
                        ) : (
                          <div className="w-full h-full bg-gray-600 rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-300 font-black text-sm lg:text-lg text-center leading-tight uppercase line-clamp-2">{nextMatch.away_team}</span>
                    </div>
                  </div>

                  <div className="text-center relative z-10 bg-[#0a1423]/50 py-4 rounded-xl border border-gray-800/50 mt-auto">
                    <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center">
                      {nextMatch.status === 'live' ? <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span> : <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>}
                      Stadion: {nextMatch.stadium || 'Məlumat Yoxdur'}
                    </span>
                  </div>
                  
                  {nextMatch.yarimada_lineup && nextMatch.yarimada_lineup.length > 0 && (
                    <div className="mt-4 relative z-10 bg-[#0a1423]/80 rounded-xl border border-gray-800/50 p-3 max-h-32 overflow-y-auto custom-scrollbar">
                      <h4 className="text-[#d7bf7b] font-bold uppercase tracking-widest text-[9px] text-center mb-2 border-b border-gray-800 pb-1">Heyət və Hadisələr</h4>
                      <div className="flex flex-col space-y-1.5">
                        {nextMatch.yarimada_lineup.map((p: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 font-black w-3">{p.number}</span>
                              <span className="text-white font-medium truncate max-w-[100px]">{p.name}</span>
                              {!p.is_starting && <span className="text-[7px] bg-gray-800 text-gray-400 px-1 rounded uppercase">Ehtiyat</span>}
                            </div>
                            <div className="flex space-x-1">
                              {p.events?.includes('goal') && <span title="Qol">⚽</span>}
                              {p.events?.includes('yellow_card') && <span title="Sarı Vərəqə">🟨</span>}
                              {p.events?.includes('red_card') && <span title="Qırmızı Vərəqə">🟥</span>}
                              {p.events?.includes('injury') && <span title="Zədə">🩹</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                {leagues.map(league => (
                  <button 
                    key={league}
                    onClick={() => {
                      setActiveLeague(league);
                      const leagueNext = allMatches.find((m: any) => m.tournament === league && m.status !== 'finished');
                      setNextMatch(leagueNext || null);
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
                      <th className="py-5 px-2 text-center" title="Oyun">O</th>
                      <th className="py-5 px-2 text-center" title="Qələbə">Q</th>
                      <th className="py-5 px-2 text-center" title="Heç-heçə">H</th>
                      <th className="py-5 px-2 text-center" title="Məğlubiyyət">M</th>
                      <th className="py-5 px-2 text-center text-green-400" title="Vurduğu Qol">VQ</th>
                      <th className="py-5 px-2 text-center text-red-400" title="Buraxdığı Qol">BT</th>
                      <th className="py-5 px-4 text-center text-[#d7bf7b]" title="Xal">Xal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.filter(s => (s.tournament_name || leagues[0]) === activeLeague).map((team, idx) => (
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
                    {standings.filter(s => (s.tournament_name || leagues[0]) === activeLeague).length === 0 && (
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
