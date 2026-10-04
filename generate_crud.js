const fs = require('fs');
const path = require('path');

const sections = [
  {
    folder: 'komandalar',
    table: 'teams',
    title: 'Komanda',
    fields: [
      { name: 'name', type: 'text', label: 'Komandanın Adı', translatable: true },
      { name: 'age_group', type: 'text', label: 'Yaş Qrupu' },
      { name: 'description', type: 'textarea', label: 'Açıqlama', translatable: true },
      { name: 'photo_url', type: 'image', label: 'Şəkil (Photo URL)' }
    ],
    listCols: ['name', 'age_group']
  },
  {
    folder: 'mesqciler',
    table: 'coaches',
    title: 'Məşqçi',
    fields: [
      { name: 'first_name', type: 'text', label: 'Ad' },
      { name: 'last_name', type: 'text', label: 'Soyad' },
      { name: 'role', type: 'text', label: 'Vəzifə (Məs: Baş Məşqçi)', translatable: true },
      { name: 'license', type: 'text', label: 'Lisenziya' },
      { name: 'bio', type: 'textarea', label: 'Bioqrafiya', translatable: true },
      { name: 'photo_url', type: 'image', label: 'Şəkil URL' }
    ],
    listCols: ['first_name', 'last_name', 'role']
  },
  {
    folder: 'futbolcular',
    table: 'players',
    title: 'Futbolçu',
    fields: [
      { name: 'first_name', type: 'text', label: 'Ad' },
      { name: 'last_name', type: 'text', label: 'Soyad' },
      { name: 'position', type: 'text', label: 'Mövqe', translatable: true },
      { name: 'jersey_number', type: 'number', label: 'Nömrə' },
      { name: 'bio', type: 'textarea', label: 'Bioqrafiya', translatable: true },
      { name: 'photo_url', type: 'image', label: 'Şəkil URL' }
    ],
    listCols: ['first_name', 'last_name', 'position']
  },
  {
    folder: 'turnir',
    table: 'tournaments',
    title: 'Turnir',
    fields: [
      { name: 'name', type: 'text', label: 'Turnirin Adı', translatable: true },
      { name: 'season', type: 'text', label: 'Mövsüm' },
      { name: 'age_group', type: 'text', label: 'Yaş Qrupu' }
    ],
    listCols: ['name', 'season']
  },
  {
    folder: 'oyunlar',
    table: 'matches',
    title: 'Oyun',
    fields: [
      { name: 'home_team', type: 'text', label: 'Ev Sahibi (Məs: Yarımada U-12)' },
      { name: 'away_team', type: 'text', label: 'Qonaq' },
      { name: 'date', type: 'text', label: 'Tarix (YYYY-MM-DD)' },
      { name: 'time', type: 'text', label: 'Saat (HH:MM)' },
      { name: 'home_score', type: 'number', label: 'Ev Sahibi Qolu' },
      { name: 'away_score', type: 'number', label: 'Qonaq Qolu' },
      { name: 'stadium', type: 'text', label: 'Stadion', translatable: true },
      { name: 'status', type: 'text', label: 'Status (upcoming, live, completed)' },
      { name: 'report', type: 'textarea', label: 'Oyun Hesabatı', translatable: true }
    ],
    listCols: ['home_team', 'away_team', 'date', 'status']
  },
  {
    folder: 'sponsorlar',
    table: 'sponsors',
    title: 'Sponsor',
    fields: [
      { name: 'name', type: 'text', label: 'Sponsorun Adı' },
      { name: 'description', type: 'textarea', label: 'Haqqında', translatable: true },
      { name: 'type', type: 'text', label: 'Tip (principal, official, partner)' },
      { name: 'logo_url', type: 'image', label: 'Loqo' },
      { name: 'website_url', type: 'text', label: 'Vebsayt Linki' }
    ],
    listCols: ['name', 'type']
  },
  {
    folder: 'bannerler',
    table: 'hero_banners',
    title: 'Banner',
    fields: [
      { name: 'title', type: 'text', label: 'Başlıq', translatable: true },
      { name: 'subtitle', type: 'textarea', label: 'Alt Mətn', translatable: true },
      { name: 'button_text', type: 'text', label: 'Düymə Yazısı', translatable: true },
      { name: 'button_link', type: 'text', label: 'Düymə Linki' },
      { name: 'image_url', type: 'image', label: 'Şəkil URL' },
      { name: 'active', type: 'checkbox', label: 'Aktivdir?' }
    ],
    listCols: ['title', 'active']
  }
];

// Helper to generate fields
const generateFieldsInit = (fields) => {
  let res = {};
  fields.forEach(f => {
    if (f.type === 'checkbox') res[f.name] = true;
    else if (f.type === 'number') res[f.name] = 0;
    else res[f.name] = '';
    
    if (f.translatable) {
      res[`${f.name}_az`] = '';
      res[`${f.name}_en`] = '';
      res[`${f.name}_ru`] = '';
    }
  });
  return res;
};

