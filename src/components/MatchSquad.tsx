'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { entryGoals, entryPlayed, type LineupEntry } from '@/lib/playerStats';
import type { AnyMatch } from '@/lib/matchUtils';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Called-up squad of a match (admin -> Oyunlar -> Heyət & Hadisələr), shown under the match card.
// Players invited from another age group carry a "Dəvətli" badge.
export default function MatchSquad({ match }: { match: AnyMatch }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const squad: (LineupEntry & { invited?: boolean; from_team?: string })[] = Array.isArray(match.yarimada_lineup) ? match.yarimada_lineup : [];
  if (squad.length === 0) return null;

  const finished = match.status === 'finished' || match.status === 'live';
  // starters first, then by shirt number
  const list = [...squad].sort((a, b) => Number(!!b.is_starting) - Number(!!a.is_starting) || (Number(a.number) || 99) - (Number(b.number) || 99));
  const invited = squad.filter(p => p.invited).length;

  return (
    <div className="border-t border-bg-border text-left">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-text-main hover:bg-bg-card transition-colors" aria-expanded={open}>
        <span>
          {t('Heyət')} <span className="text-text-sec font-medium">({squad.length})</span>
          {invited > 0 && <span className="ml-2 text-[11px] font-semibold text-text-sec">· {invited} {t('dəvətli')}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 text-text-sec transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 animate-[fade-in_.2s_ease-out_both]">
          {list.map((p, i) => {
            const goals = finished && entryPlayed(p) ? entryGoals(p) : 0;
            const name = p.id && UUID.test(p.id)
              ? <Link href={`/players/${p.id}`} className="truncate hover:text-accent">{p.name}</Link>
              : <span className="truncate">{p.name}</span>;
            return (
              <li key={p.id || i} className="flex items-center gap-2 py-1.5 border-b border-bg-border/60 text-sm min-w-0">
                <span className="w-6 shrink-0 text-center font-bold text-text-sec tabular-nums">{p.number || '–'}</span>
                <span className={`min-w-0 flex-1 flex items-center gap-2 ${p.is_starting ? 'font-semibold text-text-main' : 'text-text-sec'}`}>
                  {name}
                  {p.invited && (
                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5 bg-blue-600/15 text-blue-500 border border-blue-500/30" title={p.from_team ? `${t('Dəvət olunub')}: ${p.from_team}` : t('Dəvət olunub')}>
                      {t('Dəvətli')}
                    </span>
                  )}
                </span>
                {goals > 0 && <span className="shrink-0 text-xs font-bold text-text-main" title={t('Qol')}>⚽ {goals > 1 ? goals : ''}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
