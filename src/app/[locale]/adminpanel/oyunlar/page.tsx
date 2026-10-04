'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Match } from '@/lib/types';
import Link from 'next/link';

export default function AdminMatches() {
  const [data, setData] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('matches').select('*').order('date', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('matches').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Oyunlar</h1>
        <Link href="/adminpanel/oyunlar/yeni" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded">Yeni Oyun</Link>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Tarix</th>
              <th className="p-4 text-left">Komandalar</th>
              <th className="p-4 text-left">Hesab</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4">{item.date} {item.time}</td>
                <td className="p-4">{item.home_team} vs {item.away_team}</td>
                <td className="p-4">{item.home_score ?? '-'} : {item.away_score ?? '-'}</td>
                <td className="p-4">{item.status}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => deleteItem(item.id)} className="text-red-500">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
