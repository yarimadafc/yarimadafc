'use client';
import { useLang } from '@/lib/i18n';
import { AgoLabels, countdownText, formatLongDate, timeAgo } from '@/lib/matchUtils';

// Locale-aware helpers bound to the current language.
export function useFormat() {
  const { t, locale } = useLang();
  const agoLabels: AgoLabels = {
    now: t('indicə'), min: t('dəq. əvvəl'), hour: t('saat əvvəl'), day: t('gün əvvəl'), month: t('ay əvvəl'), year: t('il əvvəl'),
  };
  const units = { d: t('gün'), h: t('saat'), m: t('dəq.') };
  return {
    ago: (iso?: string | null) => timeAgo(iso, agoLabels),
    longDate: (date?: string | null) => formatLongDate(date, locale),
    countdown: (start: Date | null, now?: number) => countdownText(start, now, units),
  };
}