const generateInputs = (fields) => {
  return fields.map(f => {
    if (f.translatable) {
      const type = f.type === 'textarea' ? 'textarea' : 'input';
      const props = f.type === 'textarea' ? 'rows={3}' : 'type="text"';
      return `
        <div className="p-4 bg-gray-50 rounded border mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">${f.label}</label>
          <div className="space-y-3">
            <div><span className="text-xs font-bold text-gray-500">AZ</span><${type} ${props} value={formData.${f.name}_az || ''} onChange={e => setFormData({...formData, ${f.name}_az: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">EN (Avto-tərcümə olunacaq)</span><${type} ${props} value={formData.${f.name}_en || ''} onChange={e => setFormData({...formData, ${f.name}_en: e.target.value})} className="w-full border rounded p-2" /></div>
            <div><span className="text-xs font-bold text-gray-500">RU (Avto-tərcümə olunacaq)</span><${type} ${props} value={formData.${f.name}_ru || ''} onChange={e => setFormData({...formData, ${f.name}_ru: e.target.value})} className="w-full border rounded p-2" /></div>
          </div>
        </div>
      `;
    }
    if (f.type === 'image') {
      return `
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">${f.label}</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, '${f.name}')} className="w-full border rounded p-1.5" />
          {formData.${f.name} && <img src={formData.${f.name}} alt="Preview" className="h-24 mt-2 rounded object-cover" />}
        </div>
      `;
    }
    if (f.type === 'checkbox') {
      return `
        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" checked={formData.${f.name}} onChange={e => setFormData({...formData, ${f.name}: e.target.checked})} className="w-5 h-5" />
          <label className="text-sm font-bold text-gray-700">${f.label}</label>
        </div>
      `;
    }
    const typeProp = f.type === 'number' ? 'type="number"' : f.type === 'textarea' ? 'rows={3}' : 'type="text"';
    const tag = f.type === 'textarea' ? 'textarea' : 'input';
    return `
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">${f.label}</label>
          <${tag} ${typeProp} value={formData.${f.name} || ''} onChange={e => setFormData({...formData, ${f.name}: e.target.value})} className="w-full border rounded p-2" />
        </div>
    `;
  }).join('');
};

sections.forEach(sec => {
  const dir = path.join('src/app/[locale]/adminpanel', sec.folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(path.join(dir, 'yeni'))) fs.mkdirSync(path.join(dir, 'yeni'), { recursive: true });
  if (!fs.existsSync(path.join(dir, '[id]'))) fs.mkdirSync(path.join(dir, '[id]'), { recursive: true });

  const translatableFields = sec.fields.filter(f => f.translatable).map(f => `'${f.name}'`).join(', ');
  
  // page.tsx (List)
  const listCode = `'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('${sec.table}').select('*').order('created_at', { ascending: false });
    setData(data || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('${sec.table}').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">${sec.title}lər</h1>
        <Link href="/adminpanel/${sec.folder}/yeni" className="bg-[var(--ks-kinpaku)] text-white px-4 py-2 rounded">Yeni Əlavə Et</Link>
      </div>
      {loading ? <p>Yüklənir...</p> : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              ${sec.listCols.map(c => `<th className="p-4 text-left capitalize">${c}</th>`).join('')}
              <th className="p-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b">
                ${sec.listCols.map(c => `<td className="p-4">{item.${c}}</td>`).join('')}
                <td className="p-4 text-right space-x-4">
                  <Link href={\`/adminpanel/${sec.folder}/\${item.id}\`} className="text-blue-500 hover:underline">Redaktə</Link>
                  <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:underline">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}`;

  // yeni/page.tsx (Create)
  const createCode = `'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { autoTranslateFields } from '@/lib/autoTranslate';

export default function AdminCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(${JSON.stringify(generateFieldsInit(sec.fields))});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64 }) });
        const data = await res.json();
        if (data.url) setFormData({ ...formData, [field]: data.url });
      } catch (err) { alert('Şəkil yüklənərkən xəta'); }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { updatedData } = await autoTranslateFields(formData, [${translatableFields}]);
      const { error } = await supabase.from('${sec.table}').insert([updatedData]);
      if (error) throw error;
      router.push('/adminpanel/${sec.folder}');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Yeni ${sec.title}</h2>
      <form onSubmit={handleSubmit}>
        ${generateInputs(sec.fields)}
        <button disabled={loading} type="submit" className="mt-6 bg-[#0a1628] text-white px-8 py-3 rounded font-medium hover:bg-[#112240] transition disabled:opacity-50">
          {loading ? 'Yadda saxlanılır (Tərcümə edilir)...' : 'Yadda Saxla'}
        </button>
      </form>
    </div>
  );
}`;

  // [id]/page.tsx (Edit)
  const editCode = `'use client';
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { autoTranslateFields } from '@/lib/autoTranslate';

export default function AdminEdit({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(${JSON.stringify(generateFieldsInit(sec.fields))});

  useEffect(() => {
    supabase.from('${sec.table}').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setFormData(data);
    });
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64 }) });
        const data = await res.json();
        if (data.url) setFormData({ ...formData, [field]: data.url });
      } catch (err) { alert('Şəkil yüklənərkən xəta'); }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { updatedData } = await autoTranslateFields(formData, [${translatableFields}]);
      const { error } = await supabase.from('${sec.table}').update(updatedData).eq('id', id);
      if (error) throw error;
      router.push('/adminpanel/${sec.folder}');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">${sec.title} Redaktə</h2>
      <form onSubmit={handleSubmit}>
        ${generateInputs(sec.fields)}
        <button disabled={loading} type="submit" className="mt-6 bg-[#0a1628] text-white px-8 py-3 rounded font-medium hover:bg-[#112240] transition disabled:opacity-50">
          {loading ? 'Yadda saxlanılır (Tərcümə edilir)...' : 'Dəyişiklikləri Yadda Saxla'}
        </button>
      </form>
    </div>
  );
}`;

  fs.writeFileSync(path.join(dir, 'page.tsx'), listCode);
  fs.writeFileSync(path.join(dir, 'yeni/page.tsx'), createCode);
  fs.writeFileSync(path.join(dir, '[id]/page.tsx'), editCode);
});

console.log('CRUD generation complete.');
