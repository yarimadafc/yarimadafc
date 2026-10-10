'use client';
import { useEffect, useMemo, useState } from 'react';
import { adminDb, toast } from '@/lib/adminDb';
import { Plus, Save, Trash2 } from 'lucide-react';
import { isYarimada, type AnyMatch } from '@/lib/matchUtils';
import { entryAssists, entryGoals, matchLogOf, type LineupEntry, type ManualMatch } from '@/lib/playerStats';

type LineRow = { matchId: string; date: string; opponent: string; score: string; goals: number; assists: number; minutes: number };

const sameName = (a?: string | null, b?: string | null) =>
  String(a || '').trim().toLocaleLowerCase('az') === String(b || '').trim().toLocaleLowerCase('az');
const isPlayer = (e: LineupEntry, p: any) => e?.id === p.id || (!!e?.name && sameName(e.name, p.name));
const newId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()));

// The per-game table of one player (the one that opens when a player is clicked on the Statistika page):
// Tarix · Rəqib · Hesab · Q · A · Dəq.
// - games from Oyunlar (the player is in the line-up): Q / A / Dəq. are edited here and written back into
//   that game's line-up; date, opponent and score belong to the game itself (Oyunlar bölməsi).
// - games typed in here (players.match_log): every column is editable, rows can be added and removed.
export default function PlayerMatchLog({ player, matches, onSaved }: { player: any; matches: AnyMatch[]; onSaved: () => void }) {
  const fromMatches = useMemo<LineRow[]>(() => matches.flatMap(m => {
    const lineup: LineupEntry[] = Array.isArray(m.yarimada_lineup) ? m.yarimada_lineup : [];
    const e = lineup.find(x => isPlayer(x, player));
    if (!e) return [];
    const homeIsUs = isYarimada(m.home_team) || !isYarimada(m.away_team);
    return [{
      matchId: m.id,
      date: m.match_date || m.date || '',
      opponent: homeIsUs ? m.away_team : m.home_team,
      score: m.home_score != null && m.away_score != null ? `${m.home_score}:${m.away_score}` : '—',
      goals: entryGoals(e), assists: entryAssists(e), minutes: Number(e.minutes) || 0,
    }];
  }).sort((a, b) => b.date.localeCompare(a.date)), [matches, player]);

  const [lines, setLines] = useState<LineRow[]>(fromMatches);
  const [log, setLog] = useState<ManualMatch[]>(() => matchLogOf(player));
  const [dirtyLines, setDirtyLines] = useState<Set<string>>(new Set());
  const [logDirty, setLogDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setLines(fromMatches); setDirtyLines(new Set()); }, [fromMatches]);
  useEffect(() => { setLog(matchLogOf(player)); setLogDirty(false); }, [player]);

  const n = (v: string) => Math.max(0, parseInt(v) || 0);
  const editLine = (id: string, key: 'goals' | 'assists' | 'minutes', v: string) => {
    setLines(prev => prev.map(l => (l.matchId === id ? { ...l, [key]: n(v) } : l)));
    setDirtyLines(prev => new Set(prev).add(id));
  };
  const editLog = (id: string, patch: Partial<ManualMatch>) => {
    setLog(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
    setLogDirty(true);
  };
  const addRow = () => {
    setLog(prev => [{ id: newId(), date: new Date().toISOString().slice(0, 10), opponent: '', score: '', goals: 0, assists: 0, minutes: 0 }, ...prev]);
    setLogDirty(true);
  };
  const removeRow = (id: string) => {
    setLog(prev => prev.filter(e => e.id !== id));
    setLogDirty(true);
  };

  const save = async () => {
    if (!dirtyLines.size && !logDirty) return toast('success', 'Dəyişiklik yoxdur');
    if (log.some(e => !e.opponent.trim())) return toast('error', 'Hər sətirdə rəqibin adını yazın');
    setSaving(true);
    const jobs = [...dirtyLines].map(id => {
      const m = matches.find(x => x.id === id)!;
      const row = lines.find(l => l.matchId === id)!;
      const lineup = (m.yarimada_lineup as LineupEntry[]).map(e => (isPlayer(e, player)
        ? { ...e, goals: row.goals, assists: row.assists, minutes: row.minutes, played: true }
        : e));
      return adminDb.from('matches').update({ yarimada_lineup: lineup }).eq('id', id).silent();
    });
    if (logDirty) {
      const clean = log.map(e => ({ ...e, opponent: e.opponent.trim(), score: e.score.trim(), goals: n(String(e.goals)), assists: n(String(e.assists)), minutes: n(String(e.minutes)) }));
      jobs.push(adminDb.from('players').update({ match_log: clean }).eq('id', player.id).silent());
    }
    const results = await Promise.all(jobs);
    setSaving(false);
    if (results.some(r => r.error)) return;
    toast('success', `${player.name}: oyunlar yadda saxlanıldı`);
    onSaved();
  };

  const cell = 'w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white text-sm focus:border-accent outline-none';
  const grid = 'grid grid-cols-[8.5rem_minmax(8rem,1fr)_5rem_3.5rem_3.5rem_4rem_2.25rem] gap-2 items-center';

  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 my-2">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h4 className="text-white font-bold text-sm">{player.name} — oyunlar üzrə statistika</h4>
        <div className="flex gap-2">
          <button onClick={addRow} className="border border-gray-600 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5 hover:border-accent">
            <Plus className="w-3.5 h-3.5" /> Oyun əlavə et
          </button>
          <button onClick={save} disabled={saving || (!dirtyLines.size && !logDirty)} className="bg-accent text-on-accent px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5 disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /> {saving ? 'Saxlanılır...' : 'Yadda saxla'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className={`${grid} text-[10px] uppercase tracking-widest text-gray-400 font-bold pb-2`}>
            <span>Tarix</span><span>Rəqib</span><span>Hesab</span><span className="text-center">Q</span><span className="text-center">A</span><span className="text-center">Dəq.</span><span />
          </div>

          {log.map(e => (
            <div key={e.id} className={`${grid} py-1.5 border-t border-gray-800`}>
              <input type="date" value={e.date || ''} onChange={ev => editLog(e.id, { date: ev.target.value || null })} className={cell} aria-label="Tarix" />
              <input type="text" value={e.opponent} placeholder="Rəqib komanda" onChange={ev => editLog(e.id, { opponent: ev.target.value })} className={cell} aria-label="Rəqib" />
              <input type="text" value={e.score} placeholder="3:1" onChange={ev => editLog(e.id, { score: ev.target.value })} className={`${cell} text-center`} aria-label="Hesab" />
              <input type="number" min={0} value={e.goals || ''} placeholder="0" onChange={ev => editLog(e.id, { goals: n(ev.target.value) })} className={`${cell} text-center`} aria-label="Qol" />
              <input type="number" min={0} value={e.assists || ''} placeholder="0" onChange={ev => editLog(e.id, { assists: n(ev.target.value) })} className={`${cell} text-center`} aria-label="Assist" />
              <input type="number" min={0} value={e.minutes || ''} placeholder="0" onChange={ev => editLog(e.id, { minutes: n(ev.target.value) })} className={`${cell} text-center`} aria-label="Dəqiqə" />
              <button onClick={() => removeRow(e.id)} className="p-1.5 text-gray-500 hover:text-red-400" aria-label="Sətri sil" title="Sil"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}

          {lines.map(l => (
            <div key={l.matchId} className={`${grid} py-1.5 border-t border-gray-800`}>
              <span className="text-gray-300 text-sm px-2">{l.date || '—'}</span>
              <span className="text-gray-300 text-sm px-2 truncate" title="Oyunlar bölməsindən dəyişdirilir">{l.opponent}</span>
              <span className="text-gray-300 text-sm text-center">{l.score}</span>
              <input type="number" min={0} value={l.goals || ''} placeholder="0" onChange={ev => editLine(l.matchId, 'goals', ev.target.value)} className={`${cell} text-center`} aria-label="Qol" />
              <input type="number" min={0} value={l.assists || ''} placeholder="0" onChange={ev => editLine(l.matchId, 'assists', ev.target.value)} className={`${cell} text-center`} aria-label="Assist" />
              <input type="number" min={0} value={l.minutes || ''} placeholder="0" onChange={ev => editLine(l.matchId, 'minutes', ev.target.value)} className={`${cell} text-center`} aria-label="Dəqiqə" />
              <span className="text-[9px] uppercase tracking-widest text-gray-500 text-center" title="Oyunlar bölməsindəki oyun">Oyun</span>
            </div>
          ))}

          {log.length === 0 && lines.length === 0 && (
            <p className="text-gray-500 text-sm py-4 text-center border-t border-gray-800">Hələ oyun yoxdur. «Oyun əlavə et» ilə tarix, rəqib, hesab, qol və assist yazın.</p>
          )}
        </div>
      </div>
      <p className="text-gray-500 text-[11px] mt-3">
        Əlavə etdiyiniz hər oyun futbolçunun oyun sayına +1, qol / assist / dəqiqəsinə isə yazılan rəqəm qədər əlavə olunur.
        «Oyun» işarəli sətirlərin tarixi, rəqibi və hesabı «Oyunlar» bölməsindən dəyişdirilir.
      </p>
    </div>
  );
}
