const fs = require('fs');
let content = fs.readFileSync('src/app/matches/page.tsx', 'utf-8');

// I need to add calculateLiveMinute here too so we can see the exact minute if they visit the Matches page
if (!content.includes('calculateLiveMinute')) {
  content = content.replace(
    "import { supabase } from '@/lib/supabase';",
    "import { supabase } from '@/lib/supabase';\nimport { calculateLiveMinute } from '@/lib/matchTimer';"
  );
  
  // We need to run the interval in MatchesPage too, so let's add a dummy state to trigger re-renders
  content = content.replace(
    "const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');",
    "const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');\n  const [, setTick] = useState(0);\n  useEffect(() => { const timer = setInterval(() => setTick(t => t+1), 1000); return () => clearInterval(timer); }, []);"
  );
}

content = content.replace(
  /<div className="mt-3 bg-red-500\/20 text-red-400 px-3 py-1 rounded-full text-\[10px\] font-bold uppercase tracking-widest">/,
  `{m.status === 'live' && (
                          <div className="mt-3 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse border border-red-500/30">
                            Canlı: {calculateLiveMinute(m.timer_status, m.timer_started_at, m.elapsed_seconds, m.half_1_duration, m.half_2_duration, m.extra_time_1, m.extra_time_2)}
                          </div>
                        )}
                        <div className="mt-3 bg-red-500/0 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">`
);

fs.writeFileSync('src/app/matches/page.tsx', content);
