'use client';
import { useEffect, useState } from 'react';
import { RefreshCw, Users, Eye, ShoppingBag, UserPlus, Table2, BarChart3 } from 'lucide-react';

type Range = 'day' | 'week' | 'month';
interface Point { bucket: string; views: number; visitors: number; orders: number; registrations: number }
interface Totals { views: number; visitors: number; orders: number; registrations: number }
interface Top { name: string; total: number }
interface Data { series: Point[]; totals: Totals | null; previous: Totals | null; last24h: Totals | null; topPages: Top[]; topProducts: Top[] }

const RANGES: { id: Range; label: string; hint: string }[] = [
  { id: 'day', label: 'Günlük', hint: 'son 30 gün' },
  { id: 'week', label: 'Həftəlik', hint: 'son 12 həftə' },
  { id: 'month', label: 'Aylıq', hint: 'son 12 ay' },
];
const METRICS: { key: keyof Totals; label: string; icon: typeof Users; note?: string }[] = [
  { key: 'visitors', label: 'Ziyarətçilər', icon: Users, note: 'unikal brauzer' },
  { key: 'views', label: 'Səhifə baxışları', icon: Eye },
  { key: 'orders', label: 'Sifarişlər', icon: ShoppingBag, note: 'WhatsApp sifariş düyməsi' },
  { key: 'registrations', label: 'Qeydiyyatlar', icon: UserPlus },
];
const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avq', 'sen', 'okt', 'noy', 'dek'];
const MONTHS_LONG = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

// series colour validated for the admin surface (#0a1a38): dataviz validate_palette — all checks pass
const SERIES = '#3987e5';

function bucketLabel(iso: string, range: Range, long = false) {
  const [y, m, d] = iso.split('-').map(Number);
  if (range === 'month') return long ? `${MONTHS_LONG[m - 1]} ${y}` : `${MONTHS[m - 1]} ${String(y).slice(2)}`;
  const base = `${d} ${MONTHS[m - 1]}`;
  return range === 'week' && long ? `${base} — həftə` : base;
}

const n = (v: unknown) => Number(v) || 0;
const fmt = (v: number) => v.toLocaleString('az-AZ');

function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].find(s => s * p >= v / 2)! * p;
  return Math.ceil(v / step) * step;
}

function Delta({ now, before }: { now: number; before: number }) {
  if (!before && !now) return <span className="text-gray-500">—</span>;
  if (!before) return <span className="text-gray-400">yeni</span>;
  const pct = Math.round(((now - before) / before) * 100);
  const up = pct >= 0;
  return <span className={up ? 'text-emerald-400' : 'text-red-400'}>{up ? '▲' : '▼'} {Math.abs(pct)}% <span className="text-gray-500">əvvəlki dövrə görə</span></span>;
}

