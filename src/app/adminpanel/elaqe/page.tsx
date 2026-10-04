'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id);
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('contact_messages').delete().eq('id', id);
      fetchMessages();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Əlaqə Mesajları</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Tarix</th>
              <th className="p-4">Göndərən</th>
              <th className="p-4">Mövzu / Mesaj</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Yüklənir...</td></tr>
            ) : messages.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center">Mesaj tapılmadı</td></tr>
            ) : (
              messages.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${!item.read ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 text-gray-500 text-sm">{new Date(item.created_at).toLocaleString('az-AZ')}</td>
                  <td className="p-4">
                    <div className="font-medium">{item.first_name} {item.last_name}</div>
                    <div className="text-xs text-gray-500">{item.email} | {item.phone}</div>
                  </td>
                  <td className="p-4 max-w-md">
                    <div className="font-medium text-sm truncate">{item.subject}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{item.message}</div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {!item.read && <button onClick={() => markAsRead(item.id)} className="text-blue-500 hover:text-blue-700 text-sm">Oxundu</button>}
                    <button onClick={() => deleteMessage(item.id)} className="text-red-500 hover:text-red-700 text-sm">Sil</button>
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
