const fs = require('fs');
let content = fs.readFileSync('src/components/home/MatchesAndStandings.tsx', 'utf-8');

if (!content.includes('calculateLiveMinute')) {
  content = content.replace(
    "import { supabase } from '@/lib/supabase';",
    "import { supabase } from '@/lib/supabase';\nimport { calculateLiveMinute } from '@/lib/matchTimer';"
  );
  
  // Need to force re-render for live timer like in page.tsx
  content = content.replace(
    "const [loading, setLoading] = useState(true);",
    "const [loading, setLoading] = useState(true);\n  const [, setTick] = useState(0);\n  useEffect(() => { const timer = setInterval(() => setTick(t => t+1), 1000); return () => clearInterval(timer); }, []);"
  );
}

const targetRegex = /\{\/\* Teams \*\/\}[\s\S]*?Stadion: \{nextMatch\.stadium \|\| 'Məlumat Yoxdur'\}\n\s*<\/span>\n\s*<\/div>/;

const newTeamsHtml = `{/* Teams */}
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
                          <div className="text-red-500 font-black text-xs tracking-widest uppercase mb-2">{calculateLiveMinute(nextMatch.timer_status, nextMatch.timer_started_at, nextMatch.elapsed_seconds, nextMatch.half_1_duration, nextMatch.half_2_duration, nextMatch.extra_time_1, nextMatch.extra_time_2)}</div>
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
                  </div>`;

content = content.replace(targetRegex, newTeamsHtml);

// Wait, the logic for setNextMatch has a bug! 
// The user says "altda turnir cədvəkinin yanındakı Növbəti Oyun bölümündə logolar adlar düzgün düşmür yuxarıdakı kimi sinrxon et"
// It's linked to the league tabs right now!
// Let's remove the override when clicking league tab.
content = content.replace(
  /setNextMatch\(allMatches\.find\(\(m: any\) => \(m\.tournament \|\| 'U-12'\) === league\) \|\| null\);/,
  `// Do not override nextMatch when clicking tabs, keep it as the overall next match`
);

fs.writeFileSync('src/components/home/MatchesAndStandings.tsx', content);
