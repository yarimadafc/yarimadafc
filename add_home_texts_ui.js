const fs = require('fs');
let file = 'src/app/[locale]/adminpanel/parametrler/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure home_texts exists in data
content = content.replace(/setData\(\{ \.\.\.settingsRes\.data \}\);/, 'setData({ home_texts: {}, ...settingsRes.data });');

const oldSave = `const { error } = await supabase.from('site_settings').upsert({ id: 1, ...data });`;
const newSave = `
    const payload = { ...data };
    if (!payload.home_texts) payload.home_texts = {};
    const { error } = await supabase.from('site_settings').upsert({ id: 1, ...payload });
`;
content = content.replace(oldSave, newSave);

const handleTextChange = `
  const handleTextChange = (key, val) => {
    setData(prev => ({
      ...prev,
      home_texts: {
        ...(prev.home_texts || {}),
        [key]: val
      }
    }));
  };
`;
if(!content.includes('handleTextChange')) {
  content = content.replace(/const handleChange = /g, handleTextChange + '\n  const handleChange = ');
}

const textsUI = `
        <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
          <h2 className="text-xl font-bold mb-4">Ana Səhifə Yazıları (Admin Paneldən İdarə)</h2>
          <p className="text-sm text-gray-500 mb-6">Buradan ana səhifədəki əsas başlıqları 3 dildə dəyişə bilərsiniz. Boş qoysanız standart yazılar (kodda olan) görünəcək.</p>
          
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="font-bold mb-3">Əsas Başlıq (Hero Title)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-xs">AZ</label><input type="text" value={data?.home_texts?.hero_title_az || ''} onChange={(e) => handleTextChange('hero_title_az', e.target.value)} className="w-full p-2 border rounded" placeholder="MEYDANDA GÜC..." /></div>
                <div><label className="text-xs">EN</label><input type="text" value={data?.home_texts?.hero_title_en || ''} onChange={(e) => handleTextChange('hero_title_en', e.target.value)} className="w-full p-2 border rounded" /></div>
                <div><label className="text-xs">RU</label><input type="text" value={data?.home_texts?.hero_title_ru || ''} onChange={(e) => handleTextChange('hero_title_ru', e.target.value)} className="w-full p-2 border rounded" /></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="font-bold mb-3">Əsas Alt Mətn (Hero Subtitle)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-xs">AZ</label><textarea value={data?.home_texts?.hero_subtitle_az || ''} onChange={(e) => handleTextChange('hero_subtitle_az', e.target.value)} className="w-full p-2 border rounded" rows="3" /></div>
                <div><label className="text-xs">EN</label><textarea value={data?.home_texts?.hero_subtitle_en || ''} onChange={(e) => handleTextChange('hero_subtitle_en', e.target.value)} className="w-full p-2 border rounded" rows="3" /></div>
                <div><label className="text-xs">RU</label><textarea value={data?.home_texts?.hero_subtitle_ru || ''} onChange={(e) => handleTextChange('hero_subtitle_ru', e.target.value)} className="w-full p-2 border rounded" rows="3" /></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="font-bold mb-3">Haqqımızda Başlıq (About Title)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-xs">AZ</label><input type="text" value={data?.home_texts?.about_title_az || ''} onChange={(e) => handleTextChange('about_title_az', e.target.value)} className="w-full p-2 border rounded" /></div>
                <div><label className="text-xs">EN</label><input type="text" value={data?.home_texts?.about_title_en || ''} onChange={(e) => handleTextChange('about_title_en', e.target.value)} className="w-full p-2 border rounded" /></div>
                <div><label className="text-xs">RU</label><input type="text" value={data?.home_texts?.about_title_ru || ''} onChange={(e) => handleTextChange('about_title_ru', e.target.value)} className="w-full p-2 border rounded" /></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="font-bold mb-3">Haqqımızda Mətn (About Text)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-xs">AZ</label><textarea value={data?.home_texts?.about_text_az || ''} onChange={(e) => handleTextChange('about_text_az', e.target.value)} className="w-full p-2 border rounded" rows="4" /></div>
                <div><label className="text-xs">EN</label><textarea value={data?.home_texts?.about_text_en || ''} onChange={(e) => handleTextChange('about_text_en', e.target.value)} className="w-full p-2 border rounded" rows="4" /></div>
                <div><label className="text-xs">RU</label><textarea value={data?.home_texts?.about_text_ru || ''} onChange={(e) => handleTextChange('about_text_ru', e.target.value)} className="w-full p-2 border rounded" rows="4" /></div>
              </div>
            </div>
            
          </div>
        </div>
`;

if(!content.includes('Ana Səhifə Yazıları')) {
  // insert right before the Submit button
  content = content.replace(/<button onClick=\{handleSave\}/, textsUI + '\n        <button onClick={handleSave}');
}

fs.writeFileSync(file, content, 'utf8');
