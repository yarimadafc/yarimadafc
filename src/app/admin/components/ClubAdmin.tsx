'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadCloud } from 'lucide-react';
import { compressImage } from '@/lib/imageCompress';
import { Save } from 'lucide-react';

export default function ClubAdmin() {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadTexts() {
      setLoading(true);
      const keys = [
        'about_bg', 'club_about_1', 'club_about_2',
        'club_mission', 'club_vision', 'club_values',
        
      ];
      const { data } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
      
      const map: Record<string, string> = {
        club_about_1: 'Yarımada Futbol Klubu uşaq və gənclər futbolunun inkişafı, onlarda idmana sevgi yaratmaq məqsədilə təsis edilmişdir. Yarandığı gündən etibarən klubumuz qısa zamanda böyük uğurlara imza atmış və bir çox istedadlı gəncləri üzə çıxarmışdır.',
        club_about_2: 'Bizim üçün hər bir uşaq gələcəyin ulduzudur. Mütəxəssis məşqçilərimiz tərəfindən tətbiq olunan xüsusi inkişaf proqramları ilə futbolçularımızın həm fiziki, həm də psixoloji cəhətdən tam hazırlıqlı olmasını təmin edirik.',
        club_mission: 'Uşaq və gənclərə sağlam həyat tərzini aşılamaq, onlarda daxili intizam, liderlik və kollektivdə işləmək bacarıqlarını inkişaf etdirmək.',
        club_vision: 'Azərbaycanın ən böyük və peşəkar uşaq futbol akademiyalarından birinə çevrilərək, milli komandalara və peşəkar klublara davamlı oyunçu yetişdirmək.',
        club_values: 'Hörmət, Dürüstlük, Əzmkarlıq və Sağlam Rəqabət. Biz təkcə yaxşı futbolçu deyil, həm də layiqli vətəndaş yetişdiririk.',
        
      };

      if (data) {
        data.forEach(item => { map[item.section_key] = item.image_url; });
      }
      setTexts(map);
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
    const { data } = await supabase.from('site_images').select('id').eq('section_key', key).maybeSingle();
    if (data) {
      await supabase.from('site_images').update({ image_url: value }).eq('section_key', key);
    } else {
      await supabase.from('site_images').insert([{ section_key: key, image_url: value }]);
    }
    setSaving(false);
    alert('Yadda saxlanıldı!');
  };

  if (loading) return <div className="text-accent font-bold uppercase tracking-widest animate-pulse">Yüklənir...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-bg-border pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-text-main mb-2">Haqqımızda İdarəetməsi</h2>
          <p className="text-text-sec text-sm">Klub səhifəsindəki mətnləri və rəhbərlik heyətini buradan dəyişin.</p>
        </div>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* Haqqımızda */}
        <div className="bg-bg-sec p-6 rounded-2xl border border-bg-border space-y-4">
          <h3 className="text-accent font-bold tracking-widest text-sm uppercase mb-4">Haqqımızda Mətnləri və Şəkli</h3>
          
          <div className="mb-6">
            <label className="block text-text-sec text-xs font-bold uppercase tracking-widest mb-2">Haqqımızda Şəkli (Arxa Plan)</label>
            {texts['about_bg'] ? (
              <div className="relative w-full h-40 bg-bg-main border border-bg-border rounded-lg overflow-hidden group mb-2">
                <img src={texts['about_bg']} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { handleChange('about_bg', ''); handleSave('about_bg'); }} className="absolute inset-0 bg-red-500/80 text-text-main font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center uppercase tracking-widest">Şəkli Sil</button>
              </div>
            ) : (
              <label className={`w-full flex flex-col items-center justify-center space-y-2 bg-bg-main border-2 border-dashed border-bg-border rounded-lg p-8 cursor-pointer hover:border-accent transition-colors ${uploadingImage ? 'opacity-50' : ''}`}>
                <UploadCloud className="w-8 h-8 text-text-sec" />
                <span className="text-text-sec text-xs font-bold uppercase tracking-widest">{uploadingImage ? 'YÜKLƏNİR...' : 'CİHAZDAN ŞƏKİL SEÇ'}</span>
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
                        if (data.url) {
                          handleChange('about_bg', data.url);
                          // Auto save immediately
                          await supabase.from('site_images').select('id').eq('section_key', 'about_bg').maybeSingle().then(async ({data: existing}) => {
                            if (existing) await supabase.from('site_images').update({ image_url: data.url }).eq('section_key', 'about_bg');
                            else await supabase.from('site_images').insert([{ section_key: 'about_bg', image_url: data.url }]);
                          });
                          alert('Şəkil uğurla əlavə edildi!');
                        }
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
          
          <div>
            <label className="block text-text-sec text-xs font-bold uppercase tracking-widest mb-2">Paraqraf 1</label>
            <div className="flex space-x-4 items-start">
              <textarea value={texts['club_about_1']} onChange={e => handleChange('club_about_1', e.target.value)} className="flex-1 bg-bg-main border border-bg-border rounded-lg p-3 text-text-main h-24" />
              <button onClick={() => handleSave('club_about_1')} disabled={saving} className="bg-accent text-[#141414] px-4 py-3 rounded-lg font-bold uppercase text-xs">Yadda Saxla</button>
            </div>
          </div>

          <div>
            <label className="block text-text-sec text-xs font-bold uppercase tracking-widest mb-2">Paraqraf 2</label>
            <div className="flex space-x-4 items-start">
              <textarea value={texts['club_about_2']} onChange={e => handleChange('club_about_2', e.target.value)} className="flex-1 bg-bg-main border border-bg-border rounded-lg p-3 text-text-main h-24" />
              <button onClick={() => handleSave('club_about_2')} disabled={saving} className="bg-accent text-[#141414] px-4 py-3 rounded-lg font-bold uppercase text-xs">Yadda Saxla</button>
            </div>
          </div>
        </div>

        {/* Missiya, Vizyon, Dəyərlər */}
        <div className="bg-bg-sec p-6 rounded-2xl border border-bg-border space-y-4">
          <h3 className="text-accent font-bold tracking-widest text-sm uppercase mb-4">Missiya, Vizyon, Dəyərlər</h3>
          
          {['mission', 'vision', 'values'].map((key) => (
            <div key={key}>
              <label className="block text-text-sec text-xs font-bold uppercase tracking-widest mb-2">{key === 'mission' ? 'Missiya' : key === 'vision' ? 'Vizyon' : 'Dəyərlər'}</label>
              <div className="flex space-x-4 items-start">
                <textarea value={texts[`club_${key}`]} onChange={e => handleChange(`club_${key}`, e.target.value)} className="flex-1 bg-bg-main border border-bg-border rounded-lg p-3 text-text-main h-20" />
                <button onClick={() => handleSave(`club_${key}`)} disabled={saving} className="bg-accent text-[#141414] px-4 py-3 rounded-lg font-bold uppercase text-xs">Yadda Saxla</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
