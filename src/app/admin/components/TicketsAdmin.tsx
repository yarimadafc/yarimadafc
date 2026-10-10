'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb } from '@/lib/adminDb';
import { Save } from 'lucide-react';
import { AnyMatch, formatLongDate, matchStart, normalizeMatch } from '@/lib/matchUtils';
import { TICKETS_DEFAULTS } from '@/lib/siteTexts';

type TicketFields = { ticket_enabled: boolean; ticket_price: string; ticket_note: string; ticket_url: string };
const fieldsOf = (m: AnyMatch): TicketFields => ({
  ticket_enabled: m.ticket_enabled !== false,
  ticket_price: m.ticket_price || '',
  ticket_note: m.ticket_note || '',
  ticket_url: m.ticket_url || '',
});

const PAGE_FIELDS: { key: keyof typeof TICKETS_DEFAULTS; label: string; textarea?: boolean; placeholder?: string }[] = [
  { key: 'tickets_title', label: 'Səhifə başlığı' },
  { key: 'tickets_subtitle', label: 'Başlıq altı mətn', textarea: true },
  { key: 'tickets_whatsapp', label: 'Bilet sifarişi üçün WhatsApp nömrəsi', placeholder: 'Boş qalsa klubun nömrəsi (055 447 74 67)' },
  { key: 'tickets_empty', label: 'Oyun olmayanda göstərilən mətn' },
];

// Tickets page (/tickets): page texts + per upcoming match whether tickets are sold, price, note and an
// optional external purchase link (otherwise the button opens WhatsApp with a ready message).
export default function TicketsAdmin() {
  const [matches, setMatches] = useState<AnyMatch[]>([]);
  const [edits, setEdits] = useState<Record<string, TicketFields>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: mt }, { data: st }] = await Promise.all([
      supabase.from('matches').select('*').neq('status', 'finished').order('match_date', { ascending: true }),
      supabase.from('site_images').select('section_key, image_url').in('section_key', Object.keys(TICKETS_DEFAULTS)),
    ]);
    const now = Date.now();
    const rows = (mt || []).map(normalizeMatch).filter(m => (matchStart(m)?.getTime() ?? now) >= now - 3 * 3600e3);
    setMatches(rows);
    setEdits(Object.fromEntries(rows.map(m => [m.id, fieldsOf(m)])));
    const map: Record<string, string> = { ...TICKETS_DEFAULTS };
    (st || []).forEach((r: any) => { if (r.image_url != null) map[r.section_key] = r.image_url; });
    setTexts(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setField = <K extends keyof TicketFields>(id: string, key: K, value: TicketFields[K]) =>
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [key]: value } }));

  const saveMatch = async (id: string) => {
    const e = edits[id];
    setSavingId(id);
    await adminDb.from('matches').update({
      ticket_enabled: e.ticket_enabled,
      ticket_price: e.ticket_price.trim() || null,
      ticket_note: e.ticket_note.trim() || null,
      ticket_url: e.ticket_url.trim() || null,
    }).eq('id', id);
    setSavingId(null);
  };

  const saveTexts = async () => {
    setSavingId('texts');
    await adminDb.from('site_images').upsert(
      PAGE_FIELDS.map(f => ({ section_key: f.key, image_url: (texts[f.key] || '').trim() })),
      { onConflict: 'section_key' },
    );
    setSavingId(null);
  };

  if (loading) return <div className="text-accent font-bold uppercase tracking-widest animate-pulse">Yüklənir...</div>;

  const input = 'w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none';

  return (
    <div>
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Biletlər</h2>
        <p className="text-gray-400 text-sm">Saytdakı «Biletlər» səhifəsi. Oyunun tarixi, saatı və stadionu «Oyunlar» bölməsindən dəyişdirilir.</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 space-y-4 max-w-4xl">
        <h3 className="text-accent font-bold tracking-widest text-sm uppercase">Səhifə Yazıları</h3>
        {PAGE_FIELDS.map(f => (
          <div key={f.key}>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{f.label}</label>
            {f.textarea ? (
              <textarea value={texts[f.key] || ''} onChange={e => setTexts(t => ({ ...t, [f.key]: e.target.value }))} className={`${input} h-20`} />
            ) : (
              <input type="text" value={texts[f.key] || ''} placeholder={f.placeholder} onChange={e => setTexts(t => ({ ...t, [f.key]: e.target.value }))} className={input} />
            )}
          </div>
        ))}
        <button onClick={saveTexts} disabled={savingId === 'texts'} className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2 disabled:opacity-60">
          <Save className="w-4 h-4" /> <span>{savingId === 'texts' ? 'Saxlanılır...' : 'Yazıları Yadda Saxla'}</span>
        </button>
      </div>

      <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Qarşıdakı Oyunlar</h3>
      {matches.length === 0 ? (
        <div className="text-center text-gray-400 py-10 bg-gray-800 rounded-2xl border border-gray-700">Qarşıdakı oyun yoxdur. Əvvəlcə «Oyunlar» bölməsindən oyun əlavə edin.</div>
      ) : (
        <div className="space-y-4">
          {matches.map(m => {
            const e = edits[m.id] || fieldsOf(m);
            return (
              <div key={m.id} className={`bg-gray-800 border rounded-2xl p-5 ${e.ticket_enabled ? 'border-gray-700' : 'border-gray-800 opacity-70'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{m.tournament || 'Oyun'}</div>
                    <div className="text-white font-black">{m.home_team} – {m.away_team}</div>
                    <div className="text-gray-400 text-xs">{formatLongDate(m.date)}{m.time && `, ${m.time}`}{m.stadium && ` · ${m.stadium}`}</div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={e.ticket_enabled} onChange={ev => setField(m.id, 'ticket_enabled', ev.target.checked)} className="w-5 h-5 accent-white" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Saytda göstər</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Qiymət</label>
                    <input type="text" value={e.ticket_price} placeholder="Məs: 5 AZN / Pulsuz" onChange={ev => setField(m.id, 'ticket_price', ev.target.value)} className={input} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Qeyd</label>
                    <input type="text" value={e.ticket_note} placeholder="Məs: Uşaqlar üçün pulsuz" onChange={ev => setField(m.id, 'ticket_note', ev.target.value)} className={input} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Satış linki (istəyə bağlı)</label>
                    <input type="url" value={e.ticket_url} placeholder="Boş qalsa WhatsApp açılır" onChange={ev => setField(m.id, 'ticket_url', ev.target.value)} className={input} />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={() => saveMatch(m.id)} disabled={savingId === m.id} className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2 disabled:opacity-60">
                    <Save className="w-4 h-4" /> <span>{savingId === m.id ? 'Saxlanılır...' : 'Yadda Saxla'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
