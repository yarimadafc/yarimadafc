const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/CoachesAdmin.tsx', 'utf-8');

// Add states for uploading
content = content.replace(
  "const [isAdding, setIsAdding] = useState(false);",
  "const [isAdding, setIsAdding] = useState(false);\n  const [uploadingImage, setUploadingImage] = useState(false);"
);

// Add compressImage utility import
content = content.replace(
  "import { Plus } from 'lucide-react';",
  "import { Plus, UploadCloud } from 'lucide-react';\nimport { compressImage } from '@/lib/imageCompress';"
);

// Replace imageUrl input with file upload input
content = content.replace(
  /<div className="md:col-span-2"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Şəkil URL<\/label><input type="text" value=\{imageUrl\} onChange=\{e => setImageUrl\(e\.target\.value\)\} className="w-full bg-\[#0d1a2d\] border border-gray-700 rounded-lg p-3 text-white" \/><\/div>/,
  `<div className="md:col-span-2">
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Məşqçinin Şəkli (3:4 formatı tövsiyə olunur)</label>
            {imageUrl ? (
              <div className="relative w-32 h-40 bg-[#0d1a2d] border border-gray-700 rounded-lg overflow-hidden group">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImageUrl('')} className="absolute inset-0 bg-red-500/80 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">SIL</button>
              </div>
            ) : (
              <label className={\`w-full flex items-center justify-center space-x-2 bg-[#0d1a2d] border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-[#d7bf7b] transition-colors \${uploadingImage ? 'opacity-50' : ''}\`}>
                <UploadCloud className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-xs font-bold uppercase">{uploadingImage ? 'YÜKLƏNİR...' : 'CİHAZDAN ŞƏKİL SEÇ'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  disabled={uploadingImage}
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadingImage(true);
                      try {
                        const base64 = await compressImage(e.target.files[0], 800);
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ image: base64 })
                        });
                        const data = await res.json();
                        if (data.url) setImageUrl(data.url);
                        else alert('Xəta baş verdi');
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

fs.writeFileSync('src/app/admin/components/CoachesAdmin.tsx', content);
