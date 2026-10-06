'use client';
import { useRouter } from 'next/navigation';
import { LogOut, Image as ImageIcon, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/az/admin/login');
    router.refresh();
  };

  const imageSections = [
    { id: 'hero', title: 'Əsas Səhifə Arxa Fon (Hero)', desc: 'Ana səhifənin ən yuxarısındakı böyük arxa fon şəkli.' },
    { id: 'news', title: 'Xəbərlər Şəkilləri', desc: 'Ana səhifədəki son xəbərlər bloku üçün şəkillər.' },
    { id: 'video_thumb', title: 'Video Bölümü (Thumbnail)', desc: 'Yarımada TV / Videolar bölümündəki youtube videolarının qapaq şəkilləri.' },
    { id: 'gallery', title: 'Foto Qalereya', desc: 'Ana səhifə üçün fotoqalereya şəkilləri (Mərhələ 2-də aktivləşəcək).' },
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
          Ana Səhifə Şəkillərinin İdarə Edilməsi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageSections.map((sec) => (
            <div key={sec.id} className="bg-[#0d1a2d] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-[#d7bf7b]/50 transition-colors">
              <div>
                <div className="w-12 h-12 bg-[#152741] rounded-xl flex items-center justify-center text-[#d7bf7b] mb-4">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{sec.title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {sec.desc}
                </p>
              </div>
              <button className="w-full bg-[#152741] hover:bg-[#d7bf7b] hover:text-[#152741] text-white border border-gray-700 font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-all">
                Şəkilləri İdarə Et
              </button>
            </div>
          ))}

          {/* Setup Notice */}
          <div className="bg-[#d7bf7b]/10 border border-[#d7bf7b]/30 rounded-2xl p-6 flex flex-col justify-center items-center text-center col-span-1 md:col-span-2 lg:col-span-3 mt-4">
            <Settings className="w-10 h-10 text-[#d7bf7b] mb-3 animate-spin-slow" />
            <h3 className="text-[#d7bf7b] font-bold text-lg uppercase tracking-widest mb-2">Supabase İnteqrasiyası Gözlənilir</h3>
            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
              Bu panel hazırda interfeys olaraq qurulub. Təsdiqlədiyiniz halda bütün bu şəkilləri (və digər məlumatları) birbaşa Supabase Storage-ə yükləyə biləcəyiniz funksionallıqları Mərhələ 2-də aktivləşdirəcəyik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
