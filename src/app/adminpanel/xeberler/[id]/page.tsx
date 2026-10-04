'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminNewsEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title_az: '', title_ru: '', title_en: '',
    content_az: '', content_ru: '', content_en: '',
    excerpt_az: '', category: 'club', author: 'Admin',
    image_url: '', published: true
  });

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from('news').select('*').eq('id', params.id).single();
      if (data) {
        setFormData(data);
      }
      setFetching(false);
    };
    fetchNews();
  }, [params.id]);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

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
        if (data.url) setFormData({ ...formData, image_url: data.url });
      } catch (err) {
        alert('Şəkil yüklənərkən xəta baş verdi');
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = generateSlug(formData.title_az);
    
    try {
      const { error } = await supabase.from('news').update({ ...formData, slug }).eq('id', params.id);
      if (error) throw error;
      router.push('/adminpanel/xeberler');
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  if (fetching) return <div>Yüklənir...</div>;

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Xəbəri Redaktə Et</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Başlıq (AZ)</label>
          <input required type="text" value={formData.title_az} onChange={e => setFormData({...formData, title_az: e.target.value})} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qısa məzmun (AZ)</label>
          <textarea required value={formData.excerpt_az} onChange={e => setFormData({...formData, excerpt_az: e.target.value})} className="w-full border rounded p-2" rows={2}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Məzmun (AZ)</label>
          <textarea required value={formData.content_az} onChange={e => setFormData({...formData, content_az: e.target.value})} className="w-full border rounded p-2" rows={6}></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kateqoriya</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded p-2">
              <option value="club">Klub</option>
              <option value="academy">Akademiya</option>
              <option value="match">Oyun</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şəkil yüklə (Dəyişmək üçün)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded p-1.5" />
            {formData.image_url && <img src={formData.image_url} alt="Preview" className="h-16 mt-2 rounded" />}
          </div>
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="mr-2" />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">Dərc edilsin?</label>
        </div>

        <button disabled={loading} type="submit" className="bg-[#0a1628] text-white px-6 py-2 rounded font-medium hover:bg-[#112240] transition disabled:opacity-50">
          {loading ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
        </button>
      </form>
    </div>
  );
}
