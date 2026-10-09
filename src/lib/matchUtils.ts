export type AnyMatch = Record<string, any>;

const MONTHS_LOWER = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];

const pad = (n: number) => String(n).padStart(2, '0');

// Admin writes match_date / match_time; older pages used date / time. Expose both.
export function normalizeMatch(m: AnyMatch): AnyMatch {
  return { ...m, date: m.match_date || m.date || '', time: String(m.match_time || m.time || '').slice(0, 5) };
}

export function isYarimada(name?: string | null): boolean {
  return !!name && /yar[ıiIİ]mada/i.test(name);
}

export function matchStart(m: AnyMatch): Date | null {
  const date = m.match_date || m.date;
  if (!date) return null;
  const time = String(m.match_time || m.time || '00:00').slice(0, 5);
  const d = new Date(`${date}T${time}:00`);
  return isNaN(d.getTime()) ? null : d;
}

// "17 oktyabr 2026"
export function formatLongDate(date?: string | null, locale = 'az-AZ'): string {
  if (!date) return '';
  const [y, mo, d] = date.split('-').map(Number);
  if (!y || !mo || !d) return date;
  if (locale !== 'az-AZ') {
    try { return new Date(y, mo - 1, d).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }); } catch { /* fall through */ }
  }
  return `${d} ${MONTHS_LOWER[mo - 1]} ${y}`;
}

// "17-10-2026"
export function formatDashDate(date?: string | null): string {
  if (!date) return '';
  const [y, mo, d] = date.split('-');
  return y && mo && d ? `${d}-${mo}-${y}` : date;
}

// "17.10"
export function formatShortDate(date?: string | null): string {
  if (!date) return '';
  const [, mo, d] = date.split('-');
  return mo && d ? `${d}.${mo}` : date;
}

export function formatTime(time?: string | null): string {
  return time ? String(time).slice(0, 5) : '';
}

// "7 gün : 16 saat : 19 dəq."
export function countdownText(start: Date | null, now = Date.now(), u = { d: 'gün', h: 'saat', m: 'dəq.' }): string {
  if (!start) return '';
  let diff = Math.floor((start.getTime() - now) / 60000);
  if (diff <= 0) return '';
  const days = Math.floor(diff / 1440);
  diff -= days * 1440;
  const hours = Math.floor(diff / 60);
  const mins = diff - hours * 60;
  return days > 0 ? `${days} ${u.d} : ${hours} ${u.h} : ${mins} ${u.m}` : `${hours} ${u.h} : ${mins} ${u.m}`;
}

export interface AgoLabels { now: string; min: string; hour: string; day: string; month: string; year: string }
const AGO_AZ: AgoLabels = { now: 'indicə', min: 'dəq. əvvəl', hour: 'saat əvvəl', day: 'gün əvvəl', month: 'ay əvvəl', year: 'il əvvəl' };

export function timeAgo(iso?: string | null, l: AgoLabels = AGO_AZ): string {
  if (!iso) return '';
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return l.now;
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min} ${l.min}`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} ${l.hour}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${l.day}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${l.month}`;
  return `${Math.floor(months / 12)} ${l.year}`;
}

export function formatNumericDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}
