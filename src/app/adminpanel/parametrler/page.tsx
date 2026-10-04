'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ContactInfo } from '@/lib/types';

export default function AdminSettings() {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_info').select('*').single();
    setData(data || null);
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sistem Parametrləri & Əlaqə Məlumatları</h1>
      {loading ? <p>Yüklənir...</p> : (
        <div className="bg-white shadow rounded-lg p-6 max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Ünvan</label>
            <input type="text" value={data?.address || ''} readOnly className="w-full p-2 border rounded bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Telefon</label>
            <input type="text" value={data?.phone || ''} readOnly className="w-full p-2 border rounded bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp</label>
            <input type="text" value={data?.whatsapp || ''} readOnly className="w-full p-2 border rounded bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-poçt</label>
            <input type="text" value={data?.email || ''} readOnly className="w-full p-2 border rounded bg-gray-50" />
          </div>
          <p className="text-sm text-gray-500 pt-4">Qeyd: Bu məlumatları birbaşa verilənlər bazasından (Supabase) dəyişə bilərsiniz.</p>
        </div>
      )}
    </div>
  );
}
