'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb } from '@/lib/adminDb';
import { Save } from 'lucide-react';
import { CONTACT_DEFAULTS } from '@/lib/siteTexts';

type Field = { key: string; label: string; textarea?: boolean };
const HERO_DEFAULTS: Record<string, string> = {
  hero_title_1: 'YENİ MÖVSÜM,',
  hero_title_2: 'YENİ HƏDƏFLƏR',
  hero_subtitle: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!',
};
const GROUPS: { title: string; hint: string; fields: Field[] }[] = [
  {
    title: 'Ana Səhifə Girişi',
    hint: 'Ana səhifənin ən yuxarısındakı böyük başlıq.',
    fields: [
      { key: 'hero_title_1', label: 'Giriş Başlığı (Sətir 1)' },
      { key: 'hero_title_2', label: 'Giriş Başlığı (Sətir 2 - Vurğulu)' },
      { key: 'hero_subtitle', label: 'Giriş Alt Mətni', textarea: true },
    ],
  },
  {
    title: 'Əlaqə Məlumatları',
    hint: 'Saytın yuxarı zolağında, aşağı hissəsində (footer) və Əlaqə səhifəsində görünür.',
    fields: [
      { key: 'contact_phone', label: 'Telefon' },
      { key: 'contact_email', label: 'E-poçt' },
      { key: 'contact_address', label: 'Ünvan', textarea: true },
    ],
  },
];
const DEFAULTS: Record<string, string> = { ...HERO_DEFAULTS, ...CONTACT_DEFAULTS };

export default function TextsAdmin() {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function loadTexts() {
      setLoading(true);
      const { data } = await supabase.from('site_images').select('section_key, image_url').in('section_key', Object.keys(DEFAULTS));
      const map: Record<string, string> = { ...DEFAULTS };
      (data || []).forEach(item => { if (item.image_url) map[item.section_key] = item.image_url; });
      setTexts(map);
      setLoading(false);
    }
    loadTexts();
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    await adminDb.from('site_images').upsert({ section_key: key, image_url: texts[key] }, { onConflict: 'section_key' });
    setSaving(null);
  };

  if (loading) return <div className="text-accent font-bold uppercase tracking-widest animate-pulse">Yüklənir...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Sayt Yazıları</h2>
          <p className="text-gray-400 text-sm">Saytdakı ümumi yazıları və əlaqə məlumatlarını buradan dəyişə bilərsiniz.</p>
        </div>
      </div>

      <div className="space-y-8 max-w-2xl">
        {GROUPS.map(g => (
          <div key={g.title} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 space-y-5">
            <div>
              <h3 className="text-accent font-bold tracking-widest text-sm uppercase">{g.title}</h3>
              <p className="text-gray-400 text-xs mt-1">{g.hint}</p>
            </div>
            {g.fields.map(f => (
              <div key={f.key}>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{f.label}</label>
                <div className="flex space-x-4 items-start">
                  {f.textarea ? (
                    <textarea value={texts[f.key] || ''} onChange={e => setTexts(p => ({ ...p, [f.key]: e.target.value }))} className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none h-24" />
                  ) : (
                    <input type="text" value={texts[f.key] || ''} onChange={e => setTexts(p => ({ ...p, [f.key]: e.target.value }))} className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none" />
                  )}
                  <button onClick={() => handleSave(f.key)} disabled={saving === f.key} className="bg-accent text-on-accent px-4 py-3 rounded-lg font-bold uppercase text-xs flex items-center space-x-2 disabled:opacity-60">
                    <Save className="w-4 h-4" /> <span>{saving === f.key ? '...' : 'Yadda Saxla'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
