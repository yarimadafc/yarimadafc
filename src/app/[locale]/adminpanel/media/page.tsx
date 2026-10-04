'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MediaVideo } from '@/lib/types';

export default function AdminMedia() {
  const [data, setData] = useState<MediaVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('media_videos').select('*').order('created_at', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('media_videos').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media (Videolar)</h1>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-4 truncate">{item.youtube_url}</p>
              <button onClick={() => deleteItem(item.id)} className="text-red-500 text-sm font-bold">Sil</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
