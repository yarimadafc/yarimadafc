'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/imageCompress';
import { Trash2, Plus, Edit2, PlayCircle } from 'lucide-react';

export default function CoachCoursesAdmin() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await supabase.from('coach_courses').select('*').order('created_at', { ascending: false });
    if (data) setCourses(data);
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

  const handleEdit = (c: any) => {
    setTitle(c.title);
    setDescription(c.description || '');
    setVideoUrl(c.video_url || '');
    setImageUrl(c.image_url || '');
    setEditingId(c.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('coach_courses').update({ title, description, video_url: videoUrl, image_url: imageUrl }).eq('id', editingId);
    } else {
      await supabase.from('coach_courses').insert([{ title, description, video_url: videoUrl, image_url: imageUrl }]);
    }
    setIsAdding(false);
    resetForm();
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await supabase.from('coach_courses').delete().eq('id', id);
      fetchCourses();
    }
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setVideoUrl(''); setImageUrl(''); setEditingId(null);
  };

  if (loading) return <div className="text-white p-6">Yüklənir...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Məşqçi Kursu (Praktiki)</h2>
        <button 
          onClick={() => { resetForm(); setIsAdding(!isAdding); }}
          className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" /> <span>{isAdding ? 'Ləğv et' : 'Yeni Dərs'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-[#0a1423] p-6 rounded-2xl border border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Başlıq</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded p-3 text-white" required />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Video URL (Məs: Youtube ID və ya Link)</label>
              <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded p-3 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məlumat</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#0d1a2d] border border-gray-700 rounded p-3 text-white"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Kapak Şəkli (Thumbnail)</label>
              <div className="flex items-center space-x-3">
                {imageUrl && <img src={imageUrl} alt="img" className="w-16 h-10 object-cover rounded" />}
                <label className="cursor-pointer bg-[#152741] border border-gray-700 px-4 py-2 rounded text-xs font-bold text-white uppercase">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(c => (
          <div key={c.id} className="bg-[#0a1423] rounded-xl border border-gray-800 overflow-hidden flex flex-col">
            <div className="relative h-40 bg-[#152741]">
              {c.image_url ? (
                <img src={c.image_url} alt={c.title} className="w-full h-full object-cover opacity-80" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500"><PlayCircle className="w-12 h-12" /></div>
              )}
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-white font-bold mb-2">{c.title}</h3>
              <p className="text-gray-400 text-xs line-clamp-2">{c.description}</p>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end space-x-2">
              <button onClick={() => handleEdit(c)} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(c.id)} className="p-2 bg-red-600/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
