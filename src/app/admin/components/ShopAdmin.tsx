'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, UploadCloud } from 'lucide-react';
import { compressImage } from '@/lib/imageCompress';

export default function ShopAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
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
      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();
      if (uploadData.url) setImageUrl(uploadData.url);
    } catch (err) {
      alert('Şəkil yüklənərkən xəta baş verdi');
    }
    setIsUploading(false);
  };

  const handleEdit = (p: any) => {
    setName(p.name);
    setCategory(p.category);
    setDescription(p.description || '');
    setPrice(p.price || '');
    setImageUrl(p.image_url || '');
    setEditingId(p.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return alert('Ad və Kateqoriya mütləqdir!');
    
    const payload = {
      name, category, description, price: price === '' ? null : price, image_url: imageUrl
    };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
      alert('Yeniləndi!');
    } else {
      await supabase.from('products').insert([payload]);
      alert('Əlavə edildi!');
    }
    
    setIsAdding(false);
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const resetForm = () => {
    setName(''); setCategory(''); setDescription(''); setPrice(''); setImageUrl(''); setEditingId(null);
  };

  // Extract unique categories for a datalist
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Onlayn Mağaza</h2>
          <p className="text-gray-400 text-sm">Məhsulları və kateqoriyaları buradan idarə edin.</p>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); resetForm(); }} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Məhsul</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məhsulun Adı</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Kateqoriya (Məs: Forma, Şarf, Fincan)</label>
              <input type="text" list="category-list" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required />
              <datalist id="category-list">
                {categories.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qiymət (AZN)</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məhsul Şəkli</label>
              <div className="flex items-center space-x-2">
                {imageUrl && <img src={imageUrl} alt="Preview" className="w-10 h-10 object-cover bg-[#0d1a2d] rounded border border-gray-700" />}
                <label className={`flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 cursor-pointer flex items-center justify-center space-x-2 hover:border-[#d7bf7b] ${isUploading ? 'opacity-50' : ''}`}>
                  <UploadCloud className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-xs uppercase">{isUploading ? 'Yüklənir...' : 'Cihazdan Seç'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məzmun (Haqqında)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white h-24" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase hover:bg-white transition-colors">Yadda Saxla</button>
        </form>
      )}

      {loading ? (
        <div className="text-[#d7bf7b] text-center">Yüklənir...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-[#152741] border border-gray-800 rounded-xl overflow-hidden flex flex-col justify-between">
              <div className="h-48 bg-[#0d1a2d] relative flex items-center justify-center p-4">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-600 text-xs uppercase font-bold tracking-widest">Şəkil yoxdur</span>
                )}
                <div className="absolute top-2 right-2 bg-[#d7bf7b] text-[#152741] text-[10px] font-black px-2 py-1 rounded uppercase">
                  {p.category}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-white font-bold mb-1 truncate">{p.name}</h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2 flex-1">{p.description}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
                  <span className="text-[#d7bf7b] font-black text-lg">{p.price ? `${p.price} ₼` : 'Q/Y'}</span>
                  <div className="flex space-x-3">
                    <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300 uppercase text-[10px] font-bold">Düzəliş</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-400 uppercase text-[10px] font-bold"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="col-span-full text-center text-gray-500 py-10">Məhsul yoxdur.</div>}
        </div>
      )}
    </div>
  );
}
