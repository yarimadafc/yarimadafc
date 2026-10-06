'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { autoTranslateFields } from '@/lib/autoTranslate';

export default function AdminCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({"home_team":"","away_team":"","date":"","time":"","home_score":0,"away_score":0,"stadium":"","stadium_az":"","stadium_en":"","stadium_ru":"","status":"","report":"","report_az":"","report_en":"","report_ru":""});

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
      const { updatedData } = await autoTranslateFields(formData, ['stadium', 'report']);
      const { error } = await supabase.from('matches').insert([updatedData]);
      if (error) throw error;
      router.push('/adminpanel/oyunlar');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Yeni Oyun</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Ev Sahibi (Məs: Yarımada U-12)</label>
          <input type="text" value={formData.home_team || ''} onChange={e => setFormData({...formData, home_team: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Qonaq</label>
          <input type="text" value={formData.away_team || ''} onChange={e => setFormData({...formData, away_team: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Tarix (YYYY-MM-DD)</label>
          <input type="text" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Saat (HH:MM)</label>
          <input type="text" value={formData.time || ''} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Ev Sahibi Qolu</label>
          <input type="number" value={formData.home_score || ''} onChange={e => setFormData({...formData, home_score: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Qonaq Qolu</label>
          <input type="number" value={formData.away_score || ''} onChange={e => setFormData({...formData, away_score: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <div className="p-4 bg-gray-50 rounded border mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Stadion</label>
          <div className="space-y-3">
            <div><span className="text-xs font-bold text-gray-500">AZ</span><input type="text" value={formData.stadium_az || ''} onChange={e => setFormData({...formData, stadium_az: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">EN (Avto-tərcümə olunacaq)</span><input type="text" value={formData.stadium_en || ''} onChange={e => setFormData({...formData, stadium_en: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">RU (Avto-tərcümə olunacaq)</span><input type="text" value={formData.stadium_ru || ''} onChange={e => setFormData({...formData, stadium_ru: e.target.value})} className="w-full border rounded p-2" /></div>
          </div>
        </div>
      
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Status (upcoming, live, completed)</label>
          <input type="text" value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border rounded p-2" />
        </div>
    
        <div className="p-4 bg-gray-50 rounded border mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Oyun Hesabatı</label>
          <div className="space-y-3">
            <div><span className="text-xs font-bold text-gray-500">AZ</span><textarea rows={3} value={formData.report_az || ''} onChange={e => setFormData({...formData, report_az: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">EN (Avto-tərcümə olunacaq)</span><textarea rows={3} value={formData.report_en || ''} onChange={e => setFormData({...formData, report_en: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">RU (Avto-tərcümə olunacaq)</span><textarea rows={3} value={formData.report_ru || ''} onChange={e => setFormData({...formData, report_ru: e.target.value})} className="w-full border rounded p-2" /></div>
          </div>
        </div>
      
        <button disabled={loading} type="submit" className="mt-6 bg-[#152741] text-white px-8 py-3 rounded font-medium hover:bg-[#112240] transition disabled:opacity-50">
          {loading ? 'Yadda saxlanılır (Tərcümə edilir)...' : 'Yadda Saxla'}
        </button>
      </form>
    </div>
  );
}