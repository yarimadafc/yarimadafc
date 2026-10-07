'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, Edit2, X } from 'lucide-react';
import { compressImage } from '@/lib/imageCompress';

export default function ShopAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('994554477467');
  
  // Arrays
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  
  // Temp inputs for arrays
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      if (images.length >= 5) {
        alert("Maksimum 5 şəkil əlavə edə bilərsiniz!");
        return;
      }
      setUploading(true);
      const file = e.target.files[0];
      const base64 = await compressImage(file);
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });
      const data = await res.json();
      if (data.url) {
        setImages([...images, data.url]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const addColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()]);
      setColorInput('');
    }
  };
  
  const removeColor = (col: string) => setColors(colors.filter(c => c !== col));

  const addSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim().toUpperCase())) {
      setSizes([...sizes, sizeInput.trim().toUpperCase()]);
      setSizeInput('');
    }
  };

  const removeSize = (sz: string) => setSizes(sizes.filter(s => s !== sz));

  const handleEdit = (p: any) => {
    setTitle(p.title);
    setPrice(p.price.toString());
    setDescription(p.description || '');
    setWhatsapp(p.whatsapp_number || '994554477467');
    setImages(p.images || []);
    setColors(p.colors || []);
    setSizes(p.sizes || []);
    setEditingId(p.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Ən azı 1 şəkil əlavə edilməlidir!');
      return;
    }

    const payload = {
      title,
      price: parseFloat(price),
      description,
      whatsapp_number: whatsapp,
      images,
      colors,
      sizes
    };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
    } else {
      await supabase.from('products').insert([payload]);
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
    setTitle(''); setPrice(''); setDescription(''); setWhatsapp('994554477467');
    setImages([]); setColors([]); setSizes([]);
    setColorInput(''); setSizeInput('');
    setEditingId(null);
  };

  if (loading) return <div className="text-[#d7bf7b] p-6 text-center font-bold">Yüklənir...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Mağaza</h2>
          <p className="text-gray-400 text-sm mt-1">Məhsulları əlavə edin və idarə edin.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAdding(!isAdding); }}
          className="bg-[#d7bf7b] text-[#141414] px-4 py-2 rounded-lg font-bold flex items-center space-x-2 uppercase text-xs"
        >
          <Plus className="w-4 h-4" /> <span>{isAdding ? 'Ləğv et' : 'Yeni Məhsul'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-[#141414] p-6 rounded-2xl border border-gray-800 mb-8 space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məhsul Adı</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qiymət (AZN)</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məzmun (Haqqında)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none"></textarea>
            </div>
            
            {/* Şəkillər */}
            <div className="md:col-span-2 bg-[#000000] p-4 rounded-xl border border-gray-800">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-4">Şəkillər (1-5 ədəd)</label>
              <div className="flex flex-wrap gap-4 items-center">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-700 group">
                    <img src={img} alt="img" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="text-red-500 w-6 h-6" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-[#d7bf7b] hover:text-[#d7bf7b] text-gray-500 transition-colors">
                    {uploading ? <span className="text-xs">Gözləyin...</span> : <><Plus className="w-6 h-6" /><span className="text-[10px] uppercase font-bold mt-1">Yüklə</span></>}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Seçimlər (Rəng, Ölçü) */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Rənglər (İstəyə bağlı)</label>
              <div className="flex space-x-2 mb-3">
                <input type="text" value={colorInput} onChange={e => setColorInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor())} placeholder="Məs: Qara" className="flex-1 bg-[#0a0a0a] border border-gray-700 rounded-lg p-2 text-white text-sm" />
                <button type="button" onClick={addColor} className="bg-gray-700 text-white px-3 rounded-lg text-sm font-bold">Əlavə et</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map(col => (
                  <span key={col} className="bg-[#000000] border border-gray-700 text-gray-300 text-xs px-2 py-1 rounded flex items-center space-x-1">
                    <span>{col}</span><button type="button" onClick={() => removeColor(col)}><X className="w-3 h-3 text-red-400" /></button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ölçülər (İstəyə bağlı)</label>
              <div className="flex space-x-2 mb-3">
                <input type="text" value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())} placeholder="Məs: XL" className="flex-1 bg-[#0a0a0a] border border-gray-700 rounded-lg p-2 text-white text-sm" />
                <button type="button" onClick={addSize} className="bg-gray-700 text-white px-3 rounded-lg text-sm font-bold">Əlavə et</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map(sz => (
                  <span key={sz} className="bg-[#000000] border border-gray-700 text-gray-300 text-xs px-2 py-1 rounded flex items-center space-x-1">
                    <span>{sz}</span><button type="button" onClick={() => removeSize(sz)}><X className="w-3 h-3 text-red-400" /></button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Sifariş üçün WhatsApp (Nömrə)</label>
              <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
            </div>

          </div>
          <div className="flex justify-end pt-4 border-t border-gray-800">
            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-bold uppercase text-xs tracking-widest transition-colors">
              Məhsulu Yadda Saxla
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-[#000000] rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
            <div className="h-48 relative bg-[#141414]">
              {p.images && p.images.length > 0 ? (
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">ŞƏKİL YOXDUR</div>
              )}
              <div className="absolute top-2 right-2 bg-black/60 text-[#d7bf7b] text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                {p.price} AZN
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-white font-bold text-sm mb-1 line-clamp-1 uppercase tracking-widest">{p.title}</h3>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">{p.description}</p>
              
              <div className="mt-auto space-y-2">
                <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                  {p.colors && p.colors.length > 0 && <span className="text-[10px] text-gray-400 bg-[#141414] px-2 py-1 rounded border border-gray-700 whitespace-nowrap">Rəng: {p.colors.length}</span>}
                  {p.sizes && p.sizes.length > 0 && <span className="text-[10px] text-gray-400 bg-[#141414] px-2 py-1 rounded border border-gray-700 whitespace-nowrap">Ölçü: {p.sizes.length}</span>}
                </div>
                
                <div className="flex space-x-2 pt-2 border-t border-gray-800">
                  <button onClick={() => handleEdit(p)} className="flex-1 p-2 bg-blue-600/20 text-blue-400 rounded-lg flex justify-center hover:bg-blue-600/30 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 p-2 bg-red-600/20 text-red-400 rounded-lg flex justify-center hover:bg-red-600/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
