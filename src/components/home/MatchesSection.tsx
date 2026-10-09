'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import SectionHeading from '@/components/SectionHeading';
import TeamLogo from '@/components/TeamLogo';
import Reveal from '@/components/Reveal';
import { useLang } from '@/lib/i18n';
import { useFormat } from '@/lib/useFormat';
import { AnyMatch, matchStart, normalizeMatch } from '@/lib/matchUtils';

// Two latest results + the next two fixtures, oldest -> newest.
function pickMatches(rows: AnyMatch[]): AnyMatch[] {
  const sorted = [...rows].sort((a, b) => (matchStart(a)?.getTime() ?? 0) - (matchStart(b)?.getTime() ?? 0));
  const finished = sorted.filter(m => m.status === 'finished');
  const upcoming = sorted.filter(m => m.status !== 'finished');
  const picked = [...finished.slice(-2), ...upcoming.slice(0, 2)];
  if (picked.length < 4) {
    const extra = sorted.filter(m => !picked.includes(m));
    picked.push(...extra.slice(-(4 - picked.length)));
  }
  return picked.sort((a, b) => (matchStart(a)?.getTime() ?? 0) - (matchStart(b)?.getTime() ?? 0)).slice(0, 4);
}

export default function MatchesSection() {
  const { t } = useLang();
  const { longDate } = useFormat();
  const [matches, setMatches] = useState<AnyMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: false }).limit(40);
      setMatches(pickMatches((data || []).map(normalizeMatch)));
      setLoading(false);
    }
    fetchMatches();
  }, []);

  return (
    <section className="bg-bg-deep py-14 md:py-20">
      <div className="container">
        <SectionHeading title="Təqvim və nəticələr" href="/matches" linkText="Bütün nəticələr" />

        {loading ? null : matches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {matches.map((m, i) => {
              const played = m.status === 'finished' || m.status === 'live';
              return (
                <Reveal key={m.id} delay={i * 0.1} variant="scale">
                <Link href="/matches" className="group led-border led-hover card-fx h-full bg-bg-main rounded-xl border border-bg-border flex flex-col text-center overflow-hidden">
                  <div className="py-5 px-4 text-text-main font-bold text-base border-b border-bg-border">{m.tournament || t('Oyun')}</div>
                  <div className="py-3 px-4 text-text-sec text-sm leading-relaxed border-b border-bg-border min-h-[4.2em]">
                    {longDate(m.date)}{m.time && `, ${m.time}`}{m.stadium && `, ${m.stadium}`}
                  </div>
                  <div className="flex items-center justify-between gap-2 px-4 py-6 flex-grow">
                    <div className="flex flex-col items-center gap-2 w-[38%] min-w-0">
                      <TeamLogo name={m.home_team} logo={m.home_logo} size={44} />
                      <span className="text-text-main text-sm font-medium leading-tight w-full line-clamp-2">{m.home_team}</span>
                    </div>
                    <span className={`font-extrabold text-text-main whitespace-nowrap ${played ? 'text-2xl' : 'text-xl text-text-sec'}`}>
                      {played && m.home_score != null && m.away_score != null ? `${m.home_score} - ${m.away_score}` : '-'}
                    </span>
                    <div className="flex flex-col items-center gap-2 w-[38%] min-w-0">
                      <TeamLogo name={m.away_team} logo={m.away_logo} size={44} />
                      <span className="text-text-main text-sm font-medium leading-tight w-full line-clamp-2">{m.away_team}</span>
                    </div>
                  </div>
                  <div className="py-4 text-text-main font-semibold text-sm border-t border-bg-border group-hover:bg-accent group-hover:text-on-accent transition-colors">{t('Təqvim')}</div>
                </Link>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-bg-border py-14 text-center text-text-sec">{t('Hazırda təyin olunmuş oyun yoxdur.')}</div>
        )}
      </div>
    </section>
  );
}
