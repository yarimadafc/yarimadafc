'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus } from 'lucide-react';
import { compressImage } from '@/lib/imageCompress';

export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [title, setTitle] = useState('');
  const [count, setCount] = useState('');
  const [orderNum, setOrderNum] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    const { data } = await supabase.from('achievements').select('*').order('created_at', { ascending: false });
    if (data) setAchievements(data);
    setLoading(false);
  };

  const handleEdit = (a: any) => {
    setTitle(a.title);
    setCount(a.count);
    setOrderNum(a.order_num);
    setDescription(a.description || '');
    setImageUrl(a.image_url || '');
    setEditingId(a.id);
    setIsAdding(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingImage(true);
      const file = e.target.files[0];
      const base64 = await compressImage(file);
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }) 
      });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !count) return alert('Bütün xanaları doldurun');
    
    let error;
    if (editingId) {
      const res = await supabase.from('achievements').update({ title, count, order_num: orderNum,
      description,
      image_url: imageUrl }).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('achievements').insert([{ title, count, order_num: orderNum, description, image_url: imageUrl }]);
      error = res.error;
    }
    
    if (error) alert('Xəta: ' + error.message);
    else {
      alert('Nailiyyət əlavə edildi!');
      setIsAdding(false);
      setTitle(''); setCount(''); setOrderNum(0);
    setDescription('');
    setImageUrl(''); setEditingId(null);
      fetchAchievements();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('achievements').delete().eq('id', id);
      fetchAchievements();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Nailiyyətlər</h2>
          <p className="text-gray-400 text-sm">Klubun uğurlarını statistika formatında əlavə edin.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-[#d7bf7b] text-[#141414] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAdding ? <span onClick={() => { setEditingId(null); setTitle(''); setCount(''); setOrderNum(0); }}>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Əlavə Et</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#141414] p-6 rounded-2xl border border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Rəqəm (Məs: 15+)</label>
              <input type="text" value={count} onChange={e => setCount(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Başlıq (Məs: Kubok)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Haqqında (Məzmun)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none"></textarea>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Sıra Nömrəsi</label>
              <input type="number" value={orderNum} onChange={e => setOrderNum(Number(e.target.value))} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Şəkil (İstəyə bağlı)</label>
              <div className="flex items-center space-x-3">
                {imageUrl && <img src={imageUrl} alt="preview" className="w-10 h-10 object-cover rounded" />}
                <label className="cursor-pointer bg-[#0a0a0a] border border-gray-700 px-4 py-3 rounded-lg text-xs font-bold text-gray-400 uppercase">
                  {uploadingImage ? 'Yüklənir...' : 'Cihazdan Seç'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {imageUrl && (
                  <button type="button" onClick={() => setImageUrl('')} className="text-red-500 text-xs font-bold">SIL</button>
                )}
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#d7bf7b] text-[#141414] py-3 rounded-lg font-bold text-xs uppercase hover:bg-white transition-colors">Yadda Saxla</button>
        </form>
      )}

      {loading ? (
        <div className="text-[#d7bf7b] text-center">Yüklənir...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map(a => (
            <div key={a.id} className="bg-[#000000] border border-gray-800 p-6 rounded-xl text-center flex flex-col justify-between">
              <div>
                <div className="text-4xl font-black text-[#d7bf7b] mb-2">{a.count}</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">{a.title}</div>
              </div>
              <div className="mt-4 flex space-x-4 w-full justify-center">
                <button onClick={() => handleEdit(a)} className="text-blue-400 text-xs font-bold uppercase flex items-center justify-center hover:text-blue-300">
                  Düzəliş
                </button>
                <button onClick={() => handleDelete(a.id)} className="text-red-500 text-xs font-bold uppercase flex items-center justify-center space-x-1 hover:text-red-400">
                  <Trash2 className="w-3 h-3" /> <span>Sil</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
