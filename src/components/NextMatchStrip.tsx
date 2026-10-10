'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TeamLogo from '@/components/TeamLogo';
import { useNextMatch } from '@/lib/useNextMatch';
import { useLang } from '@/lib/i18n';
import { useFormat } from '@/lib/useFormat';
import LiveBadge from '@/components/LiveBadge';
import { formatDashDate, formatShortDate, isLiveMatch, matchStart } from '@/lib/matchUtils';

// Info strip: league | crests | stadium | date | time | countdown (or live score).
export default function NextMatchStrip({ compact = false }: { compact?: boolean }) {
  const { match, loading } = useNextMatch();
  const { t } = useLang();
  const { countdown } = useFormat();
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  if (loading || !match) {
    return compact ? null : (
      <span className="text-[13px] text-text-sec truncate">{t('Gələcəyin çempionları burada yetişir!')}</span>
    );
  }

  const start = matchStart(match);
  const isLive = isLiveMatch(match);
  const cd = now && start ? countdown(start, now) : '';
  const started = !isLive && !!start && !!now && start.getTime() <= now;

  const status = isLive ? (
    <LiveBadge match={match} showScore />
  ) : started ? (
    <span className="font-bold text-white bg-red-600 rounded px-2 py-0.5 text-[11px]">{t('Oyun başlayıb')}</span>
  ) : cd ? (
    <span className="text-text-main tabular-nums">{cd}</span>
  ) : null;

  if (compact) {
    return (
      <Link href="/matches" className="flex items-center justify-center gap-2 h-full px-3 text-[11px] text-text-sec whitespace-nowrap overflow-hidden">
        <TeamLogo name={match.home_team} logo={match.home_logo} size={18} />
        <span className="text-text-main font-semibold truncate max-w-[34vw]">{match.home_team} – {match.away_team}</span>
        <TeamLogo name={match.away_team} logo={match.away_logo} size={18} />
        {match.date && <span className="hidden min-[400px]:inline">· {formatShortDate(match.date)}</span>}
        {match.time && <span className="hidden min-[400px]:inline">{match.time}</span>}
        {status && <span className="hidden sm:inline">· {status}</span>}
      </Link>
    );
  }

  const cell = 'px-4 first:pl-0 whitespace-nowrap';
  return (
    <Link href="/matches" className="flex items-center min-w-0 text-[13px] text-text-main divide-x divide-bg-border overflow-hidden hover:text-accent transition-colors">
      <span className={cell}>{match.tournament || t('Oyun')}</span>
      <span className={`${cell} flex items-center gap-2`}>
        <TeamLogo name={match.home_team} logo={match.home_logo} size={26} />
        <TeamLogo name={match.away_team} logo={match.away_logo} size={26} />
      </span>
      {match.stadium && <span className={`${cell} hidden 2xl:block truncate max-w-[260px]`}>{match.stadium}</span>}
      {match.date && <span className={cell}>{formatDashDate(match.date)}</span>}
      {match.time && <span className={cell}>{match.time}</span>}
      {status && <span className={cell}>{status}</span>}
    </Link>
  );
}
