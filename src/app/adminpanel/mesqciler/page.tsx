'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Coach } from '@/lib/types';
import Link from 'next/link';

export default function AdminCoaches() {
  const [data, setData] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('coaches').select('*').order('created_at', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('coaches').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Məşqçilər</h1>
        <Link href="/adminpanel/mesqciler/yeni" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded">Yeni Məşqçi</Link>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Ad, Soyad</th>
              <th className="p-4 text-left">Vəzifə</th>
              <th className="p-4 text-left">Lisenziya</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4">{item.first_name} {item.last_name}</td>
                <td className="p-4">{item.role}</td>
                <td className="p-4">{item.license}</td>
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
