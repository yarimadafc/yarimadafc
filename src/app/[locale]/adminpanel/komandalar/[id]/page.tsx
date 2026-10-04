'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { use } from 'react';

export default function AdminTeamEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '', age_group: '', description: '', logo_url: ''
  });

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase.from('teams').select('*').eq('id', resolvedParams.id).single();
      if (data) setFormData(data);
      setFetching(false);
    };
    fetchTeam();
  }, [resolvedParams.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        const data = await res.json();
        if (data.url) setFormData({ ...formData, logo_url: data.url });
      } catch (err) {
        alert('Şəkil yüklənərkən xəta baş verdi');
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.from('teams').update(formData).eq('id', resolvedParams.id);
      if (error) throw error;
      router.push('/adminpanel/komandalar');
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  if (fetching) return <div>Yüklənir...</div>;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Komandanı Redaktə Et</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Komandanın Adı</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yaş Qrupu</label>
          <input required type="text" value={formData.age_group} onChange={e => setFormData({...formData, age_group: e.target.value})} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıqlama</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded p-2" rows={4}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Şəkil/Loqo yüklə (Dəyişmək üçün)</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded p-1.5" />
          {formData.logo_url && <img src={formData.logo_url} alt="Preview" className="h-24 mt-2 rounded object-cover" />}
        </div>

        <button disabled={loading} type="submit" className="bg-[#0a1628] text-white px-6 py-2 rounded font-medium hover:bg-[#112240] transition disabled:opacity-50">
          {loading ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
        </button>
      </form>
    </div>
  );
}
