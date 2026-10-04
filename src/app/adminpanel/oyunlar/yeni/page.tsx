'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function YeniOyun() {
  const router = useRouter();
  const [formData, setFormData] = useState({ home_team: '', away_team: '', date: '', time: '', status: 'upcoming', home_score: 0, away_score: 0 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('matches').insert([formData]);
    setLoading(false);
    router.push('/adminpanel/oyunlar');
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Yeni Oyun</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Ev Sahibi</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.home_team} onChange={e => setFormData({...formData, home_team: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Qonaq</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.away_team} onChange={e => setFormData({...formData, away_team: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Ev Hesab</label>
            <input type="number" className="w-full p-2 border rounded" value={formData.home_score} onChange={e => setFormData({...formData, home_score: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Qonaq Hesab</label>
            <input type="number" className="w-full p-2 border rounded" value={formData.away_score} onChange={e => setFormData({...formData, away_score: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Tarix</label>
            <input type="date" className="w-full p-2 border rounded" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Saat</label>
            <input type="time" className="w-full p-2 border rounded" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold mb-1">Status</label>
            <select className="w-full p-2 border rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="upcoming">Gələcək</option>
              <option value="completed">Tamamlanıb</option>
            </select>
          </div>
        </div>
        <button disabled={loading} type="submit" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded font-bold w-full">Yadda Saxla</button>
      </form>
    </div>
  );
}
