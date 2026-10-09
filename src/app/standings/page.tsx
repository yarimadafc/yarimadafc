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
  const [activeTab, setActiveTab] = useState("standings");
  const [results, setResults] = useState<any[]>([]);

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

    async function loadResults() {
      const { data } = await supabase.from('matches').select('*').eq('status', 'finished').order('match_date', { ascending: false });
      if (data) setResults(data.map((m: any) => ({ ...m, date: m.match_date || m.date || '' })));
    }
    loadResults();

  }, []);

  return (
    <div className="pt-[180px] min-h-screen bg-bg-main pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-text-main tracking-tight mt-12 mb-8 border-b border-bg-border pb-4 flex justify-center items-center text-center"
        >
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-accent"></div>
            Turnir Cədvəlləri
          </div>
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex flex-col space-y-2 border-r border-bg-border pr-4">
             <div onClick={() => setActiveTab('standings')} className={`${activeTab === 'standings' ? 'bg-bg-sec text-text-main border-l-4 border-accent' : 'text-text-sec hover:bg-bg-sec hover:text-text-main'} p-4 rounded-lg font-bold flex items-center justify-between cursor-pointer transition-colors`}>
               <span>Turnir cədvəli</span>
               {activeTab === 'standings' && <ChevronRight className="w-4 h-4 text-accent" />}
             </div>
             <div onClick={() => setActiveTab('results')} className={`${activeTab === 'results' ? 'bg-bg-sec text-text-main border-l-4 border-accent' : 'text-text-sec hover:bg-bg-sec hover:text-text-main'} p-4 rounded-lg font-bold flex items-center justify-between cursor-pointer transition-colors`}>
               <span>Nəticələr</span>
               {activeTab === 'results' && <ChevronRight className="w-4 h-4 text-accent" />}
             </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            
            {/* Filter */}
            <div className="mb-6 flex flex-wrap gap-4 border-b border-bg-border pb-4">
              {leagues.map(league => (
                <button 
                  key={league}
                  onClick={() => setActiveLeague(league)}
                  className={`text-sm font-bold tracking-widest uppercase transition-colors ${activeLeague === league ? 'text-accent border-b-2 border-accent pb-1' : 'text-text-sec hover:text-text-main pb-1'}`}
                >
                  {league}
                </button>
              ))}
            </div>

            
            {loading ? (
              <div className="text-center py-20 text-accent font-medium text-sm">Yüklənir...</div>
            ) : activeTab === 'standings' ? (

              <div className="overflow-x-auto bg-bg-sec rounded-xl border border-bg-border">
                <table className="w-full text-left text-sm text-text-sec min-w-[500px]">
                  <thead className="bg-bg-deep text-text-sec uppercase text-[10px] font-bold tracking-widest border-b border-bg-border">
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
                        <td colSpan={8} className="text-center py-10 text-text-sec font-medium">Bu qrup üçün məlumat yoxdur.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            ) : (
              <div className="space-y-4">
                {results.filter(r => (r.tournament || leagues[0]) === activeLeague).map(m => (
                  <div key={m.id} className="bg-bg-sec rounded-xl p-4 border border-bg-border flex items-center justify-between">
                    <div className="flex flex-col items-center w-1/3">
                      <span className="text-text-main font-bold text-sm uppercase">{m.home_team}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                       <span className="text-accent font-black text-xl">{m.home_score} - {m.away_score}</span>
                       <span className="text-text-sec text-[10px] mt-1">{m.date}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                      <span className="text-text-main font-bold text-sm uppercase">{m.away_team}</span>
                    </div>
                  </div>
                ))}
                {results.filter(r => (r.tournament || leagues[0]) === activeLeague).length === 0 && (
                  <div className="text-center py-20 text-text-sec font-medium">Bu qrup üzrə nəticə tapılmadı.</div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
