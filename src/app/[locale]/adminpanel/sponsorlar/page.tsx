'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

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
        <h1 className="text-2xl font-bold">Sponsorlər</h1>
        <Link href="/adminpanel/sponsorlar/yeni" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded">Yeni Əlavə Et</Link>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left capitalize">name</th><th className="p-4 text-left capitalize">type</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4">{item.name_az || item.name}</td><td className="p-4">{item.type}</td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/adminpanel/sponsorlar/${item.id}`} className="text-blue-500 hover:underline">Redaktə</Link>
                  <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:underline">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}