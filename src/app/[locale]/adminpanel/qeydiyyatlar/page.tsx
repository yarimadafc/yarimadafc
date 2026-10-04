'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminRegistrationsList() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
    if (data) setRegistrations(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('registrations').update({ status }).eq('id', id);
    fetchRegistrations();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Qeydiyyatlar</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Tarix</th>
              <th className="p-4">Uşaq (Yaş)</th>
              <th className="p-4">Valideyn / Əlaqə</th>
              <th className="p-4">Filial</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Yüklənir...</td></tr>
            ) : registrations.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">Qeydiyyat tapılmadı</td></tr>
            ) : (
              registrations.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-500 text-sm">{new Date(item.created_at).toLocaleString('az-AZ')}</td>
                  <td className="p-4">
                    <div className="font-medium">{item.child_name} {item.child_surname}</div>
                    <div className="text-xs text-gray-500">{item.age_group} | {item.birth_date}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-sm">{item.parent_name}</div>
                    <div className="text-xs text-gray-500">Tel: {item.phone}</div>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{item.branch}</td>
                  <td className="p-4">
                    <select 
                      value={item.status || 'new'} 
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className="border rounded p-1 text-sm bg-white"
                    >
                      <option value="new">Yeni</option>
                      <option value="reviewed">Baxıldı</option>
                      <option value="accepted">Qəbul edildi</option>
                      <option value="rejected">Rədd edildi</option>
                    </select>
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
