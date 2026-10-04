'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function YeniSponsor() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', logo_url: '', type: 'partner' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('sponsors').insert([formData]);
    setLoading(false);
    router.push('/adminpanel/sponsorlar');
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Yeni Sponsor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Sponsor Adı</label>
          <input required type="text" className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Loqo URL</label>
          <input type="text" className="w-full p-2 border rounded" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Növ</label>
          <select className="w-full p-2 border rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
            <option value="principal">Əsas (Principal)</option>
            <option value="official">Rəsmi (Official)</option>
            <option value="partner">Tərəfdaş (Partner)</option>
          </select>
        </div>
        <button disabled={loading} type="submit" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded font-bold w-full">Yadda Saxla</button>
      </form>
    </div>
  );
}
