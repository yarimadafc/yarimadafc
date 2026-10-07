'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, UploadCloud, Youtube } from 'lucide-react';

export default function VideosAdmin() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (data) setVideos(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) setImageUrl(uploadData.url);
        setIsUploading(false);
      };
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !imageUrl) return alert('Bütün xanaları doldurun');
    
    const { error } = await supabase.from('videos').insert([{ 
      title, 
      url, 
      thumbnail_url: imageUrl, 
      published_date: new Date().toISOString() 
    }]);
    
    if (error) {
      alert('Xəta: ' + error.message);
    } else {
      alert('Video əlavə edildi!');
      setIsAdding(false);
      setTitle(''); setUrl(''); setImageUrl('');
      fetchVideos();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu videonu silmək istədiyinizə əminsiniz?')) {
      await supabase.from('videos').delete().eq('id', id);
      fetchVideos();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Videolar İdarəetməsi</h2>
          <p className="text-gray-400 text-sm">Youtube videolarını buradan əlavə edin.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2 hover:bg-white transition-colors">
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Video</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddVideo} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Video Başlığı</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">YouTube Linki</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Video Şəkli (Thumbnail)</label>
            <div className="flex items-center space-x-4">
              <label className="bg-[#0d1a2d] border border-gray-700 hover:border-[#d7bf7b] text-gray-300 px-4 py-3 rounded-lg cursor-pointer flex items-center space-x-2 transition-colors">
                <UploadCloud className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{isUploading ? 'Yüklənir...' : 'Şəkil Seç'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {imageUrl && <img src={imageUrl} alt="Preview" className="h-12 w-16 object-cover rounded-md" />}
            </div>
          </div>
          <button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">Yadda Saxla</button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-[#d7bf7b] py-10">Yüklənir...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => (
            <div key={v.id} className="bg-[#152741] border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="h-32 relative">
                 <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                   <Youtube className="w-10 h-10 text-red-600" />
                 </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                 <h3 className="font-bold text-white text-sm line-clamp-2 mb-2">{v.title}</h3>
                 <button onClick={() => handleDelete(v.id)} className="mt-2 flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 py-2 rounded-lg transition-colors text-xs font-bold uppercase">
                   <Trash2 className="w-4 h-4" /> <span>Sil</span>
                 </button>
              </div>
            </div>
          ))}
          {videos.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">Video tapılmadı.</div>}
        </div>
      )}
    </div>
  );
}
