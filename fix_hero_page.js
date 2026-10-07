const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// First, add the import for matchTimer
if (!content.includes('calculateLiveMinute')) {
  content = content.replace(
    "import { supabase } from '@/lib/supabase';",
    "import { supabase } from '@/lib/supabase';\nimport { calculateLiveMinute } from '@/lib/matchTimer';"
  );
}

// Update the hmData mapping to include timer properties and lineup
const fetchReplacement = `const { data: hmData } = await supabase
        .from('matches')
        .select('*')
        .eq('is_hero', true)
        .neq('status', 'finished')
        .order('match_date', { ascending: true })
        .limit(1);

      if (hmData && hmData.length > 0) {
        const m = hmData[0];
        setHeroMatch({
          home: m.home_team || 'YARIMADA',
          away: m.away_team || 'RƏQİB',
          date: m.match_date || '',
          time: m.match_time || '',
          venue: m.stadium || '',
          league: m.tournament || 'Yoldaşlıq',
          home_logo: m.home_logo || '',
          away_logo: m.away_logo || '',
          status: m.status || 'upcoming',
          home_score: m.home_score,
          away_score: m.away_score,
          timer_status: m.timer_status || 'stopped',
          timer_started_at: m.timer_started_at || null,
          elapsed_seconds: m.elapsed_seconds || 0,
          half_1_duration: m.half_1_duration || 45,
          half_2_duration: m.half_2_duration || 45,
          extra_time_1: m.extra_time_1 || 0,
          extra_time_2: m.extra_time_2 || 0,
          yarimada_lineup: m.yarimada_lineup || []
        });
      }`;
content = content.replace(/const \{ data: hmData \} = await supabase[\s\S]*?\}\);[\s]*\}/, fetchReplacement);

// We need to add an interval for live minute in the heroMatch component, or since there is a main timer, we can use it.
// The main timer in page.tsx calls updateTime() every second! Let's just track elapsed time there or compute it directly on render if we use a ticking state.
// Actually, since setDate/setTime causes a re-render every second anyway, we can just call calculateLiveMinute inline in the JSX!

content = content.replace(
  /\{heroMatch\.live_minute \|\| "CANLI"\} \{heroMatch\.added_time \? `\$\{heroMatch\.added_time\}` : ''\}/,
  `{calculateLiveMinute(heroMatch.timer_status, heroMatch.timer_started_at, heroMatch.elapsed_seconds, heroMatch.half_1_duration, heroMatch.half_2_duration, heroMatch.extra_time_1, heroMatch.extra_time_2)}`
);

// Finally, render the Lineup/Events if lineup exists
const lineupJsx = `
               {/* Lineup & Events section */}
               {heroMatch.yarimada_lineup && heroMatch.yarimada_lineup.length > 0 && (
                 <div className="mt-4 bg-[#152741] border border-gray-800 rounded-3xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm bg-opacity-95">
                   <h4 className="text-[#d7bf7b] font-bold uppercase tracking-widest text-[10px] text-center mb-3 border-b border-gray-800 pb-2">Yarımada FK - Heyət və Hadisələr</h4>
                   <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                     {heroMatch.yarimada_lineup.map((p, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                         <div className="flex items-center space-x-2">
                           <span className="text-gray-500 font-black w-4">{p.number}</span>
                           <span className="text-white font-medium">{p.name}</span>
                           {!p.is_starting && <span className="text-[8px] bg-gray-800 text-gray-400 px-1 rounded uppercase">Ehtiyat</span>}
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
`;

content = content.replace(
  /<\/div>\n\s*<\/div>\n\s*<\/motion\.div>/,
  `</div>\n                   </div>\n                 </div>\n                 ${lineupJsx}\n               </motion.div>`
);

fs.writeFileSync('src/app/page.tsx', content);
