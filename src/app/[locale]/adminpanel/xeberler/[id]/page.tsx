'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { autoTranslateFields } from '@/lib/autoTranslate';

import { use } from 'react';

export default function AdminNewsEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<any>({
    title_az: '', title_ru: '', title_en: '', title: '',
    content_az: '', content_ru: '', content_en: '', content: '',
    excerpt_az: '', excerpt: '', category: 'club', author: 'Admin',
    image_url: '', published: true
  });

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from('news').select('*').eq('id', resolvedParams.id).single();
      if (data) {
        setFormData(data);
      }
      setFetching(false);
    };
    fetchNews();
  }, [resolvedParams.id]);

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
    
    const slug = generateSlug(formData.title_az || formData.title || 'xeber');
    
    let payload: any = {
      title_az: formData.title_az || formData.title,
      content_az: formData.content_az || formData.content,
      excerpt_az: formData.excerpt_az || formData.excerpt,
      title: formData.title_az || formData.title,
      content: formData.content_az || formData.content,
      excerpt: formData.excerpt_az || formData.excerpt,
      category: formData.category,
      author: formData.author,
      image_url: formData.image_url,
      published: formData.published,
      slug: slug
    };
    
    try {
      let success = false;
      let finalError: any = null;

      for (let attempt = 0; attempt < 10; attempt++) {
        const { error } = await supabase.from('news').update(payload).eq('id', resolvedParams.id);
        
        if (!error) {
          success = true;
          break;
        }

        const match = error.message && error.message.match(/Could not find the '(.*?)' column/);
        if (match && match[1]) {
           const missingCol = match[1];
           console.warn(`Sütun tapılmadı: ${missingCol}. Silinib yenidən cəhd edilir...`);
           delete payload[missingCol];
           continue;
        }
        
        finalError = error;
        break;
      }
      
      if (!success && finalError) {
        throw finalError;
      }
      router.push('/adminpanel/xeberler');
    } catch (error: any) {
      alert(`Xəta baş verdi: ${error.message || error.details || JSON.stringify(error)}`);
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

        <button disabled={loading} type="submit" className="bg-[#152741] text-white px-6 py-2 rounded font-medium hover:bg-[#112240] transition disabled:opacity-50">
          {loading ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
        </button>
      </form>
    </div>
  );
}
