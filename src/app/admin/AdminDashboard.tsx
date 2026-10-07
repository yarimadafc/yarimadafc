'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Image as ImageIcon, CheckCircle, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});
  const [isFetching, setIsFetching] = useState(true);

  // Load existing images from Supabase
  useEffect(() => {
    async function loadImages() {
      try {
        const { data, error } = await supabase.from('site_images').select('section_key, image_url');
        if (data && !error) {
          const map: Record<string, string> = {};
          data.forEach(img => { map[img.section_key] = img.image_url; });
          setImages(map);
        }
      } catch (err) {
        console.error('Failed to load images:', err);
      } finally {
        setIsFetching(false);
      }
    }
    loadImages();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleUpload = async (sectionId: string, file: File) => {
    setLoadingSection(sectionId);
    try {
      // 1. Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;

        // 2. Upload to ImgBB via our API
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        
        const uploadData = await uploadRes.json();
        
        if (uploadData.url) {
          // 3. Save to Supabase (Upsert)
          const { error } = await supabase.from('site_images').upsert({
            section_key: sectionId,
            image_url: uploadData.url
          }, { onConflict: 'section_key' });

          if (!error) {
            setImages(prev => ({ ...prev, [sectionId]: uploadData.url }));
            alert('Şəkil uğurla əlavə edildi!');
          } else {
            alert('Supabase bazasına yazılarkən xəta: ' + error.message);
          }
        } else {
          alert('ImgBB-yə yüklənərkən xəta oldu.');
        }
        setLoadingSection(null);
      };
    } catch (err) {
      console.error(err);
      alert('Gözlənilməz xəta baş verdi.');
      setLoadingSection(null);
    }
  };

  const imageSections = [
    { id: 'hero_bg', title: 'Əsas Səhifə Arxa Fon (Hero)', desc: 'Ana səhifənin ən yuxarısındakı böyük arxa fon şəkli.' },
    { id: 'about_bg', title: 'Haqqımızda / Klub', desc: 'Haqqımızda səhifəsinin yuxarı fon şəkli.' },
    { id: 'news_bg', title: 'Xəbərlər Şəkli', desc: 'Ana səhifədəki son xəbərlər blokunun əsas şəkli.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a1423] text-white">
      {/* Admin Navbar */}
      <nav className="bg-[#152741] border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#d7bf7b] overflow-hidden">
             <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-black tracking-widest uppercase text-[#d7bf7b]">Yarımada FK</h1>
            <p className="text-xs text-gray-400">İdarəetmə Paneli</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
          <LogOut className="w-4 h-4" />
          <span>Çıxış</span>
        </button>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-gray-800 pb-4">
          Sayt Şəkillərinin İdarə Edilməsi
        </h2>

        {isFetching ? (
          <div className="text-[#d7bf7b] text-center mt-10 font-bold uppercase tracking-widest">Məlumatlar Yüklənir...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageSections.map((sec) => (
              <div key={sec.id} className="bg-[#0d1a2d] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-[#d7bf7b]/50 transition-colors relative">
                
                {/* Image Preview Block */}
                <div className="w-full h-32 bg-[#152741] rounded-xl mb-4 overflow-hidden relative border border-gray-800">
                  {images[sec.id] ? (
                    <img src={images[sec.id]} alt={sec.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs uppercase tracking-widest font-bold">Şəkil Yoxdur</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{sec.title}</h3>
                  <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
                
                <label className={`w-full bg-[#152741] ${loadingSection === sec.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d7bf7b] hover:text-[#152741] cursor-pointer'} text-white border border-gray-700 font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center space-x-2`}>
                  {loadingSection === sec.id ? (
                    <span>YÜKLƏNİR...</span>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>YENİ ŞƏKİL YÜKLƏ</span>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
