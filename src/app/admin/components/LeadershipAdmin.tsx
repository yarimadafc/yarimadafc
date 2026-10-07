'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/imageCompress';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function LeadershipAdmin() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [orderNum, setOrderNum] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    const { data } = await supabase.from('leadership').select('*').order('order_num', { ascending: true });
    if (data) setLeaders(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
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
      setUploading(false);
    }
  };

  const handleEdit = (L: any) => {
    setName(L.name);
    setPosition(L.position || '');
    setBio(L.bio || '');
    setImageUrl(L.image_url || '');
    setOrderNum(L.order_num || 0);
    setEditingId(L.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('leadership').update({ name, position, bio, image_url: imageUrl, order_num: orderNum }).eq('id', editingId);
    } else {
      await supabase.from('leadership').insert([{ name, position, bio, image_url: imageUrl, order_num: orderNum }]);
    }
    setIsAdding(false);
    resetForm();
    fetchLeaders();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('leadership').delete().eq('id', id);
      fetchLeaders();
    }
  };

  const resetForm = () => {
    setName(''); setPosition(''); setBio(''); setImageUrl(''); setOrderNum(0); setEditingId(null);
  };

  if (loading) return <div className="text-white p-6">Yüklənir...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Komanda Rəhbərliyi</h2>
        <button 
          onClick={() => { resetForm(); setIsAdding(!isAdding); }}
          className="bg-accent text-[#141414] px-4 py-2 rounded-lg font-bold flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" /> <span>{isAdding ? 'Ləğv et' : 'Yeni Şəxs'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-black p-6 rounded-2xl border border-gray-700 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ad Soyad</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" required />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Vəzifə (Məs: Prezident)</label>
              <input type="text" value={position} onChange={e => setPosition(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Haqqında (İstəyə bağlı)</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white"></textarea>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Sıralama (Məs: 1 öndə)</label>
              <input type="number" value={orderNum} onChange={e => setOrderNum(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Şəkil</label>
              <div className="flex items-center space-x-3">
                {imageUrl && <img src={imageUrl} alt="img" className="w-10 h-10 object-cover rounded" />}
                <label className="cursor-pointer bg-gray-800 border border-gray-700 px-4 py-2 rounded text-xs font-bold text-white uppercase">
                  {uploading ? 'Yüklənir...' : 'Seç'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold">Yadda Saxla</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaders.map(L => (
          <div key={L.id} className="bg-black p-4 rounded-xl border border-gray-700 flex flex-col items-center text-center">
            {L.image_url ? (
              <img src={L.image_url} alt={L.name} className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-accent" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4 text-3xl">👤</div>
            )}
            <h3 className="text-white font-bold">{L.name}</h3>
            <p className="text-accent text-xs font-bold uppercase tracking-widest">{L.position}</p>
            <div className="flex space-x-2 mt-4">
              <button onClick={() => handleEdit(L)} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(L.id)} className="p-2 bg-red-600/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
