'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import SectionHeading from '@/components/SectionHeading';
import TeamLogo from '@/components/TeamLogo';
import Reveal from '@/components/Reveal';
import { useLang } from '@/lib/i18n';
import { useFormat } from '@/lib/useFormat';
import { isLiveMatch, scoreText, AnyMatch, matchStart, normalizeMatch } from '@/lib/matchUtils';
import { useSyncVersion } from '@/lib/siteSync';
import { ageOf } from '@/lib/teamOrder';

const byStart = (a: AnyMatch, b: AnyMatch) => (matchStart(a)?.getTime() ?? 0) - (matchStart(b)?.getTime() ?? 0);

// Two latest results + the next two fixtures, oldest -> newest.
function pickMatches(rows: AnyMatch[], count = 4): AnyMatch[] {
  const sorted = [...rows].sort(byStart);
  const finished = sorted.filter(m => m.status === 'finished');
  const upcoming = sorted.filter(m => m.status !== 'finished');
  const half = Math.ceil(count / 2);
  const picked = [...finished.slice(-half), ...upcoming.slice(0, count - half)];
  if (picked.length < count) {
    const extra = sorted.filter(m => !picked.includes(m));
    picked.push(...extra.slice(-(count - picked.length)));
  }
  return picked.sort(byStart).slice(0, count);
}

// The home page mainly shows the U-13 and U-12 teams: last result + next game of each
// (other teams only fill the row when those two have no games yet).
const FEATURED_AGES = [13, 12];

function pickFeatured(rows: AnyMatch[]): AnyMatch[] {
  const picked: AnyMatch[] = [];
  for (const age of FEATURED_AGES) {
    picked.push(...pickMatches(rows.filter(m => ageOf(m.tournament) === age), 2));
  }
  if (picked.length < 4) {
    picked.push(...pickMatches(rows.filter(m => !picked.includes(m)), 4 - picked.length));
  }
  return picked.slice(0, 4);
}

export default function MatchesSection() {
  const { t } = useLang();
  const { longDate } = useFormat();
  const [matches, setMatches] = useState<AnyMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const sync = useSyncVersion();
  useEffect(() => {
    async function fetchMatches() {
      const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: false }).limit(80);
      setMatches(pickFeatured((data || []).map(normalizeMatch)));
      setLoading(false);
    }
    fetchMatches();
  }, [sync]);

  return (
    <section className="bg-bg-deep py-14 md:py-20">
      <div className="container">
        <SectionHeading title="Təqvim və nəticələr" href="/matches" linkText="Bütün nəticələr" />

        {loading ? null : matches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {matches.map((m, i) => {
              const played = m.status === 'finished' || isLiveMatch(m);
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
                      {scoreText(m)}
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
