'use client';
import { useEffect, useMemo, useState } from 'react';
import { Download, Trash2, Search, RefreshCw } from 'lucide-react';
import { toast } from '@/lib/adminDb';
import { ageFromBirth } from '@/lib/member';

interface Member {
  user_id: string; email: string; first_name: string | null; last_name: string | null;
  phone: string | null; birth_date: string | null; gender: 'male' | 'female' | null; created_at: string;
}

const genderLabel = (g: Member['gender']) => (g === 'male' ? 'Kişi' : g === 'female' ? 'Qadın' : '—');
const fmt = (iso: string) => new Date(iso).toLocaleString('az-AZ', { dateStyle: 'short', timeStyle: 'short' });

export default function MembersAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [gender, setGender] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/members', { cache: 'no-store' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setError(json.error || (res.status === 401 ? 'Sessiya bitib, yenidən daxil olun.' : `HTTP ${res.status}`));
      else setMembers(json.members || []);
    } catch (e) {
      setError((e as Error).message || 'Şəbəkə xətası');
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const list = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('az');
    return members.filter(m =>
      (!gender || m.gender === gender) &&
      (!s || [m.first_name, m.last_name, m.email, m.phone].some(v => (v || '').toLocaleLowerCase('az').includes(s))));
  }, [members, q, gender]);

  const remove = async (m: Member) => {
    if (!confirm(`${m.first_name || ''} ${m.last_name || ''} (${m.email}) hesabı silinsin? Bu geri qaytarılmır.`)) return;
    const res = await fetch('/api/admin/members', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: m.user_id }) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return toast('error', json.error || 'Silinmədi');
    setMembers(prev => prev.filter(x => x.user_id !== m.user_id));
    toast('success', 'Hesab silindi');
  };

  const exportCsv = () => {
    const esc = (v: string | number | null) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [['Ad', 'Soyad', 'Email', 'Telefon', 'Doğum tarixi', 'Yaş', 'Cins', 'Qeydiyyat tarixi'],
      ...list.map(m => [m.first_name, m.last_name, m.email, m.phone, m.birth_date, ageFromBirth(m.birth_date), genderLabel(m.gender), m.created_at])];
    const blob = new Blob(['﻿' + rows.map(r => r.map(esc).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `uzvler-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const male = members.filter(m => m.gender === 'male').length;
  const female = members.filter(m => m.gender === 'female').length;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Üzvlər</h2>
          <p className="text-gray-400 text-sm">Saytda qeydiyyatdan keçən istifadəçilər.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:border-accent"><RefreshCw className="w-4 h-4" /> Yenilə</button>
          <button onClick={exportCsv} disabled={list.length === 0} className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"><Download className="w-4 h-4" /> CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[['Cəmi', members.length], ['Kişi', male], ['Qadın', female]].map(([l, n]) => (
          <div key={l} className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-white tabular-nums">{n}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">{l}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ad, email və ya telefon..." className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-3 text-white outline-none focus:border-accent" />
        </div>
        <select value={gender} onChange={e => setGender(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white">
          <option value="">Bütün cinslər</option>
          <option value="male">Kişi</option>
          <option value="female">Qadın</option>
        </select>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl p-4 text-sm font-semibold">{error}</div>
      ) : loading ? (
        <div className="text-accent text-center font-bold tracking-widest uppercase animate-pulse mt-10">Yüklənir...</div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm text-gray-300">
              <thead className="bg-gray-900 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                <tr>
                  <th className="p-4">Ad Soyad</th><th className="p-4">Email</th><th className="p-4">Telefon</th>
                  <th className="p-4">Doğum / Yaş</th><th className="p-4">Cins</th><th className="p-4">Qeydiyyat</th><th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {list.map(m => (
                  <tr key={m.user_id} className="border-t border-gray-700 hover:bg-gray-800/60">
                    <td className="p-4 font-bold text-white whitespace-nowrap">{m.first_name} {m.last_name}</td>
                    <td className="p-4"><a href={`mailto:${m.email}`} className="hover:text-accent">{m.email}</a></td>
                    <td className="p-4 whitespace-nowrap">{m.phone ? <a href={`tel:${m.phone}`} className="hover:text-accent">{m.phone}</a> : '—'}</td>
                    <td className="p-4 whitespace-nowrap">{m.birth_date || '—'}{ageFromBirth(m.birth_date) !== null && <span className="text-gray-500"> · {ageFromBirth(m.birth_date)}</span>}</td>
                    <td className="p-4">{genderLabel(m.gender)}</td>
                    <td className="p-4 text-gray-400 whitespace-nowrap">{fmt(m.created_at)}</td>
                    <td className="p-4 text-right"><button onClick={() => remove(m)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20" title="Sil"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
                {list.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">{members.length === 0 ? 'Hələ qeydiyyatdan keçən yoxdur.' : 'Heç nə tapılmadı.'}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
