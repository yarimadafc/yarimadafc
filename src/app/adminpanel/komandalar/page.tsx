'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminTeamsList() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const { data } = await supabase.from('teams').select('*').order('created_at', { ascending: false });
    if (data) setTeams(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('teams').delete().eq('id', id);
      fetchTeams();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Komandalar</h2>
        <Link href="/adminpanel/komandalar/yeni" className="bg-[#c9a84c] text-[#0a1628] px-4 py-2 rounded font-bold hover:bg-[#00c98b] transition">Yeni Komanda</Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Ad</th>
              <th className="p-4">Yaş Qrupu</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={3} className="p-4 text-center">Yüklənir...</td></tr>
            ) : teams.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center">Komanda tapılmadı</td></tr>
            ) : (
              teams.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium flex items-center">
                    {item.logo_url && <img src={item.logo_url} alt={item.name} className="w-8 h-8 rounded-full mr-3 object-cover" />}
                    {item.name}
                  </td>
                  <td className="p-4 text-gray-500">{item.age_group}</td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/adminpanel/komandalar/${item.id}`} className="text-blue-500 hover:text-blue-700">Redaktə et</Link>
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
