'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminPlayerCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', number: '', position: 'Hücumçu',
    birth_date: '', height: '', weight: '', photo_url: '', team_id: ''
  });

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase.from('teams').select('id, name');
      if (data) {
        setTeams(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, team_id: data[0].id }));
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.from('players').insert([{
        ...formData,
        number: formData.number ? parseInt(formData.number) : null
      }]);
      if (error) throw error;
      router.push('/adminpanel/futbolcular');
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Yeni Futbolçu</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
            <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
            <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Komanda</label>
            <select required value={formData.team_id} onChange={e => setFormData({...formData, team_id: e.target.value})} className="w-full border rounded p-2">
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mövqe</label>
            <select required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full border rounded p-2">
              <option value="Qapıçı">Qapıçı</option>
              <option value="Müdafiəçi">Müdafiəçi</option>
              <option value="Yarımmüdafiəçi">Yarımmüdafiəçi</option>
              <option value="Hücumçu">Hücumçu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nömrə</label>
            <input type="number" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Təvəllüd</label>
            <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full border rounded p-2" />
          </div>
        </div>

        <button disabled={loading} type="submit" className="bg-[#0a1628] text-white px-6 py-2 rounded font-medium hover:bg-[#112240] transition disabled:opacity-50">
          {loading ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
        </button>
      </form>
    </div>
  );
}
