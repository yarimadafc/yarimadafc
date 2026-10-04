'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HeroBanner } from '@/lib/types';

export default function AdminBanners() {
  const [data, setData] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('hero_banners').select('*').order('sort_order', { ascending: true });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('hero_banners').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ana Səhifə Bannerləri</h1>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow overflow-hidden relative">
              {item.image_url && <img src={item.image_url} alt="Banner" className="w-full h-48 object-cover" />}
              <div className="p-4">
                <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.subtitle}</p>
                <div className="flex justify-between">
                  <span className={`px-2 py-1 text-xs rounded font-bold ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.active ? 'Aktiv' : 'Passiv'}
                  </span>
                  <button onClick={() => deleteItem(item.id)} className="text-red-500 text-sm font-bold">Sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
