'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save } from 'lucide-react';

export default function ClubAdmin() {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTexts() {
      setLoading(true);
      const keys = [
        'club_about_1', 'club_about_2',
        'club_mission', 'club_vision', 'club_values',
        'leader_1_name', 'leader_1_role', 'leader_1_img',
        'leader_2_name', 'leader_2_role', 'leader_2_img',
        'leader_3_name', 'leader_3_role', 'leader_3_img'
      ];
      const { data } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
      
      const map: Record<string, string> = {
        club_about_1: 'Yarımada Futbol Klubu uşaq və gənclər futbolunun inkişafı, onlarda idmana sevgi yaratmaq məqsədilə təsis edilmişdir. Yarandığı gündən etibarən klubumuz qısa zamanda böyük uğurlara imza atmış və bir çox istedadlı gəncləri üzə çıxarmışdır.',
        club_about_2: 'Bizim üçün hər bir uşaq gələcəyin ulduzudur. Mütəxəssis məşqçilərimiz tərəfindən tətbiq olunan xüsusi inkişaf proqramları ilə futbolçularımızın həm fiziki, həm də psixoloji cəhətdən tam hazırlıqlı olmasını təmin edirik.',
        club_mission: 'Uşaq və gənclərə sağlam həyat tərzini aşılamaq, onlarda daxili intizam, liderlik və kollektivdə işləmək bacarıqlarını inkişaf etdirmək.',
        club_vision: 'Azərbaycanın ən böyük və peşəkar uşaq futbol akademiyalarından birinə çevrilərək, milli komandalara və peşəkar klublara davamlı oyunçu yetişdirmək.',
        club_values: 'Hörmət, Dürüstlük, Əzmkarlıq və Sağlam Rəqabət. Biz təkcə yaxşı futbolçu deyil, həm də layiqli vətəndaş yetişdiririk.',
        leader_1_name: 'Nağı Əliyev', leader_1_role: 'Klubun Təsisçisi və Rəhbəri', leader_1_img: '/Logo.JPG.jpeg',
        leader_2_name: 'Əhməd Məmmədov', leader_2_role: 'İdman Direktoru', leader_2_img: '/Logo.JPG.jpeg',
        leader_3_name: 'Elvin Qasımov', leader_3_role: 'Baş Koordinator', leader_3_img: '/Logo.JPG.jpeg',
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
    const { data } = await supabase.from('site_images').select('id').eq('section_key', key).single();
    if (data) {
      await supabase.from('site_images').update({ image_url: value }).eq('section_key', key);
    } else {
      await supabase.from('site_images').insert([{ section_key: key, image_url: value }]);
    }
    setSaving(false);
    alert('Yadda saxlanıldı!');
  };

  if (loading) return <div className="text-[#d7bf7b] font-bold uppercase tracking-widest animate-pulse">Yüklənir...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Haqqımızda İdarəetməsi</h2>
          <p className="text-gray-400 text-sm">Klub səhifəsindəki mətnləri və rəhbərlik heyətini buradan dəyişin.</p>
        </div>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* Haqqımızda */}
        <div className="bg-[#152741] p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-[#d7bf7b] font-bold tracking-widest text-sm uppercase mb-4">Haqqımızda Mətnləri</h3>
          
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Paraqraf 1</label>
            <div className="flex space-x-4 items-start">
              <textarea value={texts['club_about_1']} onChange={e => handleChange('club_about_1', e.target.value)} className="flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white h-24" />
              <button onClick={() => handleSave('club_about_1')} disabled={saving} className="bg-[#d7bf7b] text-[#152741] px-4 py-3 rounded-lg font-bold uppercase text-xs">Yadda Saxla</button>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Paraqraf 2</label>
            <div className="flex space-x-4 items-start">
              <textarea value={texts['club_about_2']} onChange={e => handleChange('club_about_2', e.target.value)} className="flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white h-24" />
              <button onClick={() => handleSave('club_about_2')} disabled={saving} className="bg-[#d7bf7b] text-[#152741] px-4 py-3 rounded-lg font-bold uppercase text-xs">Yadda Saxla</button>
            </div>
          </div>
        </div>

        {/* Missiya, Vizyon, Dəyərlər */}
        <div className="bg-[#152741] p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-[#d7bf7b] font-bold tracking-widest text-sm uppercase mb-4">Missiya, Vizyon, Dəyərlər</h3>
          
          {['mission', 'vision', 'values'].map((key) => (
            <div key={key}>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{key === 'mission' ? 'Missiya' : key === 'vision' ? 'Vizyon' : 'Dəyərlər'}</label>
              <div className="flex space-x-4 items-start">
                <textarea value={texts[`club_${key}`]} onChange={e => handleChange(`club_${key}`, e.target.value)} className="flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white h-20" />
                <button onClick={() => handleSave(`club_${key}`)} disabled={saving} className="bg-[#d7bf7b] text-[#152741] px-4 py-3 rounded-lg font-bold uppercase text-xs">Yadda Saxla</button>
              </div>
            </div>
          ))}
        </div>

        {/* Rəhbərlik */}
        <div className="bg-[#152741] p-6 rounded-2xl border border-gray-800 space-y-8">
          <h3 className="text-[#d7bf7b] font-bold tracking-widest text-sm uppercase mb-4">Klub Rəhbərliyi</h3>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className="border-b border-gray-800 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
              <h4 className="text-white font-bold mb-4 uppercase text-xs">Rəhbər {num}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ad Soyad</label>
                  <input type="text" value={texts[`leader_${num}_name`]} onChange={e => handleChange(`leader_${num}_name`, e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Vəzifə</label>
                  <input type="text" value={texts[`leader_${num}_role`]} onChange={e => handleChange(`leader_${num}_role`, e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Şəkil URL</label>
                  <input type="text" value={texts[`leader_${num}_img`]} onChange={e => handleChange(`leader_${num}_img`, e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
                </div>
              </div>
              <button onClick={() => { handleSave(`leader_${num}_name`); handleSave(`leader_${num}_role`); handleSave(`leader_${num}_img`); }} disabled={saving} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold uppercase text-[10px]">3-nü Də Yadda Saxla</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
