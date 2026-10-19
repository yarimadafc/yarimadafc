'use client';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb, toast } from '@/lib/adminDb';
import { Save, Trash2, ChevronDown } from 'lucide-react';
import PlayerMatchLog from './PlayerMatchLog';
import { buildPlayerStats, findPlayerStat, MANUAL_STAT_FIELDS, type ManualStatField } from '@/lib/playerStats';
import type { AnyMatch } from '@/lib/matchUtils';

type Extra = Record<ManualStatField, number>;
export const STAT_LABELS: Record<ManualStatField, string> = {
  stat_games: 'Oyun', stat_starts: 'İlk 11', stat_goals: 'Qol', stat_assists: 'Assist',
  stat_minutes: 'Dəq.', stat_yellow: 'Sarı', stat_red: 'Qırmızı',
};
// stat_* column -> PlayerStat field calculated from the match line-ups
const FROM_MATCHES = {
  stat_games: 'games', stat_starts: 'starts', stat_goals: 'goals', stat_assists: 'assists',
  stat_minutes: 'minutes', stat_yellow: 'yellow', stat_red: 'red',
} as const;

const extraOf = (p: any): Extra =>
  Object.fromEntries(MANUAL_STAT_FIELDS.map(f => [f, Number(p[f]) || 0])) as Extra;

// Squad statistics of one team. The numbers from the match line-ups (Oyunlar -> Heyət & Hadisələr) are
// calculated automatically; the inputs here are ADDED on top of them (e.g. games played before the site
// existed). The public statistics page, player profiles and the team page show the total.
export default function SquadStatsAdmin({ teamId, players, onSaved, onDelete }: { teamId: string; players: any[]; onSaved: () => void; onDelete?: (id: string) => void }) {
  const [matches, setMatches] = useState<AnyMatch[]>([]);
  const [extras, setExtras] = useState<Record<string, Extra>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const loadMatches = () => supabase
    .from('matches')
    // all games: which ones count (finished / live / past with a score) is decided in buildPlayerStats, as on the site
    .select('id, tournament, home_team, away_team, home_logo, away_logo, home_score, away_score, match_date, match_time, date, status, timer_status, yarimada_lineup')
    .then(({ data }) => setMatches(data || []));

  useEffect(() => { loadMatches(); setOpen(null); }, [teamId]);

  useEffect(() => {
    setExtras(Object.fromEntries(players.map(p => [p.id, extraOf(p)])));
    setDirty(new Set());
  }, [players]);

  // numbers from games: line-ups (Oyunlar) + games typed in per player; the stat_* extras are the inputs
  const fromMatches = useMemo(() => {
    const noExtras = players.map(p => ({ ...p, ...Object.fromEntries(MANUAL_STAT_FIELDS.map(f => [f, 0])) }));
    const all = buildPlayerStats(matches, {}, noExtras);
    return (p: any) => findPlayerStat(all, p);
  }, [matches, players]);

  const setValue = (id: string, field: ManualStatField, value: string) => {
    setExtras(prev => ({ ...prev, [id]: { ...prev[id], [field]: Math.max(0, parseInt(value) || 0) } }));
    setDirty(prev => new Set(prev).add(id));
  };

  const save = async () => {
    if (!dirty.size) return toast('success', 'Dəyişiklik yoxdur');
    setSaving(true);
    const results = await Promise.all([...dirty].map(id => adminDb.from('players').update(extras[id]).eq('id', id).silent()));
    setSaving(false);
    if (results.some(r => r.error)) return;
    toast('success', 'Heyət statistikası yadda saxlanıldı');
    setDirty(new Set());
    onSaved();
  };

  if (players.length === 0) {
    return (
      <div className="mt-10 bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
        <h3 className="text-accent font-bold uppercase tracking-widest text-sm mb-2">Heyət Statistikası</h3>
        <p className="text-gray-400 text-sm">Bu komandada hələ futbolçu yoxdur. Yuxarıdan futbolçu əlavə edin — statistikası burada görünəcək.</p>
      </div>
    );
  }
  const cell = 'w-full min-w-[3.25rem] bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white text-center text-sm focus:border-accent outline-none';

  return (
    <div className="mt-10 bg-gray-800 border border-gray-700 rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-accent font-bold uppercase tracking-widest text-sm">Komandanın futbolçuları</h3>
          <p className="text-gray-400 text-xs mt-1 max-w-2xl">
            Hər xananın altında: <b className="text-gray-300">oyunlardan</b> + <b className="text-gray-300">əlavə</b> = <b className="text-white">cəmi</b>.
            Xanaya yalnız saytdan əvvəlki oyunların rəqəmlərini yazın. Futbolçunun adına bassanız, oyun-oyun cədvəli açılır.
          </p>
        </div>
        <button onClick={save} disabled={saving || !dirty.size} className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2 disabled:opacity-50">
          <Save className="w-4 h-4" /> <span>{saving ? 'Saxlanılır...' : `Yadda Saxla${dirty.size ? ` (${dirty.size})` : ''}`}</span>
        </button>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-sm text-white">
          <thead>
            <tr className="text-gray-400 text-[10px] uppercase tracking-widest">
              <th className="text-left py-2 pr-3 font-bold">Futbolçu</th>
              {MANUAL_STAT_FIELDS.map(f => <th key={f} className="py-2 px-1 font-bold">{STAT_LABELS[f]}</th>)}
              {onDelete && <th />}
            </tr>
          </thead>
          <tbody>
            {players.map(p => {
              const auto = fromMatches(p);
              const extra = extras[p.id] || extraOf(p);
              return (
                <Fragment key={p.id}>
                <tr className={`border-t border-gray-700 ${dirty.has(p.id) ? 'bg-accent/5' : ''}`}>
                  <td className="py-2 pr-3 whitespace-nowrap align-top">
                    <button onClick={() => setOpen(open === p.id ? null : p.id)} className="flex items-center gap-2 text-left hover:text-accent" aria-expanded={open === p.id} title="Oyunlar üzrə statistika">
                      <span className="text-gray-500 text-xs">{p.jersey_number || '-'}</span>
                      <span className="font-bold underline decoration-dotted underline-offset-4">{p.name}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open === p.id ? 'rotate-180' : ''}`} />
                    </button>
                  </td>
                  {MANUAL_STAT_FIELDS.map(f => {
                    const a = auto ? auto[FROM_MATCHES[f]] : 0;
                    return (
                      <td key={f} className="py-2 px-1 text-center align-top">
                        <input type="number" min={0} value={extra[f] || ''} placeholder="0" onChange={e => setValue(p.id, f, e.target.value)} className={cell} aria-label={`${p.name} — ${STAT_LABELS[f]}`} />
                        <div className="text-[10px] text-gray-500 mt-1" title="Oyunlardan + əlavə = cəmi">
                          {a} + {extra[f] || 0} = <span className="text-white font-bold">{a + (extra[f] || 0)}</span>
                        </div>
                      </td>
                    );
                  })}
                  {onDelete && (
                    <td className="py-2 pl-2 align-top">
                      <button onClick={() => onDelete(p.id)} className="p-2 text-gray-500 hover:text-red-400" aria-label={`${p.name} — sil`} title="Sil">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
                {open === p.id && (
                  <tr>
                    <td colSpan={MANUAL_STAT_FIELDS.length + (onDelete ? 2 : 1)}>
                      <PlayerMatchLog player={p} matches={matches} onSaved={() => { loadMatches(); onSaved(); }} />
                    </td>
                  </tr>
                )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
