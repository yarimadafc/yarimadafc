'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { autoTranslateFields } from '@/lib/autoTranslate';

export default function AdminCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({"title":"","title_az":"","title_en":"","title_ru":"","subtitle":"","subtitle_az":"","subtitle_en":"","subtitle_ru":"","button_text":"","button_text_az":"","button_text_en":"","button_text_ru":"","button_link":"","image_url":"","active":true});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64 }) });
        const data = await res.json();
        if (data.url) setFormData({ ...formData, [field]: data.url });
      } catch (err) { alert('Şəkil yüklənərkən xəta'); }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { updatedData } = await autoTranslateFields(formData, ['title', 'subtitle', 'button_text']);
      const { error } = await supabase.from('hero_banners').insert([updatedData]);
      if (error) throw error;
      router.push('/adminpanel/bannerler');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Yeni Banner</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="p-4 bg-gray-50 rounded border mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Başlıq</label>
          <div className="space-y-3">
            <div><span className="text-xs font-bold text-gray-500">AZ</span><input type="text" value={formData.title_az || ''} onChange={e => setFormData({...formData, title_az: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">EN (Avto-tərcümə olunacaq)</span><input type="text" value={formData.title_en || ''} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">RU (Avto-tərcümə olunacaq)</span><input type="text" value={formData.title_ru || ''} onChange={e => setFormData({...formData, title_ru: e.target.value})} className="w-full border rounded p-2" /></div>
          </div>
        </div>
      
        <div className="p-4 bg-gray-50 rounded border mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Alt Mətn</label>
          <div className="space-y-3">
            <div><span className="text-xs font-bold text-gray-500">AZ</span><textarea rows={3} value={formData.subtitle_az || ''} onChange={e => setFormData({...formData, subtitle_az: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">EN (Avto-tərcümə olunacaq)</span><textarea rows={3} value={formData.subtitle_en || ''} onChange={e => setFormData({...formData, subtitle_en: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">RU (Avto-tərcümə olunacaq)</span><textarea rows={3} value={formData.subtitle_ru || ''} onChange={e => setFormData({...formData, subtitle_ru: e.target.value})} className="w-full border rounded p-2" /></div>
          </div>
        </div>
      
        <div className="p-4 bg-gray-50 rounded border mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Düymə Yazısı</label>
          <div className="space-y-3">
            <div><span className="text-xs font-bold text-gray-500">AZ</span><input type="text" value={formData.button_text_az || ''} onChange={e => setFormData({...formData, button_text_az: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">EN (Avto-tərcümə olunacaq)</span><input type="text" value={formData.button_text_en || ''} onChange={e => setFormData({...formData, button_text_en: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">RU (Avto-tərcümə olunacaq)</span><input type="text" value={formData.button_text_ru || ''} onChange={e => setFormData({...formData, button_text_ru: e.target.value})} className="w-full border rounded p-2" /></div>
          </div>
        </div>
      
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Düymə Linki</label>
          <input type="text" value={formData.button_link || ''} onChange={e => setFormData({...formData, button_link: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Şəkil URL</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url')} className="w-full border rounded p-1.5" />
          {formData.image_url && <img src={formData.image_url} alt="Preview" className="h-24 mt-2 rounded object-cover" />}
        </div>
      
        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-5 h-5" />
          <label className="text-sm font-bold text-gray-700">Aktivdir?</label>
        </div>
      
        <button disabled={loading} type="submit" className="mt-6 bg-[#0a1628] text-white px-8 py-3 rounded font-medium hover:bg-[#112240] transition disabled:opacity-50">
          {loading ? 'Yadda saxlanılır (Tərcümə edilir)...' : 'Yadda Saxla'}
        </button>
      </form>
    </div>
  );
}