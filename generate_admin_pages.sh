#!/bin/bash
mkdir -p src/app/adminpanel/mesqciler src/app/adminpanel/oyunlar src/app/adminpanel/turnir src/app/adminpanel/media src/app/adminpanel/sponsorlar src/app/adminpanel/bannerler src/app/adminpanel/parametrler

# 1. mesqciler
cat << 'PAGE_EOF' > src/app/adminpanel/mesqciler/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Coach } from '@/lib/types';
import Link from 'next/link';

export default function AdminCoaches() {
  const [data, setData] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('coaches').select('*').order('created_at', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('coaches').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Məşqçilər</h1>
        <Link href="/adminpanel/mesqciler/yeni" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded">Yeni Məşqçi</Link>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Ad, Soyad</th>
              <th className="p-4 text-left">Vəzifə</th>
              <th className="p-4 text-left">Lisenziya</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4">{item.first_name} {item.last_name}</td>
                <td className="p-4">{item.role}</td>
                <td className="p-4">{item.license}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => deleteItem(item.id)} className="text-red-500">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
PAGE_EOF

# 2. oyunlar
cat << 'PAGE_EOF' > src/app/adminpanel/oyunlar/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Match } from '@/lib/types';
import Link from 'next/link';

export default function AdminMatches() {
  const [data, setData] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('matches').select('*').order('date', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('matches').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Oyunlar</h1>
        <Link href="/adminpanel/oyunlar/yeni" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded">Yeni Oyun</Link>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Tarix</th>
              <th className="p-4 text-left">Komandalar</th>
              <th className="p-4 text-left">Hesab</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4">{item.date} {item.time}</td>
                <td className="p-4">{item.home_team} vs {item.away_team}</td>
                <td className="p-4">{item.home_score ?? '-'} : {item.away_score ?? '-'}</td>
                <td className="p-4">{item.status}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => deleteItem(item.id)} className="text-red-500">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
PAGE_EOF

# 3. turnir
cat << 'PAGE_EOF' > src/app/adminpanel/turnir/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Standing } from '@/lib/types';
import Link from 'next/link';

export default function AdminStandings() {
  const [data, setData] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('standings').select('*').order('points', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('standings').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Turnir Cədvəli (Komandalar)</h1>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Komanda</th>
              <th className="p-4 text-left">Oyun</th>
              <th className="p-4 text-left">Q / H / M</th>
              <th className="p-4 text-left">Toplar</th>
              <th className="p-4 text-left">Xal</th>
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4 font-bold">{item.team_name}</td>
                <td className="p-4">{item.played}</td>
                <td className="p-4">{item.won} / {item.drawn} / {item.lost}</td>
                <td className="p-4">{item.goals_for} - {item.goals_against}</td>
                <td className="p-4 font-bold text-[var(--ks-kinpaku)]">{item.points}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => deleteItem(item.id)} className="text-red-500">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
PAGE_EOF

# 4. media
cat << 'PAGE_EOF' > src/app/adminpanel/media/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MediaVideo } from '@/lib/types';

export default function AdminMedia() {
  const [data, setData] = useState<MediaVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('media_videos').select('*').order('created_at', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('media_videos').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media (Videolar)</h1>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-4 truncate">{item.youtube_url}</p>
              <button onClick={() => deleteItem(item.id)} className="text-red-500 text-sm font-bold">Sil</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
PAGE_EOF

# 5. sponsorlar
cat << 'PAGE_EOF' > src/app/adminpanel/sponsorlar/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sponsor } from '@/lib/types';

export default function AdminSponsors() {
  const [data, setData] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('sponsors').select('*').order('created_at', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('sponsors').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sponsorlar</h1>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 text-center">
              {item.logo_url && <img src={item.logo_url} alt="Logo" className="h-16 object-contain mx-auto mb-4" />}
              <h3 className="font-bold text-lg mb-1">{item.name}</h3>
              <p className="text-gray-500 text-sm mb-4 uppercase">{item.type}</p>
              <button onClick={() => deleteItem(item.id)} className="text-red-500 text-sm font-bold">Sil</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
PAGE_EOF

# 6. bannerler
cat << 'PAGE_EOF' > src/app/adminpanel/bannerler/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HeroBanner } from '@/lib/types';

export default function AdminBanners() {
  const [data, setData] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('hero_banners').select('*').order('sort_order', { ascending: true });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('hero_banners').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ana Səhifə Bannerləri</h1>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow overflow-hidden relative">
              {item.image_url && <img src={item.image_url} alt="Banner" className="w-full h-48 object-cover" />}
              <div className="p-4">
                <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.subtitle}</p>
                <div className="flex justify-between">
                  <span className={`px-2 py-1 text-xs rounded font-bold ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.active ? 'Aktiv' : 'Passiv'}
                  </span>
                  <button onClick={() => deleteItem(item.id)} className="text-red-500 text-sm font-bold">Sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
PAGE_EOF

# 7. parametrler
cat << 'PAGE_EOF' > src/app/adminpanel/parametrler/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ContactInfo } from '@/lib/types';

export default function AdminSettings() {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_info').select('*').single();
    setData(data || null);
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sistem Parametrləri & Əlaqə Məlumatları</h1>
      {loading ? <p>Yüklənir...</p> : (
        <div className="bg-white shadow rounded-lg p-6 max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Ünvan</label>
            <input type="text" value={data?.address || ''} readOnly className="w-full p-2 border rounded bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Telefon</label>
            <input type="text" value={data?.phone || ''} readOnly className="w-full p-2 border rounded bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp</label>
            <input type="text" value={data?.whatsapp || ''} readOnly className="w-full p-2 border rounded bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-poçt</label>
            <input type="text" value={data?.email || ''} readOnly className="w-full p-2 border rounded bg-gray-50" />
          </div>
          <p className="text-sm text-gray-500 pt-4">Qeyd: Bu məlumatları birbaşa verilənlər bazasından (Supabase) dəyişə bilərsiniz.</p>
        </div>
      )}
    </div>
  );
}
PAGE_EOF

