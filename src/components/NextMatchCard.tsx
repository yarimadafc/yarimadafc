'use client';
import Link from 'next/link';
import TeamLogo from '@/components/TeamLogo';
import { useNextMatch } from '@/lib/useNextMatch';
import { useLang } from '@/lib/i18n';
import { useFormat } from '@/lib/useFormat';
import { calculateLiveMinute } from '@/lib/matchTimer';
import { matchStart } from '@/lib/matchUtils';

// "Next match" card with the rotating LED border (restored from the previous hero).
export default function NextMatchCard({ className = '' }: { className?: string }) {
  const { match, loading } = useNextMatch();
  const { t } = useLang();
  const { longDate } = useFormat();

  if (loading) return <div className={`rounded-2xl bg-bg-card/60 animate-pulse h-64 ${className}`} aria-hidden />;

  if (!match) {
    return (
      <div className={`led-border rounded-2xl bg-bg-card/90 backdrop-blur p-8 text-center ${className}`}>
        <div className="text-accent mb-3 flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
        <h3 className="text-text-main font-bold mb-1">{t('Təqvim boşdur')}</h3>
        <p className="text-text-sec text-sm">{t('Hazırda təyin olunmuş heç bir oyun yoxdur.')}</p>
      </div>
    );
  }

  const live = match.status === 'live';
  const started = !live && (matchStart(match)?.getTime() ?? Infinity) <= Date.now();
  const minute = live
    ? calculateLiveMinute(match.timer_status, match.timer_started_at, match.elapsed_seconds, match.half_1_duration, match.half_2_duration, match.extra_time_1, match.extra_time_2, match.date, match.time)
    : '';

  return (
    <Link href="/matches" className={`group led-border led-glow block rounded-2xl bg-bg-card/90 backdrop-blur-md p-5 sm:p-6 shadow-2xl ${className}`}>
      <div className="flex justify-between items-center mb-6 gap-3">
        <span className="text-accent text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-accent/10 rounded border border-accent/20 whitespace-nowrap">{t('Növbəti oyun')}</span>
        <span className="text-text-sec text-[11px] font-medium truncate">{match.tournament}</span>
      </div>

      <div className="relative flex items-center justify-between mb-7">
        <div className="flex flex-col items-center gap-3 w-[36%]">
          <div className="w-16 h-16 rounded-full border border-bg-border bg-bg-main flex items-center justify-center overflow-hidden float-y">
            <TeamLogo name={match.home_team} logo={match.home_logo} size={52} />
          </div>
          <span className="font-bold text-text-main text-xs text-center line-clamp-2">{match.home_team}</span>
        </div>

        <div className="flex flex-col items-center z-10">
          {live ? (
            <>
              <span className="text-red-500 font-black text-[11px] tracking-widest mb-1 animate-pulse">{minute}</span>
              <span className="bg-bg-deep border border-bg-border rounded-lg px-3 py-1 text-text-main font-black text-xl whitespace-nowrap">
                {match.home_score ?? '-'} : {match.away_score ?? '-'}
              </span>
            </>
          ) : started ? (
            <span className="text-red-500 font-black text-[10px] tracking-widest uppercase text-center bg-bg-deep border border-red-500/30 px-2 py-1 rounded-lg animate-pulse">{t('Oyun başlayıb')}</span>
          ) : (
            <span className="w-9 h-9 rounded-full bg-bg-deep border border-bg-border flex items-center justify-center text-accent text-sm font-bold led-glow">VS</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 w-[36%]">
          <div className="w-16 h-16 rounded-full border border-bg-border bg-bg-main flex items-center justify-center overflow-hidden float-y" style={{ animationDelay: '.6s' }}>
            <TeamLogo name={match.away_team} logo={match.away_logo} size={52} />
          </div>
          <span className="font-bold text-text-main text-xs text-center line-clamp-2">{match.away_team}</span>
        </div>
      </div>

      <div className="bg-bg-deep rounded-lg p-3 flex justify-between items-center gap-3 border border-bg-border">
        <div className="min-w-0">
          <div className="text-text-sec text-[10px] uppercase tracking-widest mb-0.5">{t('Tarix / Saat')}</div>
          <div className="text-text-main text-xs font-bold truncate">{match.date && match.time ? `${longDate(match.date)} • ${match.time}` : t('Məlumat yoxdur')}</div>
        </div>
        <span className="text-accent text-[11px] font-bold uppercase tracking-widest whitespace-nowrap group-hover:translate-x-1 transition-transform">{t('Ətraflı')} →</span>
      </div>
    </Link>
  );
}
