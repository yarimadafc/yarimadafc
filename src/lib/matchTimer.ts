export type TimerStatus = 'stopped' | 'running_first' | 'halftime' | 'running_second' | 'finished';

export const calculateLiveMinute = (
  status: TimerStatus,
  startedAt: string | null,
  elapsedSec: number,
  h1: number,
  h2: number,
  ex1: number,
  ex2: number
): string => {
  if (status === 'stopped') return 'Başlamayıb';
  if (status === 'halftime') return 'HT (Fasilə)';
  if (status === 'finished') return 'Bitdi';

  if (!startedAt) return '...';

  const startMs = new Date(startedAt).getTime();
  const nowMs = Date.now();
  
  // Total seconds = already elapsed before this run + (now - start)
  const totalSec = elapsedSec + Math.floor((nowMs - startMs) / 1000);
  const min = Math.floor(totalSec / 60);

  if (status === 'running_first') {
    if (min >= h1) return `${h1} + ${min - h1}'`;
    return `${min}'`;
  }

  if (status === 'running_second') {
    const secondHalfMin = h1 + Math.floor((totalSec - (h1 * 60)) / 60);
    const maxNormal = h1 + h2;
    if (secondHalfMin >= maxNormal) return `${maxNormal} + ${secondHalfMin - maxNormal}'`;
    return `${secondHalfMin}'`;
  }

  return `${min}'`;
};
