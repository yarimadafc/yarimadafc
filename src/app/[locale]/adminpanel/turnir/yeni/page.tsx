'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function YeniTurnir() {
  const router = useRouter();
  const [formData, setFormData] = useState({ team_name: '', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, points: 0, tournament_id: 'default' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('standings').insert([formData]);
    setLoading(false);
    router.push('/adminpanel/turnir');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Cədvələ Komanda Əlavə Et</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Komanda Adı</label>
          <input required type="text" name="team_name" className="w-full p-2 border rounded" value={formData.team_name} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-bold mb-1">Oyun</label><input type="number" name="played" className="w-full p-2 border rounded" value={formData.played} onChange={handleChange} /></div>
          <div><label className="block text-sm font-bold mb-1">Qələbə</label><input type="number" name="won" className="w-full p-2 border rounded" value={formData.won} onChange={handleChange} /></div>
          <div><label className="block text-sm font-bold mb-1">Heç-heçə</label><input type="number" name="drawn" className="w-full p-2 border rounded" value={formData.drawn} onChange={handleChange} /></div>
          <div><label className="block text-sm font-bold mb-1">Məğlubiyyət</label><input type="number" name="lost" className="w-full p-2 border rounded" value={formData.lost} onChange={handleChange} /></div>
          <div><label className="block text-sm font-bold mb-1">Vurduğu Top</label><input type="number" name="goals_for" className="w-full p-2 border rounded" value={formData.goals_for} onChange={handleChange} /></div>
          <div><label className="block text-sm font-bold mb-1">Buraxdığı Top</label><input type="number" name="goals_against" className="w-full p-2 border rounded" value={formData.goals_against} onChange={handleChange} /></div>
          <div className="col-span-2"><label className="block text-sm font-bold mb-1">Xal</label><input type="number" name="points" className="w-full p-2 border rounded" value={formData.points} onChange={handleChange} /></div>
        </div>
        <button disabled={loading} type="submit" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded font-bold w-full">Yadda Saxla</button>
      </form>
    </div>
  );
}
