'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Image as ImageIcon, CheckCircle, UploadCloud, FileText, Video, Trophy, DollarSign, LayoutDashboard, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import NewsAdmin from './components/NewsAdmin';
import VideosAdmin from './components/VideosAdmin';
import AchievementsAdmin from './components/AchievementsAdmin';
import SponsorsAdmin from './components/SponsorsAdmin';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('images');
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        
        const uploadData = await uploadRes.json();
        
        if (uploadData.url) {
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
    { id: 'quick_shop', title: 'Sürətli Keçid: Onlayn Mağaza', desc: 'Ana səhifədəki Onlayn Mağaza keçidinin şəkli.' },
    { id: 'quick_school', title: 'Sürətli Keçid: Futbol Məktəbi', desc: 'Ana səhifədəki Futbol Məktəbi keçidinin şəkli.' },
    { id: 'quick_academy', title: 'Sürətli Keçid: Akademiya', desc: 'Ana səhifədəki Akademiya keçidinin şəkli.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a1423] text-white flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#152741] border-r border-gray-800 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-gray-800 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#d7bf7b] overflow-hidden">
               <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-black tracking-widest text-xs uppercase text-[#d7bf7b]">Yarımada FK</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">İdarəetmə</p>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <button onClick={() => setActiveTab('images')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'images' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}`}>
              <ImageIcon className="w-4 h-4" />
              <span>Sayt Şəkilləri</span>
            </button>
            <button onClick={() => setActiveTab('news')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'news' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}`}>
              <FileText className="w-4 h-4" />
              <span>Xəbərlər</span>
            </button>
            <button onClick={() => setActiveTab('videos')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'videos' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}`}>
              <Video className="w-4 h-4" />
              <span>Videolar</span>
            </button>
            <button onClick={() => setActiveTab('achievements')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'achievements' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}`}>
              <Trophy className="w-4 h-4" />
              <span>Nailiyyətlər</span>
            </button>
            <button onClick={() => setActiveTab('sponsors')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'sponsors' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}`}>
              <DollarSign className="w-4 h-4" />
              <span>Sponsorlar</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest px-4 py-3 bg-[#0d1a2d] rounded-lg">
            <LogOut className="w-4 h-4" />
            <span>Çıxış Et</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full border border-[#d7bf7b] overflow-hidden">
               <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
             </div>
             <h1 className="font-black tracking-widest text-[10px] uppercase text-[#d7bf7b]">Admin</h1>
          </div>
          <button onClick={handleLogout} className="text-gray-400">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto space-x-2 pb-4 mb-6 scrollbar-hide">
          <button onClick={() => setActiveTab('images')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'images' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}`}>Şəkillər</button>
          <button onClick={() => setActiveTab('news')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'news' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}`}>Xəbərlər</button>
          <button onClick={() => setActiveTab('videos')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'videos' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}`}>Videolar</button>
          <button onClick={() => setActiveTab('achievements')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'achievements' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}`}>Nailiyyətlər</button>
          <button onClick={() => setActiveTab('sponsors')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'sponsors' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}`}>Sponsorlar</button>
        </div>

        {activeTab === 'images' && (
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Sayt Şəkilləri</h2>
            <p className="text-gray-400 text-sm mb-8">Saytın müxtəlif yerlərində görünən əsas şəkilləri buradan yeniləyə bilərsiniz.</p>

            {isFetching ? (
              <div className="text-[#d7bf7b] text-center mt-10 font-bold uppercase tracking-widest animate-pulse">Məlumatlar Yüklənir...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {imageSections.map((sec) => (
                  <div key={sec.id} className="bg-[#152741] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-[#d7bf7b]/30 transition-colors">
                    
                    <div className="w-full h-40 bg-[#0d1a2d] rounded-xl mb-4 overflow-hidden relative border border-gray-800 flex items-center justify-center">
                      {images[sec.id] ? (
                        <img src={images[sec.id]} alt={sec.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-600 flex flex-col items-center">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">Şəkil Yoxdur</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">{sec.title}</h3>
                      <p className="text-gray-400 text-xs mb-6 h-10 line-clamp-2">
                        {sec.desc}
                      </p>
                    </div>
                    
                    <label className={`w-full bg-[#0d1a2d] ${loadingSection === sec.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d7bf7b] hover:text-[#152741] cursor-pointer'} text-white border border-gray-700 font-bold text-[10px] uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center space-x-2`}>
                      {loadingSection === sec.id ? (
                        <span>YÜKLƏNİR...</span>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>ŞƏKİL SEÇ VƏ YÜKLƏ</span>
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
        )}

        {activeTab === 'news' && <NewsAdmin />}
        {activeTab === 'videos' && <VideosAdmin />}
        {activeTab === 'achievements' && <AchievementsAdmin />}
        {activeTab === 'sponsors' && <SponsorsAdmin />}

      </main>
    </div>
  );
}
