'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus } from 'lucide-react';

export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [title, setTitle] = useState('');
  const [count, setCount] = useState('');
  const [orderNum, setOrderNum] = useState(0);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    const { data } = await supabase.from('achievements').select('*').order('order_num', { ascending: true });
    if (data) setAchievements(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !count) return alert('Bütün xanaları doldurun');
    
    const { error } = await supabase.from('achievements').insert([{ title, count, order_num: orderNum }]);
    
    if (error) alert('Xəta: ' + error.message);
    else {
      alert('Nailiyyət əlavə edildi!');
      setIsAdding(false);
      setTitle(''); setCount(''); setOrderNum(0);
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
        <button onClick={() => setIsAdding(!isAdding)} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Əlavə Et</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Rəqəm (Məs: 15+)</label>
              <input type="text" value={count} onChange={e => setCount(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Başlıq (Məs: Kubok)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Sıra Nömrəsi</label>
            <input type="number" value={orderNum} onChange={e => setOrderNum(Number(e.target.value))} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none" required />
          </div>
          <button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase hover:bg-white transition-colors">Yadda Saxla</button>
        </form>
      )}

      {loading ? (
        <div className="text-[#d7bf7b] text-center">Yüklənir...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map(a => (
            <div key={a.id} className="bg-[#0a1423] border border-gray-800 p-6 rounded-xl text-center flex flex-col justify-between">
              <div>
                <div className="text-4xl font-black text-[#d7bf7b] mb-2">{a.count}</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">{a.title}</div>
              </div>
              <button onClick={() => handleDelete(a.id)} className="mt-4 text-red-500 text-xs font-bold uppercase flex items-center justify-center space-x-1 hover:text-red-400">
                <Trash2 className="w-3 h-3" /> <span>Sil</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
