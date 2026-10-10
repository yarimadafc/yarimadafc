'use client';
import { uploadImage } from '@/lib/uploadImage';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, BarChart3, Image as ImageIcon, CheckCircle, UploadCloud, FileText, Video, Trophy, DollarSign, LayoutDashboard, Trash2, ShoppingCart, Users, PlayCircle, Ticket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { adminDb } from '@/lib/adminDb';
import NewsAdmin from './components/NewsAdmin';
import VideosAdmin from './components/VideosAdmin';
import HeroAdmin from './components/HeroAdmin';
import TransfersAdmin from './components/TransfersAdmin';
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
import MembersAdmin from './components/MembersAdmin';
import AnalyticsAdmin from './components/AnalyticsAdmin';
import TicketsAdmin from './components/TicketsAdmin';

// Sidebar (desktop) and the scrolling tab row (phones) are built from this one list.
const TABS = [
  { id: 'analytics', label: 'Statistika', Icon: BarChart3 },
  { id: 'images', label: 'Sayt Şəkilləri', short: 'Şəkillər', Icon: ImageIcon },
  { id: 'texts', label: 'Sayt Yazıları', Icon: FileText },
  { id: 'club', label: 'Klub (Haqqımızda)', short: 'Klub', Icon: FileText },
  { id: 'leadership', label: 'Klub Rəhbərliyi', Icon: Users },
  { id: 'staff', label: 'Klub Heyəti', Icon: Users },
  { id: 'teams', label: 'Komandalar', Icon: CheckCircle },
  { id: 'coaches', label: 'Məşqçilər', Icon: CheckCircle },
  { id: 'matches', label: 'Oyunlar', Icon: CheckCircle },
  { id: 'standings', label: 'Turnir Cədvəli', Icon: Trophy },
  { id: 'tickets', label: 'Biletlər', Icon: Ticket },
  { id: 'news', label: 'Xəbərlər', Icon: FileText },
  { id: 'hero', label: 'Ana Səhifə Slayderi', short: 'Slayder', Icon: LayoutDashboard },
  { id: 'transfers', label: 'Transferlər', Icon: Users },
  { id: 'videos', label: 'Videolar', Icon: Video },
  { id: 'achievements', label: 'Nailiyyətlər', Icon: Trophy },
  { id: 'sponsors', label: 'Sponsorlar', Icon: DollarSign },
  { id: 'courses', label: 'Məşqçi Kursu', Icon: PlayCircle },
  { id: 'shop', label: 'Mağaza', Icon: ShoppingCart },
  { id: 'members', label: 'Üzvlər', Icon: Users },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('analytics');
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
      // background images fill the screen -> high-resolution upload
      const url = await uploadImage(file, sectionId.endsWith('_bg') ? 'high' : 'normal');
      const { error } = await adminDb.from('site_images').upsert({ section_key: sectionId, image_url: url }, { onConflict: 'section_key' });
      if (!error) setImages(prev => ({ ...prev, [sectionId]: url }));
    } catch { /* uploadImage already showed the error */ }
    setLoadingSection(null);
  };

  const handleDeleteImage = async (sectionId: string) => {
    if (!confirm('Bu şəkli silmək istədiyinizə əminsiniz?')) return;
    setLoadingSection(sectionId);
    const { error } = await adminDb.from('site_images').delete().eq('section_key', sectionId);
    if (!error) {
      setImages(prev => {
        const copy = { ...prev };
        delete copy[sectionId];
        return copy;
      });
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
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 border-r border-gray-700 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div className="flex flex-col min-h-0">
          <div className="p-6 border-b border-gray-700 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full border-2 border-accent overflow-hidden">
               <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-black tracking-widest text-xs uppercase text-accent">Yarımada FK</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">İdarəetmə</p>
            </div>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto min-h-0">
            {TABS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${activeTab === id ? 'bg-accent text-on-accent' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest px-4 py-3 bg-gray-900 rounded-lg">
            <LogOut className="w-4 h-4" />
            <span>Çıxış Et</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full border border-accent overflow-hidden">
               <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
             </div>
             <h1 className="font-black tracking-widest text-[10px] uppercase text-accent">Admin</h1>
          </div>
          <button onClick={handleLogout} className="text-gray-400">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto space-x-2 pb-4 mb-6 scrollbar-hide">
          {TABS.map(({ id, label, short }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${activeTab === id ? 'bg-accent text-on-accent' : 'bg-gray-800 text-gray-400'}`}>{short || label}</button>
          ))}
        </div>

        {activeTab === 'leadership' && <LeadershipAdmin group="leadership" />}
        {activeTab === 'staff' && <LeadershipAdmin group="staff" />}
        {activeTab === 'tickets' && <TicketsAdmin />}
        {activeTab === 'courses' && <CoachCoursesAdmin />}
        {activeTab === 'texts' && <TextsAdmin />}
        {activeTab === 'club' && <ClubAdmin />}
        {activeTab === 'coaches' && <CoachesAdmin />}
        {activeTab === 'teams' && <TeamsAdmin />}
        {activeTab === 'images' && (
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Sayt Şəkilləri</h2>
            <p className="text-gray-400 text-sm mb-8">Saytın müxtəlif yerlərində görünən əsas şəkilləri buradan yeniləyə bilərsiniz.</p>

            {isFetching ? (
              <div className="text-accent text-center mt-10 font-bold uppercase tracking-widest animate-pulse">Məlumatlar Yüklənir...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {imageSections.map((sec) => (
                  <div key={sec.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col justify-between hover:border-accent/30 transition-colors">
                    
                    <div className="w-full h-40 bg-gray-900 rounded-xl mb-4 overflow-hidden relative border border-gray-700 flex items-center justify-center">
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
                    
                    <div className="flex space-x-2">
                      <label className={`flex-1 bg-gray-900 ${loadingSection === sec.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-on-accent cursor-pointer'} text-white border border-gray-700 font-bold text-[10px] uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center space-x-2`}>
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
                                const file = e.target.files?.[0];
                                e.target.value = '';
                                if (file) handleUpload(sec.id, file);
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
          {activeTab === 'transfers' && <TransfersAdmin />}
          {activeTab === 'standings' && <StandingsAdmin />}
          {activeTab === 'matches' && <MatchesAdmin />}
        {activeTab === 'shop' && <ShopAdmin />}
        {activeTab === 'members' && <MembersAdmin />}
        {activeTab === 'analytics' && <AnalyticsAdmin />}

      </main>
    </div>
  );
}