function BarChart({ points, metric, range, title }: { points: Point[]; metric: keyof Totals; range: Range; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const values = points.map(p => n(p[metric]));
  const max = niceMax(Math.max(0, ...values));
  const ticks = [max, max / 2, 0];
  const labelEvery = Math.max(1, Math.ceil(points.length / 6));

  return (
    <figure className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
      <figcaption className="flex items-baseline justify-between gap-3 mb-4">
        <span className="text-white font-bold text-sm">{title}</span>
        <span className="text-gray-400 text-xs tabular-nums">cəmi {fmt(values.reduce((a, b) => a + b, 0))}</span>
      </figcaption>
      <div className="flex gap-2">
        {/* y axis */}
        <div className="flex flex-col justify-between h-40 text-[10px] text-gray-500 tabular-nums text-right w-8 shrink-0 -mt-1.5 pb-0">
          {ticks.map(t => <span key={t}>{fmt(Math.round(t))}</span>)}
        </div>
        <div className="relative flex-1 min-w-0">
          {/* recessive grid */}
          <div className="absolute inset-x-0 top-0 h-40 flex flex-col justify-between pointer-events-none" aria-hidden>
            {ticks.map(t => <div key={t} className={`border-t ${t === 0 ? 'border-gray-600' : 'border-gray-700/60 border-dashed'}`} />)}
          </div>
          <div className="relative h-40 flex items-end gap-[2px]" role="img" aria-label={`${title}: ${points.map((p, i) => `${bucketLabel(p.bucket, range, true)} ${values[i]}`).join(', ')}`}>
            {points.map((p, i) => {
              const h = max ? (values[i] / max) * 100 : 0;
              return (
                <div
                  key={p.bucket}
                  className="relative flex-1 h-full flex items-end cursor-default"
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(h => (h === i ? null : h))}
                  tabIndex={0}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                >
                  <div
                    className="w-full rounded-t-[4px] transition-opacity"
                    style={{ height: values[i] ? `max(${h}%, 2px)` : 0, background: SERIES, opacity: hover === null || hover === i ? 1 : 0.45 }}
                  />
                  {hover === i && (
                    <div className={`absolute z-10 pointer-events-none whitespace-nowrap rounded-lg bg-gray-900 border border-gray-600 px-3 py-2 shadow-xl ${i > points.length * 0.66 ? 'right-0' : i < points.length * 0.33 ? 'left-0' : 'left-1/2 -translate-x-1/2'}`} style={{ bottom: `calc(${h}% + 8px)` }}>
                      <div className="text-white font-black text-base tabular-nums leading-none">{fmt(values[i])}</div>
                      <div className="text-gray-400 text-[11px] mt-1">{bucketLabel(p.bucket, range, true)}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-[2px] mt-2 text-[10px] text-gray-500">
            {points.map((p, i) => (
              <span key={p.bucket} className="flex-1 text-center overflow-visible whitespace-nowrap">{i % labelEvery === 0 || i === points.length - 1 ? bucketLabel(p.bucket, range) : ''}</span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

function TopList({ title, rows, empty }: { title: string; rows: Top[]; empty: string }) {
  const max = Math.max(1, ...rows.map(r => n(r.total)));
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4">{title}</h3>
      {rows.length === 0 ? <p className="text-gray-500 text-sm">{empty}</p> : (
        <ul className="space-y-3">
          {rows.map(r => (
            <li key={r.name}>
              <div className="flex justify-between gap-3 text-sm mb-1">
                <span className="text-gray-300 truncate">{r.name}</span>
                <span className="text-white font-bold tabular-nums">{fmt(n(r.total))}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-900"><div className="h-full rounded-full" style={{ width: `${(n(r.total) / max) * 100}%`, background: SERIES }} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AnalyticsAdmin() {
  const [range, setRange] = useState<Range>('day');
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [asTable, setAsTable] = useState(false);

  const load = async (r: Range) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/admin/analytics?range=${r}`, { cache: 'no-store' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setError(json.error || (res.status === 401 ? 'Sessiya bitib, yenidən daxil olun.' : `HTTP ${res.status}`));
      else setData(json);
    } catch (e) {
      setError((e as Error).message || 'Şəbəkə xətası');
    }
    setLoading(false);
  };
  useEffect(() => { load(range); }, [range]);

  const series = data?.series || [];
  const hint = RANGES.find(r => r.id === range)!.hint;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Statistika</h2>
          <p className="text-gray-400 text-sm">Sayta daxil olanlar, mağaza sifarişləri və qeydiyyatlar — {hint}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-gray-900 border border-gray-700 rounded-lg p-1" role="tablist" aria-label="Dövr">
            {RANGES.map(r => (
              <button key={r.id} role="tab" aria-selected={range === r.id} onClick={() => setRange(r.id)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${range === r.id ? 'bg-accent text-on-accent' : 'text-gray-400 hover:text-white'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <button onClick={() => setAsTable(v => !v)} className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:border-accent" aria-pressed={asTable}>
            {asTable ? <BarChart3 className="w-4 h-4" /> : <Table2 className="w-4 h-4" />} {asTable ? 'Qrafik' : 'Cədvəl'}
          </button>
          <button onClick={() => load(range)} className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:border-accent" aria-label="Yenilə">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl p-4 text-sm font-semibold">{error}</div>
      ) : !data ? (
        <div className="text-accent text-center font-bold tracking-widest uppercase animate-pulse mt-10">Yüklənir...</div>
      ) : (
        <div className={`space-y-6 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {/* headline numbers */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {METRICS.map(({ key, label, icon: Icon, note }) => (
              <div key={key} className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-3">
                  <Icon className="w-4 h-4" /> {label}
                </div>
                <div className="text-3xl md:text-4xl font-black text-white tabular-nums leading-none">{fmt(n(data.totals?.[key]))}</div>
                <div className="text-[11px] mt-3 space-y-1">
                  <div><Delta now={n(data.totals?.[key])} before={n(data.previous?.[key])} /></div>
                  <div className="text-gray-500">son 24 saat: <span className="text-gray-300 font-bold tabular-nums">{fmt(n(data.last24h?.[key]))}</span>{note ? ` · ${note}` : ''}</div>
                </div>
              </div>
            ))}
          </div>

          {asTable ? (
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-300">
                  <thead className="bg-gray-900 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                    <tr><th className="p-3 text-left">Dövr</th>{METRICS.map(m => <th key={m.key} className="p-3 text-right">{m.label}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[...series].reverse().map(p => (
                      <tr key={p.bucket} className="border-t border-gray-700">
                        <td className="p-3 text-white font-semibold whitespace-nowrap">{bucketLabel(p.bucket, range, true)}</td>
                        {METRICS.map(m => <td key={m.key} className="p-3 text-right tabular-nums">{fmt(n(p[m.key]))}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {METRICS.map(m => <BarChart key={m.key} points={series} metric={m.key} range={range} title={m.label} />)}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <TopList title="Ən çox baxılan səhifələr" rows={data.topPages} empty="Hələ məlumat yoxdur." />
            <TopList title="Ən çox sifariş edilən məhsullar" rows={data.topProducts} empty="Bu dövrdə sifariş olmayıb." />
          </div>
          <p className="text-gray-500 text-xs">Ziyarətçi = səhifəni açan unikal brauzer (şəxsi məlumat saxlanmır). Sifariş = mağazada “WhatsApp ilə sifariş et” düyməsinə klik; ödənişin baş tutub-tutmadığını göstərmir.</p>
        </div>
      )}
    </div>
  );
}
