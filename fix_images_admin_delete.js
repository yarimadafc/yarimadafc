const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');

// First, make sure Trash2 is imported
if (!content.includes('Trash2')) {
  content = content.replace("Settings } from 'lucide-react';", "Settings, Trash2 } from 'lucide-react';");
}

// Add handleDeleteImage function
if (!content.includes('const handleDeleteImage')) {
  content = content.replace(
    /const imageSections = \[/,
    `const handleDeleteImage = async (sectionId: string) => {
    if (!confirm('Bu şəkli silmək istədiyinizə əminsiniz?')) return;
    setLoadingSection(sectionId);
    try {
      const { error } = await supabase.from('site_images').delete().eq('section_key', sectionId);
      if (!error) {
        setImages(prev => {
          const copy = { ...prev };
          delete copy[sectionId];
          return copy;
        });
      } else {
        alert('Xəta: ' + error.message);
      }
    } catch (err: any) {
      alert('Gözlənilməz xəta: ' + err.message);
    }
    setLoadingSection(null);
  };\n\n  const imageSections = [`
  );
}

// Update the UI to include the Delete button
content = content.replace(
  /<label className=\{`w-full bg-\[\#0d1a2d\] \$\{loadingSection === sec\.id \? 'opacity-50 cursor-not-allowed' : 'hover:bg-\[\#d7bf7b\] hover:text-\[\#152741\] cursor-pointer'\} text-white border border-gray-700 font-bold text-\[10px\] uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center space-x-2`\}>[\s\S]*?<\/label>/,
  `<div className="flex space-x-2">
                      <label className={\`flex-1 bg-[#0d1a2d] \${loadingSection === sec.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d7bf7b] hover:text-[#152741] cursor-pointer'} text-white border border-gray-700 font-bold text-[10px] uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center space-x-2\`}>
                        {loadingSection === sec.id ? (
                          <span>YÜKLƏNİR...</span>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            <span>{images[sec.id] ? 'DƏYİŞ' : 'YÜKLƏ'}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleUpload(sec.id, e.target.files[0]);
                                }
                              }}
                            />
                          </>
                        )}
                      </label>
                      {images[sec.id] && (
                        <button 
                          onClick={() => handleDeleteImage(sec.id)}
                          disabled={loadingSection === sec.id}
                          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 font-bold text-[10px] uppercase tracking-widest px-4 rounded-lg transition-colors flex items-center justify-center"
                          title="Şəkli Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>`
);

fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
