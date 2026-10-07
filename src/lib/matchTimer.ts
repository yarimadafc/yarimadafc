export type TimerStatus = 'stopped' | 'running_first' | 'halftime' | 'running_second' | 'finished';

// NEW LOGIC: Fully automatic based on match_date and match_time if timer_status is not manually overridden.
// Since user requested fully automatic:
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
  // If matchDate and matchTime are provided, calculate automatically based on them.
  if (matchDate && matchTime) {
    const matchStart = new Date(`${matchDate}T${matchTime}`).getTime();
    const now = Date.now();
    
    if (now < matchStart) {
      return 'Başlamayıb';
    }
    
    const diffMin = Math.floor((now - matchStart) / 1000 / 60);
    
    if (diffMin <= h1 + ex1) {
      return `${diffMin}'`;
    } else if (diffMin > h1 + ex1 && diffMin <= h1 + ex1 + 15) { // Assuming 15 min halftime
      return 'HT (Fasilə)';
    } else if (diffMin > h1 + ex1 + 15 && diffMin <= h1 + h2 + ex1 + ex2 + 15) {
      return `${diffMin - 15}'`;
    } else {
      return 'Bitdi';
    }
  }

  // Fallback to manual if no matchDate/Time provided
  if (status === 'stopped') return 'Başlamayıb';
  if (status === 'halftime') return 'HT (Fasilə)';
  if (status === 'finished') return 'Bitdi';

  if (!startedAt) return '...';

  const startMs = new Date(startedAt).getTime();
  const nowMs = Date.now();
  
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
