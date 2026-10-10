'use client';
import Link from 'next/link';
import TeamLogo from '@/components/TeamLogo';
import { useLastResult } from '@/lib/useNextMatch';
import { useLang } from '@/lib/i18n';
import { useFormat } from '@/lib/useFormat';
import { isYarimada } from '@/lib/matchUtils';

// Compact "last result" card shown next to the next-match card on the home page.
export default function LastResultCard({ className = '' }: { className?: string }) {
  const { match, loading } = useLastResult();
  const { t } = useLang();
  const { longDate } = useFormat();

  if (loading) return <div className={`rounded-2xl bg-bg-card/60 animate-pulse h-28 ${className}`} aria-hidden />;
  if (!match) return null;

  const hs = match.home_score ?? 0, as = match.away_score ?? 0;
  const ours = isYarimada(match.home_team) ? hs - as : isYarimada(match.away_team) ? as - hs : null;
  const outcome = ours === null ? null : ours > 0 ? { label: 'Qələbə', cls: 'bg-emerald-600' } : ours < 0 ? { label: 'Məğlubiyyət', cls: 'bg-red-600' } : { label: 'Heç-heçə', cls: 'bg-amber-500' };

  return (
    <Link href="/matches?tab=results" className={`group block rounded-2xl border border-bg-border bg-bg-card/90 backdrop-blur-md p-4 shadow-xl hover:border-accent transition-colors ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-text-sec text-[10px] font-bold uppercase tracking-widest truncate">{t('Son oyun')}{match.tournament ? ` · ${match.tournament}` : ''}</span>
        <span className="flex items-center gap-2 min-w-0">
          {outcome && <span className={`text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${outcome.cls}`}>{t(outcome.label)}</span>}
          <span className="text-text-sec text-[11px] truncate">{longDate(match.date)}</span>
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <span className="flex items-center justify-end gap-2 min-w-0">
          <span className="truncate text-right text-sm font-semibold text-text-main">{match.home_team}</span>
          <TeamLogo name={match.home_team} logo={match.home_logo} size={30} />
        </span>
        <span className="rounded-lg bg-bg-deep border border-bg-border px-3 py-1 text-xl font-black tabular-nums text-text-main whitespace-nowrap">{hs} : {as}</span>
        <span className="flex items-center gap-2 min-w-0">
          <TeamLogo name={match.away_team} logo={match.away_logo} size={30} />
          <span className="truncate text-sm font-semibold text-text-main">{match.away_team}</span>
        </span>
      </div>
    </Link>
  );
}
