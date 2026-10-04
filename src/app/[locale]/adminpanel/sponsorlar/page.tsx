'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sponsor } from '@/lib/types';

export default function AdminSponsors() {
  const [data, setData] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('sponsors').select('*').order('created_at', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('sponsors').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sponsorlar</h1>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 text-center">
              {item.logo_url && <img src={item.logo_url} alt="Logo" className="h-16 object-contain mx-auto mb-4" />}
              <h3 className="font-bold text-lg mb-1">{item.name}</h3>
              <p className="text-gray-500 text-sm mb-4 uppercase">{item.type}</p>
              <button onClick={() => deleteItem(item.id)} className="text-red-500 text-sm font-bold">Sil</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
