'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PRESENCE_CHANNEL, PresenceMeta } from '@/lib/presence';

type Status = 'connecting' | 'live' | 'offline';

// "On the site right now" — listens to the presence channel the public pages join (see SiteTracker).
export default function LiveVisitors() {
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState<{ path: string; n: number }[]>([]);
  const [status, setStatus] = useState<Status>('connecting');

  useEffect(() => {
    const ch = supabase.channel?.(PRESENCE_CHANNEL);
    if (!ch?.subscribe) { setStatus('offline'); return; }
    const read = () => {
      const state = ch.presenceState<PresenceMeta>();
      const visitors = Object.values(state);
      setCount(visitors.length);
      const byPath = new Map<string, number>();
      visitors.forEach(metas => {
        const latest = [...metas].sort((a, b) => (b.since || 0) - (a.since || 0))[0];
        const p = latest?.path || '/';
        byPath.set(p, (byPath.get(p) || 0) + 1);
      });
      setPages([...byPath].map(([path, n]) => ({ path, n })).sort((a, b) => b.n - a.n).slice(0, 8));
    };
    ch.on('presence', { event: 'sync' }, read)
      .subscribe(s => setStatus(s === 'SUBSCRIBED' ? 'live' : s === 'CHANNEL_ERROR' || s === 'TIMED_OUT' || s === 'CLOSED' ? 'offline' : 'connecting'));
    return () => { supabase.removeChannel?.(ch); };
  }, []);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-5">
      <div className="flex items-center gap-4 shrink-0">
        <span className="relative flex w-3.5 h-3.5" aria-hidden>
          {status === 'live' && <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />}
          <span className={`relative inline-flex rounded-full w-3.5 h-3.5 ${status === 'live' ? 'bg-emerald-500' : status === 'connecting' ? 'bg-amber-500' : 'bg-gray-500'}`} />
        </span>
        <div>
          <div className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Hazırda saytda</div>
          <div className="text-4xl font-black text-white tabular-nums leading-none mt-1" aria-live="polite">
            {status === 'offline' ? '—' : count}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {status === 'live' ? 'canlı · avtomatik yenilənir' : status === 'connecting' ? 'qoşulur...' : 'canlı bağlantı yoxdur'}
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 sm:border-l sm:border-gray-700 sm:pl-5">
        {pages.length === 0 ? (
          <p className="text-gray-500 text-sm">{status === 'live' ? 'Hazırda saytda heç kim yoxdur.' : ' '}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {pages.map(p => (
              <li key={p.path} className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full pl-3 pr-1 py-1 text-xs">
                <span className="text-gray-300 truncate max-w-[220px]">{p.path}</span>
                <span className="bg-emerald-600 text-white font-bold rounded-full px-2 py-0.5 tabular-nums">{p.n}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
