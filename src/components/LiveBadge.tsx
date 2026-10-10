'use client';
import { useEffect, useState } from 'react';
import { calculateLiveMinute } from '@/lib/matchTimer';
import { useLang } from '@/lib/i18n';
import type { AnyMatch } from '@/lib/matchUtils';

// High-contrast live indicator: white text on a solid red pill + a "LIVE" word,
// so it does not rely on red text alone (readable on dark backgrounds and for colour-blind users).
export default function LiveBadge({ match, size = 'sm', showScore = false }: { match: AnyMatch; size?: 'sm' | 'md'; showScore?: boolean }) {
  const { t } = useLang();
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const minute = calculateLiveMinute(match.timer_status, match.timer_started_at, match.elapsed_seconds, match.half_1_duration, match.half_2_duration, match.extra_time_1, match.extra_time_2, match.date || match.match_date, match.time || match.match_time);
  const score = showScore ? ` · ${match.home_score ?? 0}-${match.away_score ?? 0}` : "";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md bg-red-600 text-white font-extrabold tracking-wide tabular-nums whitespace-nowrap shadow-[0_0_14px_rgba(220,38,38,.55)] ${size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-[11px]'}`}>
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden />
      {t('CANLI')} {t(minute)}{score}
    </span>
  );
}
