
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSettings() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: row } = await supabase.from('site_settings').select('*').single();
    if (row) {
      setData(row);
    } else {
      // Fallback to contact_info if site_settings doesn't exist
      const { data: contactData } = await supabase.from('contact_info').select('*').single();
      if (contactData) setData(contactData);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Check which table we are saving to
    const tableName = data.hasOwnProperty('hero_bg_image') ? 'site_settings' : 'contact_info';
    
    // We assume the user has ID=1 for the single row
    if (data.id) {
      await supabase.from(tableName).update(data).eq('id', data.id);
    } else {
      await supabase.from(tableName).insert([{ ...data, id: 1 }]);
    }
    
    alert('Məlumatlar uğurla yadda saxlanıldı!');
    setSaving(false);
  };

  
  const handleTextChange = (key: string, val: string) => {
    setData((prev: any) => ({
      ...prev,
      home_texts: {
        ...(prev.home_texts || {}),
        [key]: val
      }
    }));
  };

  const handleChange = (field: string, value: string) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sistem Parametrləri & Şəkillər</h1>
      {loading ? <p>Yüklənir...</p> : (
        <form onSubmit={handleSave} className="bg-white shadow rounded-lg p-6 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="col-span-1 md:col-span-2 border-b pb-4 mb-2">
            <h2 className="text-lg font-bold text-gray-800">Əlaqə Məlumatları</h2>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Ünvan</label>
            <input type="text" value={data?.address || ''} onChange={(e) => handleChange('address', e.target.value)} className="w-full p-2 border rounded" placeholder="Məsələn: Kristal Abşeron 1" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Telefon</label>
            <input type="text" value={data?.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="w-full p-2 border rounded" placeholder="+994 ..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp</label>
            <input type="text" value={data?.whatsapp || ''} onChange={(e) => handleChange('whatsapp', e.target.value)} className="w-full p-2 border rounded" placeholder="+994 ..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-poçt</label>
            <input type="text" value={data?.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full p-2 border rounded" placeholder="info@yarimadafc.com" />
          </div>

          <div className="col-span-1 md:col-span-2 border-b pb-4 mb-2 mt-4">
            <h2 className="text-lg font-bold text-gray-800">Sosial Şəbəkələr (Linklər)</h2>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Facebook</label>
            <input type="text" value={data?.facebook || ''} onChange={(e) => handleChange('facebook', e.target.value)} className="w-full p-2 border rounded" placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Instagram</label>
            <input type="text" value={data?.instagram || ''} onChange={(e) => handleChange('instagram', e.target.value)} className="w-full p-2 border rounded" placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">YouTube</label>
            <input type="text" value={data?.youtube || ''} onChange={(e) => handleChange('youtube', e.target.value)} className="w-full p-2 border rounded" placeholder="https://youtube.com/..." />
            <label className="block mt-4 mb-2 font-bold text-gray-700">Telegram</label>
            <input type="text" value={data?.telegram || ''} onChange={(e) => handleChange('telegram', e.target.value)} className="w-full p-2 border rounded" placeholder="https://t.me/..." />
            
            <label className="block mt-4 mb-2 font-bold text-gray-700">TikTok</label>
            <input type="text" value={data?.tiktok || ''} onChange={(e) => handleChange('tiktok', e.target.value)} className="w-full p-2 border rounded" placeholder="https://tiktok.com/..." />
  
          </div>
            <label className="block mt-4 mb-2 font-bold text-gray-700">Xəritə (Google Maps Embed URL)</label>
            <input type="text" value={data?.map_iframe_url || ''} onChange={(e) => handleChange('map_iframe_url', e.target.value)} className="w-full p-2 border rounded" placeholder="https://www.google.com/maps/embed?pb=..." />
  

          <div className="col-span-1 md:col-span-2 border-b pb-4 mb-2 mt-4">
            <h2 className="text-lg font-bold text-gray-800">Səhifə Arxa Plan Şəkilləri (URL)</h2>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Ana Səhifə (Hero) Şəkli</label>
            <input type="text" value={data?.hero_bg_image || ''} onChange={(e) => handleChange('hero_bg_image', e.target.value)} className="w-full p-2 border rounded" placeholder="https://..." />
            {data?.hero_bg_image && <img src={data.hero_bg_image} className="h-20 mt-2 object-cover rounded" />}
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Biz Kimik? Şəkli</label>
            <input type="text" value={data?.about_bg_image || ''} onChange={(e) => handleChange('about_bg_image', e.target.value)} className="w-full p-2 border rounded" placeholder="https://..." />
            {data?.about_bg_image && <img src={data.about_bg_image} className="h-20 mt-2 object-cover rounded" />}
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Komandalar Şəkli</label>
            <input type="text" value={data?.teams_bg_image || ''} onChange={(e) => handleChange('teams_bg_image', e.target.value)} className="w-full p-2 border rounded" placeholder="https://..." />
            {data?.teams_bg_image && <img src={data.teams_bg_image} className="h-20 mt-2 object-cover rounded" />}
          </div>

          <div className="col-span-1 md:col-span-2 mt-6">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700 w-full md:w-auto">
              {saving ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
