'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb } from '@/lib/adminDb';
import { Save } from 'lucide-react';

export default function TextsAdmin() {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTexts() {
      setLoading(true);
      const keys = ['hero_title_1', 'hero_title_2', 'hero_subtitle'];
      const { data } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
      if (data) {
        const map: Record<string, string> = {
          hero_title_1: 'YENİ MÖVSÜM,',
          hero_title_2: 'YENİ HƏDƏFLƏR',
          hero_subtitle: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!'
        };
        data.forEach(item => { map[item.section_key] = item.image_url; });
        setTexts(map);
      }
      setLoading(false);
    }
    loadTexts();
  }, []);

  const handleChange = (key: string, value: string) => {
    setTexts(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    const value = texts[key];
    
    // Check if exists
    const { data } = await supabase.from('site_images').select('id').eq('section_key', key).maybeSingle();
    if (data) {
      await adminDb.from('site_images').update({ image_url: value }).eq('section_key', key);
    } else {
      await adminDb.from('site_images').insert([{ section_key: key, image_url: value }]);
    }
    
    setSaving(false);
    alert('Yadda saxlanıldı!');
  };

  if (loading) return <div className="text-accent font-bold uppercase tracking-widest animate-pulse">Yüklənir...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Sayt Yazıları</h2>
          <p className="text-gray-400 text-sm">Ana səhifədəki yazıları buradan dəyişə bilərsiniz.</p>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Giriş Başlığı (Sətir 1)</label>
          <div className="flex space-x-4">
            <input 
              type="text" 
              value={texts['hero_title_1'] || ''} 
              onChange={e => handleChange('hero_title_1', e.target.value)} 
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none" 
            />
            <button onClick={() => handleSave('hero_title_1')} disabled={saving} className="bg-accent text-on-accent px-4 rounded-lg font-bold uppercase text-xs flex items-center space-x-2">
              <Save className="w-4 h-4" /> <span>Yadda Saxla</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Giriş Başlığı (Sətir 2 - Sarı Rəng)</label>
          <div className="flex space-x-4">
            <input 
              type="text" 
              value={texts['hero_title_2'] || ''} 
              onChange={e => handleChange('hero_title_2', e.target.value)} 
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none" 
            />
            <button onClick={() => handleSave('hero_title_2')} disabled={saving} className="bg-accent text-on-accent px-4 rounded-lg font-bold uppercase text-xs flex items-center space-x-2">
              <Save className="w-4 h-4" /> <span>Yadda Saxla</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Giriş Alt Mətni</label>
          <div className="flex space-x-4 items-start">
            <textarea 
              value={texts['hero_subtitle'] || ''} 
              onChange={e => handleChange('hero_subtitle', e.target.value)} 
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none h-24" 
            />
            <button onClick={() => handleSave('hero_subtitle')} disabled={saving} className="bg-accent text-on-accent px-4 py-3 rounded-lg font-bold uppercase text-xs flex items-center space-x-2 h-[50px]">
              <Save className="w-4 h-4" /> <span>Yadda Saxla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
