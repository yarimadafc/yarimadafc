
'use client';
import { uploadFromInput } from '@/lib/uploadImage';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb, toast } from '@/lib/adminDb';
import { Trash2, Plus, UploadCloud } from 'lucide-react';

export default function NewsAdmin() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Klub Xəbərləri');
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
    setIsUploading(true);
    const url = await uploadFromInput(e);
    if (url) setImageUrl(url);
    setIsUploading(false);
  };

  const handleEdit = (newsItem: any) => {
    setTitle(newsItem.title_az);
    setContent(newsItem.content_az);
    setCategory(newsItem.category || 'Əsas Komanda');
    setImageUrl(newsItem.image_url || '');
    setEditingId(newsItem.id);
    setIsAdding(true);
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !imageUrl) return toast('error', 'Bütün xanaları doldurun');
    
    let error;
    if (editingId) {
      const res = await adminDb.from('news').update({ 
        title_az: title, 
        content_az: content, 
        category: category,
        image_url: imageUrl 
      }).eq('id', editingId);
      error = res.error;
    } else {
      const res = await adminDb.from('news').insert([{ 
        title_az: title, 
        content_az: content, 
        category: category,
        image_url: imageUrl,
        published: true
      }]);
      error = res.error;
    }
    
    if (!error) {
      setIsAdding(false);
      setTitle(''); setContent(''); setImageUrl(''); setCategory('Klub Xəbərləri');
      fetchNews();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu xəbəri silmək istədiyinizə əminsiniz?')) {
      await adminDb.from('news').delete().eq('id', id);
      fetchNews();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Xəbərlər İdarəetməsi</h2>
          <p className="text-gray-400 text-sm">Saytdakı xəbərləri buradan əlavə edib silə bilərsiniz.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2 hover:bg-text-main hover:text-bg-main transition-colors"
        >
          {isAdding ? <span onClick={() => { setEditingId(null); setTitle(''); setContent(''); setImageUrl(''); }}>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Xəbər</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddNews} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Xəbər Başlığı</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none" placeholder="Başlıq..." required />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Kateqoriya</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none">
              <option value="Əsas Komanda">Əsas Komanda</option>
              <option value="Akademiya">Akademiya</option>
              <option value="Rəsmi">Rəsmi</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Əsas Şəkil</label>
            <div className="flex items-center space-x-4">
              <label className="bg-gray-900 border border-gray-700 hover:border-accent text-gray-400 px-4 py-3 rounded-lg cursor-pointer flex items-center space-x-2 transition-colors">
                <UploadCloud className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{isUploading ? 'Yüklənir...' : 'Şəkil Seç'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {imageUrl && <img src={imageUrl} alt="Preview" className="h-12 w-12 object-cover rounded-md" />}
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Xəbər Mətni</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none h-32" placeholder="Mətn..." required></textarea>
          </div>
          <button type="submit" className="w-full bg-accent text-on-accent py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-text-main hover:text-bg-main transition-colors">Yadda Saxla</button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-accent py-10">Yüklənir...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(n => (
            <div key={n.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col">
              <div className="h-40 relative">
                 <img src={n.image_url} alt={n.title_az} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                 <div>
                   <span className="text-xs text-accent mb-2 block">{(new Date(n.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(n.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(n.created_at).getFullYear())}</span>
                   <h3 className="font-bold text-white text-sm line-clamp-2 mb-2">{n.title_az}</h3>
                 </div>
                 <div className="mt-4 flex space-x-2">
     <button onClick={() => handleEdit(n)} className="flex-1 flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 py-2 rounded-lg transition-colors text-xs font-bold uppercase">
       Düzəliş
     </button>
     <button onClick={() => handleDelete(n.id)} className="flex-1 flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 py-2 rounded-lg transition-colors text-xs font-bold uppercase">
                   <Trash2 className="w-4 h-4" /> <span>Sil</span>
                   </button>
                 </div>
              </div>
            </div>
          ))}
          {news.length === 0 && <div className="col-span-full text-center text-gray-400 py-10">Heç bir xəbər tapılmadı.</div>}
        </div>
      )}
    </div>
  );
}
