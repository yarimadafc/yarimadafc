'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function YeniMesqci() {
  const router = useRouter();
  const [formData, setFormData] = useState({ first_name: '', last_name: '', role: '', license: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('coaches').insert([formData]);
    setLoading(false);
    router.push('/adminpanel/mesqciler');
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Yeni Məşqçi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Ad</label>
          <input required type="text" className="w-full p-2 border rounded" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Soyad</label>
          <input required type="text" className="w-full p-2 border rounded" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Vəzifə</label>
          <input required type="text" className="w-full p-2 border rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Lisenziya</label>
          <input type="text" className="w-full p-2 border rounded" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} />
        </div>
        <button disabled={loading} type="submit" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded font-bold w-full">Yadda Saxla</button>
      </form>
    </div>
  );
}
