'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb, toast } from '@/lib/adminDb';
import { uploadFromInput } from '@/lib/uploadImage';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function HeroAdmin() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    const { data } = await supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
    if (data) setSlides(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const url = await uploadFromInput(e, 'high'); // full-width slide: keep it sharp
    if (url) setImageUrl(url);
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return toast('error', 'Şəkil mütləqdir!');
    const payload = { title, subtitle, link_url: linkUrl, image_url: imageUrl, sort_order: sortOrder };
    if (editingId) {
      await adminDb.from('hero_slides').update(payload).eq('id', editingId);
    } else {
      await adminDb.from('hero_slides').insert([payload]);
    }
    setIsAdding(false);
    resetForm();
    fetchSlides();
  };

  const handleEdit = (s: any) => {
    setTitle(s.title || '');
    setSubtitle(s.subtitle || '');
    setLinkUrl(s.link_url || '');
    setImageUrl(s.image_url);
    setSortOrder(s.sort_order || 0);
    setEditingId(s.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await adminDb.from('hero_slides').delete().eq('id', id);
      fetchSlides();
    }
  };

  const resetForm = () => {
    setTitle(''); setSubtitle(''); setLinkUrl(''); setImageUrl(''); setSortOrder(0); setEditingId(null);
  };

  if (loading) return <div className="text-white p-6">Yüklənir...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Ana Səhifə Karuseli</h2>
        <button 
          onClick={() => { resetForm(); setIsAdding(!isAdding); }}
          className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" /> <span>{isAdding ? 'Ləğv et' : 'Yeni Slayd'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Başlıq</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Alt Başlıq (Subtitle)</label>
              <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Sıralama (Məs: 1, 2, 3)</label>
              <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Link (Kliklədikdə hara getsin? İxtiyari)</label>
              <input type="text" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Slayd Şəkli (Zəruridir)</label>
              <div className="flex items-center space-x-3">
                {imageUrl && <img src={imageUrl} alt="img" className="w-32 h-16 object-cover rounded" />}
                <label className="cursor-pointer bg-black border border-gray-700 px-4 py-2 rounded text-xs font-bold text-white uppercase">
                  {uploading ? 'Yüklənir...' : 'Şəkil Seç'}
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
        {slides.map(s => (
          <div key={s.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
            <div className="relative h-40 bg-black">
              <img src={s.image_url} alt="slide" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 text-xs rounded font-bold">Sıra: {s.sort_order}</div>
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-white font-bold mb-1 truncate">{s.title || '(Başlıq yoxdur)'}</h3>
              <p className="text-gray-400 text-xs line-clamp-1">{s.subtitle}</p>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end space-x-2">
              <button onClick={() => handleEdit(s)} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-600/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {slides.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-12 text-gray-500">Heç bir slayd əlavə edilməyib.</div>
        )}
      </div>
    </div>
  );
}
