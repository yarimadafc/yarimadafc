
'use client';
import { compressImage } from '@/lib/imageCompress';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, UploadCloud } from 'lucide-react';

export default function SponsorsAdmin() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    setLoading(true);
    const { data } = await supabase.from('sponsors').select('*').order('created_at', { ascending: false });
    if (data) setSponsors(data);
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
      if (uploadData.url) setLogoUrl(uploadData.url);
      else alert('Şəkil yüklənərkən xəta oldu');
      setIsUploading(false);
    } catch (err) {
      console.error(err);
      alert('Şəkil yüklənərkən xəta baş verdi');
      setIsUploading(false);
    }
  };

  const handleEdit = (s: any) => {
    setName(s.name);
    setLogoUrl(s.logo_url);
    setEditingId(s.id);
    setIsAdding(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !logoUrl) return alert('Bütün xanaları doldurun');
    
    let error;
    if (editingId) {
      const res = await supabase.from('sponsors').update({ name, logo_url: logoUrl }).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('sponsors').insert([{ name, logo_url: logoUrl }]);
      error = res.error;
    }
    if (error) alert('Xəta: ' + error.message);
    else {
      alert(editingId ? 'Sponsor yeniləndi!' : 'Sponsor əlavə edildi!');
      setIsAdding(false);
      setName(''); setLogoUrl(''); setEditingId(null);
      fetchSponsors();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('sponsors').delete().eq('id', id);
      fetchSponsors();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Sponsorlar</h2>
          <p className="text-gray-400 text-sm">Aşağıdakı qaçan bannerdə görünəcək sponsor logoları.</p>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); setName(''); setLogoUrl(''); }} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Sponsor</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Sponsorun Adı</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Sponsor Loqosu (Şəffaf PNG tövsiyə olunur)</label>
            <div className="flex items-center space-x-4">
              <label className="bg-[#0d1a2d] border border-gray-700 hover:border-[#d7bf7b] text-gray-300 px-4 py-3 rounded-lg cursor-pointer flex items-center space-x-2 transition-colors">
                <UploadCloud className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{isUploading ? 'Yüklənir...' : 'Loqo Seç'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {logoUrl && <img src={logoUrl} alt="Preview" className="h-12 object-contain bg-white rounded p-1" />}
            </div>
          </div>
          <button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase hover:bg-white transition-colors">Yadda Saxla</button>
        </form>
      )}

      {loading ? (
        <div className="text-[#d7bf7b] text-center">Yüklənir...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {sponsors.map(s => (
            <div key={s.id} className="bg-[#152741] border border-gray-800 p-4 rounded-xl text-center flex flex-col justify-between items-center">
              <img src={s.logo_url} alt={s.name} className="h-16 w-full object-contain mb-4 bg-white rounded p-2" />
              <div className="text-white text-xs font-bold uppercase truncate w-full mb-3">{s.name}</div>
              <div className="flex space-x-4 w-full justify-center">
                <button onClick={() => handleEdit(s)} className="text-blue-400 text-xs font-bold uppercase flex items-center justify-center hover:text-blue-300">
                  Düzəliş
                </button>
                <button onClick={() => handleDelete(s.id)} className="text-red-500 text-xs font-bold uppercase flex items-center justify-center space-x-1 hover:text-red-400">
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
