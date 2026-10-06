'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { autoTranslateFields } from '@/lib/autoTranslate';

export default function AdminNewsCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    title_az: '', title_ru: '', title_en: '',
    content_az: '', content_ru: '', content_en: '',
    excerpt_az: '', category: 'club', author: 'Admin',
    image_url: '', published: true
  });

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = async () => {
        // Avtomatik şəkli kiçiltmək (Maksimum genişlik 1024px)
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // 0.8 keyfiyyətində sıxışdırıb base64-ə çeviririk ki 413 Payload Too Large xətası verməsin
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: compressedBase64 })
          });
          const data = await res.json();
          if (data.url) setFormData({ ...formData, image_url: data.url });
        } catch (err) {
          console.error('Upload error', err);
          alert('Şəkil yüklənərkən xəta baş verdi. Şəkil formatı düzgün deyil və ya server doludur.');
        }
      };
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const slug = generateSlug(formData.title_az || 'xeber');
    
    // Yalnız ən geniş payload-ı qururuq. 
    // Loop daxilində "tapılmayan" sütunlar avtomatik silinərək təkrar yoxlanılacaq.
    let payload: any = {
      title_az: formData.title_az,
      content_az: formData.content_az,
      excerpt_az: formData.excerpt_az,
      title: formData.title_az,        // Fallback
      content: formData.content_az,    // Fallback
      excerpt: formData.excerpt_az,    // Fallback
      category: formData.category,
      author: formData.author,
      image_url: formData.image_url,
      published: formData.published,
      slug: slug
    };
    
    try {
      let success = false;
      let finalError: any = null;

      // Özünü-sağaldan (self-healing) dövr. 
      // Tapılmayan sütunları payload-dan silib yenidən göndərir. (Maksimum 10 cəhd)
      for (let attempt = 0; attempt < 10; attempt++) {
        const { error } = await supabase.from('news').insert([payload]);
        
        if (!error) {
          success = true;
          break;
        }

        // Əgər sütun yoxdursa
        const match = error.message && error.message.match(/Could not find the '(.*?)' column/);
        if (match && match[1]) {
           const missingCol = match[1];
           console.warn(`Sütun tapılmadı: ${missingCol}. Payload-dan silinir və yenidən yoxlanılır...`);
           delete payload[missingCol];
           continue;
        }
        
        // Başqa xəta varsa, dövrü qır və göstər
        finalError = error;
        break;
      }
      
      if (!success && finalError) {
        throw finalError;
      }
      
      router.push('/adminpanel/xeberler');
    } catch (error: any) {
      console.error('Final Insert Error:', error);
      alert(`Xəta baş verdi: ${error.message || error.details || JSON.stringify(error)}`);
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
