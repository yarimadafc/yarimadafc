#!/bin/bash

# sponsorlar/yeni
cat << 'PAGE_EOF' > src/app/adminpanel/sponsorlar/yeni/page.tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function YeniSponsor() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', logo_url: '', type: 'partner' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('sponsors').insert([formData]);
    setLoading(false);
    router.push('/adminpanel/sponsorlar');
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Yeni Sponsor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Sponsor Adı</label>
          <input required type="text" className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Loqo URL</label>
          <input type="text" className="w-full p-2 border rounded" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Növ</label>
          <select className="w-full p-2 border rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
            <option value="principal">Əsas (Principal)</option>
            <option value="official">Rəsmi (Official)</option>
            <option value="partner">Tərəfdaş (Partner)</option>
          </select>
        </div>
        <button disabled={loading} type="submit" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded font-bold w-full">Yadda Saxla</button>
      </form>
    </div>
  );
}
PAGE_EOF

# turnir/yeni
cat << 'PAGE_EOF' > src/app/adminpanel/turnir/yeni/page.tsx
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
PAGE_EOF

# mesqciler/yeni
cat << 'PAGE_EOF' > src/app/adminpanel/mesqciler/yeni/page.tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function YeniMesqci() {
  const router = useRouter();
  const [formData, setFormData] = useState({ first_name: '', last_name: '', role: '', license: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('coaches').insert([formData]);
    setLoading(false);
    router.push('/adminpanel/mesqciler');
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Yeni Məşqçi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Ad</label>
          <input required type="text" className="w-full p-2 border rounded" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Soyad</label>
          <input required type="text" className="w-full p-2 border rounded" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Vəzifə</label>
          <input required type="text" className="w-full p-2 border rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Lisenziya</label>
          <input type="text" className="w-full p-2 border rounded" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} />
        </div>
        <button disabled={loading} type="submit" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded font-bold w-full">Yadda Saxla</button>
      </form>
    </div>
  );
}
PAGE_EOF

# oyunlar/yeni
cat << 'PAGE_EOF' > src/app/adminpanel/oyunlar/yeni/page.tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function YeniOyun() {
  const router = useRouter();
  const [formData, setFormData] = useState({ home_team: '', away_team: '', date: '', time: '', status: 'upcoming', home_score: 0, away_score: 0 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('matches').insert([formData]);
    setLoading(false);
    router.push('/adminpanel/oyunlar');
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Yeni Oyun</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Ev Sahibi</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.home_team} onChange={e => setFormData({...formData, home_team: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Qonaq</label>
            <input required type="text" className="w-full p-2 border rounded" value={formData.away_team} onChange={e => setFormData({...formData, away_team: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Ev Hesab</label>
            <input type="number" className="w-full p-2 border rounded" value={formData.home_score} onChange={e => setFormData({...formData, home_score: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Qonaq Hesab</label>
            <input type="number" className="w-full p-2 border rounded" value={formData.away_score} onChange={e => setFormData({...formData, away_score: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Tarix</label>
            <input type="date" className="w-full p-2 border rounded" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Saat</label>
            <input type="time" className="w-full p-2 border rounded" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold mb-1">Status</label>
            <select className="w-full p-2 border rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="upcoming">Gələcək</option>
              <option value="completed">Tamamlanıb</option>
            </select>
          </div>
        </div>
        <button disabled={loading} type="submit" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded font-bold w-full">Yadda Saxla</button>
      </form>
    </div>
  );
}
PAGE_EOF

