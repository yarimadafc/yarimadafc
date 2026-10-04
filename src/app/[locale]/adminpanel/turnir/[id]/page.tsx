'use client';
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { autoTranslateFields } from '@/lib/autoTranslate';

export default function AdminEdit({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({"name":"","name_az":"","name_en":"","name_ru":"","season":"","age_group":""});

  useEffect(() => {
    supabase.from('tournaments').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setFormData(data);
    });
  }, [id]);

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
      const { updatedData } = await autoTranslateFields(formData, ['name']);
      const { error } = await supabase.from('tournaments').update(updatedData).eq('id', id);
      if (error) throw error;
      router.push('/adminpanel/turnir');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Turnir Redaktə</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="p-4 bg-gray-50 rounded border mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Turnirin Adı</label>
          <div className="space-y-3">
            <div><span className="text-xs font-bold text-gray-500">AZ</span><input type="text" value={formData.name_az || ''} onChange={e => setFormData({...formData, name_az: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">EN (Avto-tərcümə olunacaq)</span><input type="text" value={formData.name_en || ''} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">RU (Avto-tərcümə olunacaq)</span><input type="text" value={formData.name_ru || ''} onChange={e => setFormData({...formData, name_ru: e.target.value})} className="w-full border rounded p-2" /></div>
          </div>
        </div>
      
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Mövsüm</label>
          <input type="text" value={formData.season || ''} onChange={e => setFormData({...formData, season: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Yaş Qrupu</label>
          <input type="text" value={formData.age_group || ''} onChange={e => setFormData({...formData, age_group: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <button disabled={loading} type="submit" className="mt-6 bg-[#0a1628] text-white px-8 py-3 rounded font-medium hover:bg-[#112240] transition disabled:opacity-50">
          {loading ? 'Yadda saxlanılır (Tərcümə edilir)...' : 'Dəyişiklikləri Yadda Saxla'}
        </button>
      </form>
    </div>
  );
}