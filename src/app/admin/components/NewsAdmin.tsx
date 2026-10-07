
'use client';
import { compressImage } from '@/lib/imageCompress';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, UploadCloud } from 'lucide-react';

export default function NewsAdmin() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const base64 = await compressImage(file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });
      if (!uploadRes.ok) throw new Error(`Status: ${uploadRes.status}`);
      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        setImageUrl(uploadData.url);
      } else {
        alert('Şəkil yüklənərkən xəta oldu');
      }
      setIsUploading(false);
    } catch (err) {
      console.error(err);
      alert('Şəkil yüklənərkən xəta baş verdi');
      setIsUploading(false);
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !imageUrl) return alert('Bütün xanaları doldurun');
    
    const { error } = await supabase.from('news').insert([{ 
      title, 
      content, 
      image_url: imageUrl, 
      published_date: new Date().toISOString() 
    }]);
    
    if (error) {
      alert('Xəta: ' + error.message);
    } else {
      alert('Xəbər əlavə edildi!');
      setIsAdding(false);
      setTitle(''); setContent(''); setImageUrl('');
      fetchNews();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu xəbəri silmək istədiyinizə əminsiniz?')) {
      await supabase.from('news').delete().eq('id', id);
      fetchNews();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Xəbərlər İdarəetməsi</h2>
          <p className="text-gray-400 text-sm">Saytdakı xəbərləri buradan əlavə edib silə bilərsiniz.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2 hover:bg-white transition-colors"
        >
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Xəbər</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddNews} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Xəbər Başlığı</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" placeholder="Başlıq..." required />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Əsas Şəkil</label>
            <div className="flex items-center space-x-4">
              <label className="bg-[#0d1a2d] border border-gray-700 hover:border-[#d7bf7b] text-gray-300 px-4 py-3 rounded-lg cursor-pointer flex items-center space-x-2 transition-colors">
                <UploadCloud className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{isUploading ? 'Yüklənir...' : 'Şəkil Seç'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {imageUrl && <img src={imageUrl} alt="Preview" className="h-12 w-12 object-cover rounded-md" />}
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Xəbər Mətni</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none h-32" placeholder="Mətn..." required></textarea>
          </div>
          <button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">Yadda Saxla</button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-[#d7bf7b] py-10">Yüklənir...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(n => (
            <div key={n.id} className="bg-[#152741] border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="h-40 relative">
                 <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                 <div>
                   <span className="text-xs text-[#d7bf7b] mb-2 block">{new Date(n.published_date).toLocaleDateString('az-AZ')}</span>
                   <h3 className="font-bold text-white text-sm line-clamp-2 mb-2">{n.title}</h3>
                 </div>
                 <button onClick={() => handleDelete(n.id)} className="mt-4 flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 py-2 rounded-lg transition-colors text-xs font-bold uppercase">
                   <Trash2 className="w-4 h-4" /> <span>Sil</span>
                 </button>
              </div>
            </div>
          ))}
          {news.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">Heç bir xəbər tapılmadı.</div>}
        </div>
      )}
    </div>
  );
}
