'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { calculateLiveMinute } from '@/lib/matchTimer';
import MatchesShell from '@/components/MatchesShell';
import TeamLogo from '@/components/TeamLogo';
import { AnyMatch, formatLongDate, matchStart, normalizeMatch } from '@/lib/matchUtils';

function MatchesList() {
  const params = useSearchParams();
  const tab = params.get('tab') === 'results' ? 'results' : 'fixtures';
  const [matches, setMatches] = useState<AnyMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [league, setLeague] = useState('Hamısı');
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
      setMatches((data || []).map(normalizeMatch));
      setLoading(false);
    }
    load();
  }, []);

  const leagues = useMemo(() => ['Hamısı', ...Array.from(new Set(matches.map(m => m.tournament || 'Oyun'))).sort()], [matches]);

  const list = useMemo(() => {
    const byLeague = matches.filter(m => league === 'Hamısı' || (m.tournament || 'Oyun') === league);
    const byTime = (a: AnyMatch, b: AnyMatch) => (matchStart(a)?.getTime() ?? 0) - (matchStart(b)?.getTime() ?? 0);
    return tab === 'results'
      ? byLeague.filter(m => m.status === 'finished').sort((a, b) => byTime(b, a))
      : byLeague.filter(m => m.status !== 'finished').sort(byTime);
  }, [matches, league, tab]);

  return (
    <MatchesShell active={tab}>
      {leagues.length > 2 && (
        <div className="flex gap-6 overflow-x-auto pb-3 mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist">
          {leagues.map(l => (
            <button key={l} role="tab" aria-selected={league === l} onClick={() => setLeague(l)}
              className={`shrink-0 text-sm md:text-base font-semibold pb-2 border-b-2 transition-colors ${league === l ? 'text-text-main border-accent' : 'text-text-sec border-transparent hover:text-text-main'}`}>
              {l}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="h-48 rounded-xl bg-bg-sec animate-pulse" aria-hidden />
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-bg-border bg-bg-sec py-16 text-center text-text-sec">
          {tab === 'results' ? 'Hələlik nəticə yoxdur.' : 'Qarşıdakı oyun yoxdur.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {list.map(m => {
            const live = m.status === 'live';
            const showScore = (m.status === 'finished' || live) && m.home_score != null && m.away_score != null;
            return (
              <article key={m.id} className="bg-bg-sec rounded-xl border border-bg-border overflow-hidden text-center">
                <div className="py-4 px-4 font-bold text-text-main border-b border-bg-border">{m.tournament || 'Oyun'}</div>
                <div className="py-3 px-4 text-sm text-text-sec border-b border-bg-border">
                  {formatLongDate(m.date)}{m.time && `, ${m.time}`}{m.stadium && `, ${m.stadium}`}
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-6">
                  <div className="flex flex-col items-center gap-2 w-[38%] min-w-0">
                    <TeamLogo name={m.home_team} logo={m.home_logo} size={52} />
                    <span className="text-sm font-semibold text-text-main leading-tight line-clamp-2">{m.home_team}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-extrabold text-text-main whitespace-nowrap">{showScore ? `${m.home_score} - ${m.away_score}` : '-'}</span>
                    {live && (
                      <span className="text-[11px] font-bold text-red-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {calculateLiveMinute(m.timer_status, m.timer_started_at, m.elapsed_seconds, m.half_1_duration, m.half_2_duration, m.extra_time_1, m.extra_time_2, m.date, m.time)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-2 w-[38%] min-w-0">
                    <TeamLogo name={m.away_team} logo={m.away_logo} size={52} />
                    <span className="text-sm font-semibold text-text-main leading-tight line-clamp-2">{m.away_team}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </MatchesShell>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<MatchesShell active="fixtures"><div className="h-48 rounded-xl bg-bg-sec animate-pulse" /></MatchesShell>}>
      <MatchesList />
    </Suspense>
  );
}
