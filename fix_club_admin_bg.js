const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/ClubAdmin.tsx', 'utf-8');

// Add states for uploading
content = content.replace(
  "const [saving, setSaving] = useState(false);",
  "const [saving, setSaving] = useState(false);\n  const [uploadingImage, setUploadingImage] = useState(false);"
);

// Add imports
content = content.replace(
  "import { supabase } from '@/lib/supabase';",
  "import { supabase } from '@/lib/supabase';\nimport { UploadCloud } from 'lucide-react';\nimport { compressImage } from '@/lib/imageCompress';"
);

// Load about_bg
content = content.replace(
  /'club_about_1', 'club_about_2',/,
  "'about_bg', 'club_about_1', 'club_about_2',"
);

// Add about_bg UI inside "Haqqımızda Mətnləri"
content = content.replace(
  /<h3 className="text-\[#d7bf7b\] font-bold tracking-widest text-sm uppercase mb-4">Haqqımızda Mətnləri<\/h3>/,
  `<h3 className="text-[#d7bf7b] font-bold tracking-widest text-sm uppercase mb-4">Haqqımızda Mətnləri və Şəkli</h3>
          
          <div className="mb-6">
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Haqqımızda Şəkli (Arxa Plan)</label>
            {texts['about_bg'] ? (
              <div className="relative w-full h-40 bg-[#0d1a2d] border border-gray-700 rounded-lg overflow-hidden group mb-2">
                <img src={texts['about_bg']} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { handleChange('about_bg', ''); handleSave('about_bg'); }} className="absolute inset-0 bg-red-500/80 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center uppercase tracking-widest">Şəkli Sil</button>
              </div>
            ) : (
              <label className={\`w-full flex flex-col items-center justify-center space-y-2 bg-[#0d1a2d] border-2 border-dashed border-gray-700 rounded-lg p-8 cursor-pointer hover:border-[#d7bf7b] transition-colors \${uploadingImage ? 'opacity-50' : ''}\`}>
                <UploadCloud className="w-8 h-8 text-gray-400" />
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{uploadingImage ? 'YÜKLƏNİR...' : 'CİHAZDAN ŞƏKİL SEÇ'}</span>
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
                          await supabase.from('site_images').select('id').eq('section_key', 'about_bg').single().then(async ({data: existing}) => {
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
          </div>`
);

fs.writeFileSync('src/app/admin/components/ClubAdmin.tsx', content);
