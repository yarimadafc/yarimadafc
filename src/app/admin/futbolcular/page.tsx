'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminPlayersList() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data } = await supabase.from('players').select('*, teams(name)').order('created_at', { ascending: false });
    if (data) setPlayers(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('players').delete().eq('id', id);
      fetchPlayers();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Futbolçular</h2>
        <Link href="/admin/futbolcular/yeni" className="bg-[#c9a84c] text-[#0a1628] px-4 py-2 rounded font-bold hover:bg-[#00c98b] transition">Yeni Futbolçu</Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Ad Soyad</th>
              <th className="p-4">Nömrə</th>
              <th className="p-4">Mövqe</th>
              <th className="p-4">Komanda</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Yüklənir...</td></tr>
            ) : players.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">Futbolçu tapılmadı</td></tr>
            ) : (
              players.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.first_name} {item.last_name}</td>
                  <td className="p-4 text-gray-500">{item.number}</td>
                  <td className="p-4 text-gray-500">{item.position}</td>
                  <td className="p-4 text-gray-500">{item.teams?.name || '-'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">Sil</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
