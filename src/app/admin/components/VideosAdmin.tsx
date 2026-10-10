'use client';
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { adminDb, toast } from '@/lib/adminDb';
import { Trash2, Plus, PlayCircle } from 'lucide-react';

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function VideosAdmin() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (data) setVideos(data);
    setLoading(false);
  };

  const handleEdit = (v: any) => {
    setTitle(v.title);
    setUrl(v.url);
    setEditingId(v.id);
    setIsAdding(true);
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return toast('error', 'Bütün xanaları doldurun');
    
    const videoId = getYoutubeId(url);
    if (!videoId) return toast('error', 'Düzgün YouTube linki daxil edin');

    const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    let error;
    if (editingId) {
      const res = await adminDb.from('videos').update({ 
        title, 
        url, 
        thumbnail_url: thumbUrl 
      }).eq('id', editingId);
      error = res.error;
    } else {
      const res = await adminDb.from('videos').insert([{ 
        title, 
        url, 
        thumbnail_url: thumbUrl, 
        published_date: new Date().toISOString() 
      }]);
      error = res.error;
    }
    
    if (!error) {
      setIsAdding(false);
      setTitle(''); setUrl(''); setEditingId(null);
      fetchVideos();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu videonu silmək istədiyinizə əminsiniz?')) {
      await adminDb.from('videos').delete().eq('id', id);
      fetchVideos();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Videolar İdarəetməsi</h2>
          <p className="text-gray-400 text-sm">Youtube linki əlavə etmək kifayətdir, şəkil avtomatik çəkiləcək.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2 hover:bg-text-main hover:text-bg-main transition-colors">
          {isAdding ? <span onClick={() => { setEditingId(null); setTitle(''); setUrl(''); }}>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Video</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddVideo} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Video Başlığı</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none" required />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">YouTube Linki</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none" required />
          </div>
          <button type="submit" className="w-full bg-accent text-on-accent py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-text-main hover:text-bg-main transition-colors">Yadda Saxla</button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-accent py-10">Yüklənir...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => (
            <div key={v.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col">
              <div className="h-32 relative">
                 <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                   <PlayCircle className="w-10 h-10 text-white/80" />
                 </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                 <h3 className="font-bold text-white text-sm line-clamp-2 mb-2">{v.title}</h3>
                 <div className="mt-2 flex space-x-2">
     <button onClick={() => handleEdit(v)} className="flex-1 flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 py-2 rounded-lg transition-colors text-xs font-bold uppercase">
       Düzəliş
     </button>
     <button onClick={() => handleDelete(v.id)} className="flex-1 flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 py-2 rounded-lg transition-colors text-xs font-bold uppercase">
                   <Trash2 className="w-4 h-4" /> <span>Sil</span>
                   </button>
                 </div>
              </div>
            </div>
          ))}
          {videos.length === 0 && <div className="col-span-full text-center text-gray-400 py-10">Video tapılmadı.</div>}
        </div>
      )}
    </div>
  );
}
