'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Standing } from '@/lib/types';
import Link from 'next/link';

export default function AdminStandings() {
  const [data, setData] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('standings').select('*').order('points', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('standings').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Turnir Cədvəli (Komandalar)</h1>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Komanda</th>
              <th className="p-4 text-left">Oyun</th>
              <th className="p-4 text-left">Q / H / M</th>
              <th className="p-4 text-left">Toplar</th>
              <th className="p-4 text-left">Xal</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4 font-bold">{item.team_name}</td>
                <td className="p-4">{item.played}</td>
                <td className="p-4">{item.won} / {item.drawn} / {item.lost}</td>
                <td className="p-4">{item.goals_for} - {item.goals_against}</td>
                <td className="p-4 font-bold text-[var(--ks-kinpaku)]">{item.points}</td>
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
