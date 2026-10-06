'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { autoTranslateFields } from '@/lib/autoTranslate';

export default function AdminNewsCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_az: '', title_ru: '', title_en: '',
    content_az: '', content_ru: '', content_en: '',
    excerpt_az: '', category: 'club', author: 'Admin',
    image_url: '', published: true
  });

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert to base64
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
        console.error('Upload error', err);
        alert('Şəkil yüklənərkən xəta baş verdi');
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate a basic slug if not exists
    const slug = generateSlug(formData.title_az || 'xeber');
    
    // Sütunların uyğunsuzluğu səbəbindən autoTranslate hələlik deaktiv edilib. 
    // Yalnız DB-də mövcud olan (böyük ehtimalla) əsas məlumatları göndəririk
    const dataToSave = {
      title_az: formData.title_az,
      content_az: formData.content_az,
      excerpt_az: formData.excerpt_az,
      category: formData.category,
      author: formData.author,
      image_url: formData.image_url,
      published: formData.published,
      slug: slug
    };
    
    try {
      const { error } = await supabase.from('news').insert([dataToSave]);
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      router.push('/adminpanel/xeberler');
    } catch (error: any) {
      console.error(error);
      alert('Xəta baş verdi: Zəhmət olmasa konsola baxın və ya DB sütunlarını yoxlayın.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Yeni Xəbər</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Şəkil yüklə</label>
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
