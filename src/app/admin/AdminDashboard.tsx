
'use client';
import { compressImage } from '@/lib/imageCompress';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Image as ImageIcon, CheckCircle, UploadCloud, FileText, Video, Image, Trophy, DollarSign, LayoutDashboard, Settings, Trash2, ShoppingCart, Users, PlayCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import NewsAdmin from './components/NewsAdmin';
import VideosAdmin from './components/VideosAdmin';
import HeroAdmin from './components/HeroAdmin';
import StandingsAdmin from './components/StandingsAdmin';
import TextsAdmin from './components/TextsAdmin';
import ClubAdmin from './components/ClubAdmin';
import CoachesAdmin from './components/CoachesAdmin';
import TeamsAdmin from './components/TeamsAdmin';
import MatchesAdmin from './components/MatchesAdmin';
import AchievementsAdmin from './components/AchievementsAdmin';
import SponsorsAdmin from './components/SponsorsAdmin';
import ShopAdmin from './components/ShopAdmin';
import LeadershipAdmin from './components/LeadershipAdmin';
import CoachCoursesAdmin from './components/CoachCoursesAdmin';

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
      const base64 = await compressImage(file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });
      
      if (!uploadRes.ok) {
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }
      
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
    } catch (err: any) {
      console.error(err);
      alert('Gözlənilməz xəta baş verdi: ' + err.message);
      setLoadingSection(null);
    }
  };

  const handleDeleteImage = async (sectionId: string) => {
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
  };

  const imageSections = [
    { id: 'hero_bg', title: 'Əsas Səhifə Arxa Fon (Hero)', desc: 'Ana səhifənin ən yuxarısındakı böyük arxa fon şəkli.' },
    { id: 'about_bg', title: 'Haqqımızda / Klub', desc: 'Haqqımızda səhifəsinin yuxarı fon şəkli.' },
    { id: 'quick_shop', title: 'Sürətli Keçid: Onlayn Mağaza', desc: 'Ana səhifədəki Onlayn Mağaza keçidinin şəkli.' },
    
    { id: 'quick_academy', title: 'Sürətli Keçid: Akademiya', desc: 'Ana səhifədəki Akademiya keçidinin şəkli.' },
  ];

  return (
    <div className="min-h-screen bg-bg-deep text-text-main flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-bg-sec border-r border-bg-border flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-bg-border flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full border-2 border-accent overflow-hidden">
               <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-black tracking-widest text-xs uppercase text-accent">Yarımada FK</h1>
              <p className="text-[10px] text-text-sec font-bold uppercase tracking-widest">İdarəetmə</p>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <button onClick={() => setActiveTab('images')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'images' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <ImageIcon className="w-4 h-4" />
              <span>Sayt Şəkilləri</span>
            </button>
            <button onClick={() => setActiveTab('texts')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'texts' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <FileText className="w-4 h-4" />
              <span>Sayt Yazıları</span>
            </button>
            <button onClick={() => setActiveTab('club')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'club' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <FileText className="w-4 h-4" />
              <span>Klub (Haqqımızda)</span>
            </button>
            <button onClick={() => setActiveTab('leadership')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'leadership' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <Users className="w-4 h-4" />
              <span>İdarə Heyəti</span>
            </button>
            <button onClick={() => setActiveTab('courses')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'courses' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <PlayCircle className="w-4 h-4" />
              <span>Məşqçi Kursu</span>
            </button>
            <button onClick={() => setActiveTab('shop')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'shop' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <ShoppingCart className="w-4 h-4" />
              <span>Mağaza</span>
            </button>

            <button onClick={() => setActiveTab('coaches')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'coaches' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <CheckCircle className="w-4 h-4" />
              <span>Məşqçilər</span>
            </button>
            <button onClick={() => setActiveTab('teams')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'teams' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <CheckCircle className="w-4 h-4" />
              <span>Komandalar</span>
            </button>
            <button onClick={() => setActiveTab('news')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'news' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <FileText className="w-4 h-4" />
              <span>Xəbərlər</span>
            </button>
            <button onClick={() => setActiveTab('videos')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'videos' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <Video className="w-4 h-4" />
              <span>Videolar</span>
            </button>
            <button onClick={() => setActiveTab('achievements')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'achievements' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <Trophy className="w-4 h-4" />
              <span>Nailiyyətlər</span>
            </button>
            <button onClick={() => setActiveTab('sponsors')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'sponsors' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <DollarSign className="w-4 h-4" />
              <span>Sponsorlar</span>
            </button>
            <button onClick={() => setActiveTab('standings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'standings' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <Trophy className="w-4 h-4" />
              <span>Turnir Cədvəli</span>
            </button>
            <button onClick={() => setActiveTab('matches')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'matches' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <CheckCircle className="w-4 h-4" />
              <span>Oyunlar</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-bg-border">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 text-text-sec hover:text-text-main transition-colors text-xs font-bold uppercase tracking-widest px-4 py-3 bg-bg-main rounded-lg">
            <LogOut className="w-4 h-4" />
            <span>Çıxış Et</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-bg-border">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full border border-accent overflow-hidden">
               <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
             </div>
             <h1 className="font-black tracking-widest text-[10px] uppercase text-accent">Admin</h1>
          </div>
          <button onClick={handleLogout} className="text-text-sec">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto space-x-2 pb-4 mb-6 scrollbar-hide">
          <button onClick={() => setActiveTab('images')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'images' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Şəkillər</button>
          <button onClick={() => setActiveTab('texts')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'texts' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Sayt Yazıları</button>
          <button onClick={() => setActiveTab('club')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'club' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Klub</button>
          <button onClick={() => setActiveTab('coaches')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'coaches' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Məşqçilər</button>
          <button onClick={() => setActiveTab('teams')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'teams' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Komandalar</button>
          <button onClick={() => setActiveTab('news')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'news' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Xəbərlər</button>
          <button onClick={() => setActiveTab('videos')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'videos' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Videolar</button>
          <button onClick={() => setActiveTab('achievements')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'achievements' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Nailiyyətlər</button>
          <button onClick={() => setActiveTab('sponsors')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'sponsors' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Sponsorlar</button>
          <button onClick={() => setActiveTab('standings')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'standings' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Turnir Cədvəli</button>
          <button onClick={() => setActiveTab('matches')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'matches' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Oyunlar</button>
          <button onClick={() => setActiveTab('shop')} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'shop' ? 'bg-accent text-[#141414]' : 'bg-bg-sec text-text-sec'}`}>Mağaza</button>
            <button onClick={() => setActiveTab('shop')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === 'shop' ? 'bg-accent text-[#141414]' : 'text-text-sec hover:text-text-main hover:bg-bg-main'}`}>
              <ShoppingCart className="w-4 h-4" />
              <span>Mağaza</span>
            </button>
            
        </div>

        {activeTab === 'leadership' && <LeadershipAdmin />}
        {activeTab === 'courses' && <CoachCoursesAdmin />}
        {activeTab === 'texts' && <TextsAdmin />}
        {activeTab === 'club' && <ClubAdmin />}
        {activeTab === 'coaches' && <CoachesAdmin />}
        {activeTab === 'teams' && <TeamsAdmin />}
        {activeTab === 'images' && (
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Sayt Şəkilləri</h2>
            <p className="text-text-sec text-sm mb-8">Saytın müxtəlif yerlərində görünən əsas şəkilləri buradan yeniləyə bilərsiniz.</p>

            {isFetching ? (
              <div className="text-accent text-center mt-10 font-bold uppercase tracking-widest animate-pulse">Məlumatlar Yüklənir...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {imageSections.map((sec) => (
                  <div key={sec.id} className="bg-bg-sec border border-bg-border rounded-2xl p-6 flex flex-col justify-between hover:border-accent/30 transition-colors">
                    
                    <div className="w-full h-40 bg-bg-main rounded-xl mb-4 overflow-hidden relative border border-bg-border flex items-center justify-center">
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
                      <h3 className="text-sm font-bold text-text-main mb-2 uppercase tracking-wide">{sec.title}</h3>
                      <p className="text-text-sec text-xs mb-6 h-10 line-clamp-2">
                        {sec.desc}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <label className={`flex-1 bg-bg-main ${loadingSection === sec.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-[#141414] cursor-pointer'} text-text-main border border-bg-border font-bold text-[10px] uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center space-x-2`}>
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
                          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-text-main border border-red-500/20 font-bold text-[10px] uppercase tracking-widest px-4 rounded-lg transition-colors flex items-center justify-center"
                          title="Şəkli Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'news' && <NewsAdmin />}
        {activeTab === 'videos' && <VideosAdmin />}
          {activeTab === 'hero' && <HeroAdmin />}
        {activeTab === 'achievements' && <AchievementsAdmin />}
        {activeTab === 'sponsors' && <SponsorsAdmin />}
          {activeTab === 'standings' && <StandingsAdmin />}
          {activeTab === 'matches' && <MatchesAdmin />}
        {activeTab === 'shop' && <ShopAdmin />}

      </main>
    </div>
  );
}
