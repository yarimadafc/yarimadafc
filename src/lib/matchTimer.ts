export type TimerStatus = 'stopped' | 'running_first' | 'halftime' | 'running_second' | 'finished';

/** True when the admin has controlled this match with the live timer (start/pause/halftime/finish). */
export const hasManualTimer = (status?: string | null, startedAt?: string | null, elapsedSec?: number | null) =>
  (!!status && status !== 'stopped') || !!startedAt || (elapsedSec ?? 0) > 0;

/**
 * Live minute shown on the site.
 * The admin's timer always wins. Only when the timer was never touched do we fall back to
 * an estimate from the kick-off date/time (previously the kick-off time always overrode the timer,
 * so a match started manually did not show as started until its scheduled time).
 */
export const calculateLiveMinute = (
  status: TimerStatus,
  startedAt: string | null,
  elapsedSec: number,
  h1: number,
  h2: number,
  ex1: number,
  ex2: number,
  matchDate?: string,
  matchTime?: string
): string => {
  h1 = h1 || 45;
  h2 = h2 || 45;
  ex1 = ex1 || 0;
  ex2 = ex2 || 0;
  const elapsed = elapsedSec || 0;

  if (hasManualTimer(status, startedAt, elapsed)) {
    if (status === 'halftime') return 'HT (Fasilə)';
    if (status === 'finished') return 'Bitdi';
    const running = !!startedAt && (status === 'running_first' || status === 'running_second');
    const totalSec = elapsed + (running ? Math.max(0, Math.floor((Date.now() - new Date(startedAt!).getTime()) / 1000)) : 0);
    const min = Math.floor(totalSec / 60) + (running ? 1 : 0); // football minutes start at 1'
    const inSecond = status === 'running_second' || totalSec >= h1 * 60;
    if (!inSecond) return min > h1 ? `${h1}+${min - h1}'` : `${Math.max(min, 1)}'`;
    const max = h1 + h2;
    return min > max ? `${max}+${min - max}'` : `${min}'`;
  }

  if (matchDate && matchTime) {
    const start = new Date(`${matchDate}T${String(matchTime).slice(0, 5)}:00`).getTime();
    const now = Date.now();
    if (isNaN(start) || now < start) return 'Başlamayıb';
    const diffMin = Math.floor((now - start) / 60000) + 1;
    if (diffMin <= h1 + ex1) return `${diffMin}'`;
    if (diffMin <= h1 + ex1 + 15) return 'HT (Fasilə)';
    if (diffMin <= h1 + h2 + ex1 + ex2 + 15) return `${diffMin - 15}'`;
    return 'Bitdi';
  }
  return 'Başlamayıb';
};
