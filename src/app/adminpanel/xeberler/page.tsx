'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminNewsList() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('news').delete().eq('id', id);
      fetchNews();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Xəbərlər</h2>
        <Link href="/adminpanel/xeberler/yeni" className="bg-[#c9a84c] text-[#0a1628] px-4 py-2 rounded font-bold hover:bg-[#00c98b] transition">Yeni Xəbər</Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Başlıq</th>
              <th className="p-4">Tarix</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Yüklənir...</td></tr>
            ) : news.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center">Xəbər tapılmadı</td></tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.title_az}</td>
                  <td className="p-4 text-gray-500">{new Date(item.created_at).toLocaleDateString('az-AZ')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.published ? 'Aktiv' : 'Qaralama'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/adminpanel/xeberler/${item.id}`} className="text-blue-500 hover:text-blue-700">Redaktə et</Link>
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
