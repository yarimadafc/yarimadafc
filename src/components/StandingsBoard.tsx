'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TeamLogo from '@/components/TeamLogo';
import Reveal from '@/components/Reveal';
import { useLang } from '@/lib/i18n';
import { isLiveMatch, scoreText, AnyMatch, formatShortDate, isYarimada, matchStart, normalizeMatch } from '@/lib/matchUtils';
import { useSyncVersion } from '@/lib/siteSync';

interface Props {
  /** Max rows in the fixtures/results list (home page shows fewer). */
  matchLimit?: number;
}

// League tabs + standings table + fixtures/results list (Neftçi-style).
export default function StandingsBoard({ matchLimit = 9 }: Props) {
  const { t } = useLang();
  const [standings, setStandings] = useState<any[]>([]);
  const [matches, setMatches] = useState<AnyMatch[]>([]);
  const [active, setActive] = useState('');
  const [loading, setLoading] = useState(true);

  const sync = useSyncVersion();
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [{ data: st }, { data: mt }] = await Promise.all([
        supabase.from('standings').select('*').order('points', { ascending: false }),
        supabase.from('matches').select('*').order('match_date', { ascending: true }),
      ]);
      if (cancelled) return;
      setStandings(st || []);
      setMatches((mt || []).map(normalizeMatch));
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [sync]);

  const leagues = useMemo(() => {
    const set = new Set<string>();
    standings.forEach(s => set.add(s.tournament_name || 'Ümumi'));
    matches.forEach(m => set.add(m.tournament || 'Ümumi'));
    return Array.from(set).sort();
  }, [standings, matches]);

  useEffect(() => {
    if (!active && leagues.length) setActive(leagues[0]);
  }, [leagues, active]);

  const logos = useMemo(() => {
    const map: Record<string, string> = {};
    matches.forEach(m => {
      if (m.home_logo) map[m.home_team] = m.home_logo;
      if (m.away_logo) map[m.away_team] = m.away_logo;
    });
    return map;
  }, [matches]);

  const rows = standings
    .filter(s => (s.tournament_name || 'Ümumi') === active)
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0) || ((b.gf ?? 0) - (b.ga ?? 0)) - ((a.gf ?? 0) - (a.ga ?? 0)));

  const leagueMatches = matches
    .filter(m => (m.tournament || 'Ümumi') === active)
    .sort((a, b) => (matchStart(a)?.getTime() ?? 0) - (matchStart(b)?.getTime() ?? 0))
    .slice(-matchLimit);

  if (loading) {
    return <div className="h-64 rounded-xl bg-bg-sec animate-pulse" aria-hidden />;
  }
  if (leagues.length === 0) {
    return <div className="rounded-xl border border-bg-border bg-bg-sec py-14 text-center text-text-sec">{t('Turnir məlumatı hələ əlavə olunmayıb.')}</div>;
  }

  const th = 'py-4 px-1 sm:px-2 text-center font-medium';

  return (
    <div>
      {/* League tabs */}
      <div className="flex gap-6 md:gap-8 overflow-x-auto pb-3 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist">
        {leagues.map(l => (
          <button
            key={l}
            role="tab"
            aria-selected={active === l}
            onClick={() => setActive(l)}
            className={`shrink-0 text-sm md:text-base font-semibold pb-2 border-b-2 transition-all hover:-translate-y-0.5 ${active === l ? 'text-text-main border-accent' : 'text-text-sec border-transparent hover:text-text-main'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Reveal variant="left">
        {/* Standings */}
        <div className="bg-bg-sec rounded-xl overflow-hidden led-border">
          <table className="w-full text-xs sm:text-sm text-text-main">
            <thead className="text-text-sec">
              <tr>
                <th className={`${th} w-8 sm:w-12`}>№</th>
                <th className="py-4 px-1 sm:px-2 text-left font-medium">{t('Komanda')}</th>
                {['O', 'Q', 'B', 'M', 'VQ', 'BQ'].map(h => <th key={h} className={`${th} w-7 sm:w-10`}>{h}</th>)}
                <th className={`${th} w-9 sm:w-12`}>{t('Xal')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => (
                <tr key={t.id} className={`border-t border-bg-border ${isYarimada(t.team_name) ? 'bg-bg-card font-bold' : 'font-medium'}`}>
                  <td className="py-3 px-1 sm:px-2 text-center">{i + 1}</td>
                  <td className="py-3 px-1 sm:px-2">
                    <span className="flex items-center gap-2 min-w-0">
                      <TeamLogo name={t.team_name} logo={logos[t.team_name]} size={22} />
                      <span className="truncate font-semibold">{t.team_name}</span>
                    </span>
                  </td>
                  <td className="py-3 px-1 sm:px-2 text-center">{t.played ?? 0}</td>
                  <td className="py-3 px-1 sm:px-2 text-center">{t.won ?? 0}</td>
                  <td className="py-3 px-1 sm:px-2 text-center">{t.drawn ?? 0}</td>
                  <td className="py-3 px-1 sm:px-2 text-center">{t.lost ?? 0}</td>
                  <td className="py-3 px-1 sm:px-2 text-center">{t.gf ?? 0}</td>
                  <td className="py-3 px-1 sm:px-2 text-center">{t.ga ?? 0}</td>
                  <td className="py-3 px-1 sm:px-2 text-center font-bold">{t.points ?? 0}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={9} className="py-12 text-center text-text-sec">{t('Bu turnir üçün cədvəl məlumatı yoxdur.')}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        </Reveal>
        {/* Fixtures / results */}
        <Reveal variant="right">
        <div className="bg-bg-sec rounded-xl overflow-hidden self-start">
          <div className="px-4 py-4 text-sm text-text-sec font-medium">{t('Son / növbəti oyunlar')}</div>
          {leagueMatches.length === 0 ? (
            <div className="py-12 text-center text-text-sec text-sm border-t border-bg-border">{t('Bu turnir üçün oyun yoxdur.')}</div>
          ) : (
            leagueMatches.map(m => {
              const played = m.status === 'finished' || isLiveMatch(m);
              return (
                <Link href="/matches" key={m.id} className="flex items-center gap-3 px-4 py-3 border-t border-bg-border text-sm hover:bg-bg-card transition-colors">
                  <div className="w-14 shrink-0 text-text-sec text-xs leading-tight">
                    <div className="text-text-main font-semibold">{formatShortDate(m.date) || '—'}</div>
                    <div>{m.time}</div>
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
                    <span className="flex items-center justify-end gap-2 min-w-0 font-semibold text-text-main">
                      <span className="truncate text-right">{m.home_team}</span>
                      <TeamLogo name={m.home_team} logo={m.home_logo} size={22} />
                    </span>
                    <span className="font-bold text-text-main text-center min-w-[3rem]">
                      {scoreText(m)}
                    </span>
                    <span className="flex items-center gap-2 min-w-0 font-semibold text-text-main">
                      <TeamLogo name={m.away_team} logo={m.away_logo} size={22} />
                      <span className="truncate">{m.away_team}</span>
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
        </Reveal>
      </div>
    </div>
  );
}
