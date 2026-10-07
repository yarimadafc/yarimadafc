'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, UploadCloud, Star } from 'lucide-react';
import { compressImage } from '@/lib/imageCompress';

export default function CoachesAdmin() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);


  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [license, setLicense] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [teamId, setTeamId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: cData } = await supabase.from('coaches').select('*, teams(name)').order('created_at', { ascending: false });
    if (cData) setCoaches(cData);
    
    const { data: tData } = await supabase.from('teams').select('id, name');
    if (tData) setTeams(tData);
    
    const { data: lsData } = await supabase.from('site_images').select('image_url').eq('section_key', 'leadership_coach_ids').maybeSingle();
    if (lsData && lsData.image_url) {
    } else {
    }
    
    setLoading(false);
  };

  const handleEdit = (c: any) => {
    setName(c.name);
    setRole(c.role || '');
    setLicense(c.license || '');
    setImageUrl(c.image_url || '');
    setTeamId(c.team_id || '');
    setEditingId(c.id);
    setIsAdding(true);
    
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      role,
      license,
      image_url: imageUrl,
      team_id: teamId || null
    };

    let newId = editingId;

    if (editingId) {
      await supabase.from('coaches').update(payload).eq('id', editingId);
      alert('Yeniləndi!');
    } else {
      const { data: insertedData } = await supabase.from('coaches').insert([payload]).select();
      if (insertedData && insertedData.length > 0) newId = insertedData[0].id;
      alert('Əlavə edildi!');
    }



    setEditingId(null);
    setIsAdding(false);
    resetForm();
    fetchData();
  };

  const handleAddToLeadership = async (coach: any) => {
    if (!confirm(`${coach.name} adlı şəxsi "Klub Rəhbərliyi" bölməsinə əlavə etmək istədiyinizə əminsiniz?`)) return;
    
    // Check if already in leadership
    const { data: existing } = await supabase.from('leadership').select('id').eq('name', coach.name).maybeSingle();
    if (existing) {
      alert('Bu şəxs artıq Klub Rəhbərliyində mövcuddur!');
      return;
    }

    const { error } = await supabase.from('leadership').insert([{
      name: coach.name,
      position: coach.role || 'Məşqçi',
      image_url: coach.image_url,
      bio: coach.bio || '',
      order_num: 0
    }]);

    if (error) alert('Xəta: ' + error.message);
    else alert(`${coach.name} uğurla Klub Rəhbərliyinə əlavə edildi!`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('coaches').delete().eq('id', id);
      fetchData();
    }
  };

  const resetForm = () => {
    setName(''); setRole(''); setBio(''); setLicense(''); setImageUrl(''); setTeamId(''); 
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Məşqçilər İdarəetməsi</h2>
          <p className="text-gray-400 text-sm">Akademiya və komanda məşqçilərini idarə edin.</p>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); resetForm(); }} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Məşqçi</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ad Soyad</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required /></div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Vəzifə</label><input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Məs: Baş Məşqçi" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required /></div>
          <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Lisenziya</label><input type="text" value={license} onChange={e => setLicense(e.target.value)} placeholder="Məs: UEFA B" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Aid Olduğu Komanda</label>
            <select value={teamId} onChange={e => setTeamId(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white">
              <option value="">Heç biri / Ümumi</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məşqçinin Şəkli (3:4 formatı tövsiyə olunur)</label>
            {imageUrl ? (
              <div className="relative w-32 h-40 bg-[#0d1a2d] border border-gray-700 rounded-lg overflow-hidden group">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImageUrl('')} className="absolute inset-0 bg-red-500/80 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">SIL</button>
              </div>
            ) : (
              <label className={`w-full flex items-center justify-center space-x-2 bg-[#0d1a2d] border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-[#d7bf7b] transition-colors ${uploadingImage ? 'opacity-50' : ''}`}>
                <UploadCloud className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-xs font-bold uppercase">{uploadingImage ? 'YÜKLƏNİR...' : 'CİHAZDAN ŞƏKİL SEÇ'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  disabled={uploadingImage}
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadingImage(true);
                      try {
                        const base64 = await compressImage(e.target.files[0]);
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ image: base64 })
                        });
                        const data = await res.json();
                        if (data.url) setImageUrl(data.url);
                        else alert('Xəta baş verdi');
                      } catch (err) {
                        alert('Xəta baş verdi');
                      }
                      setUploadingImage(false);
                    }
                  }} 
                />
              </label>
            )}
          </div>

          <div className="md:col-span-2"><button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase tracking-widest">Yadda Saxla</button></div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coaches.map(c => (
          <div key={c.id} className="bg-[#152741] rounded-2xl border border-gray-800 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#0d1a2d] border-2 border-gray-700 mb-4 overflow-hidden">
               <img src={c.image_url || '/Logo.JPG.jpeg'} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">{c.name}</h3>
            <p className="text-[#d7bf7b] text-xs font-bold uppercase">{c.role}</p>
            <p className="text-gray-400 text-[10px] uppercase font-bold mt-2">{c.teams?.name || 'Ümumi'} {c.license ? `• ${c.license}` : ''}</p>
            
            <div className="flex space-x-2 mt-6 w-full">
              <button onClick={() => handleAddToLeadership(c)} className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 px-3 rounded-lg flex items-center justify-center transition-colors" title="Klub Rəhbərliyinə Əlavə Et">
                <Star className="w-4 h-4" />
              </button>
              <button onClick={() => handleEdit(c)} className="flex-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 py-2 rounded-lg text-xs font-bold uppercase transition-colors">Düzəliş</button>
              <button onClick={() => handleDelete(c.id)} className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded-lg text-xs font-bold uppercase transition-colors">Sil</button>
            </div>
          </div>
        ))}
        {coaches.length === 0 && <div className="col-span-full text-gray-500 text-center py-6">Heç bir məşqçi tapılmadı.</div>}
      </div>
    </div>
  );
}
