export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/FadeIn';

export default async function MediaPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || 'fotolar';

  let photos: any[] = [];
  let videos: any[] = [];

  try {
    const [photosRes, videosRes] = await Promise.all([
      supabase.from('media_photos').select('*').order('created_at', { ascending: false }),
      supabase.from('media_videos').select('*').order('created_at', { ascending: false })
    ]);

    if (photosRes.data) photos = photosRes.data;
    if (videosRes.data) videos = videosRes.data;
  } catch (error) {
    console.error('Error fetching media:', error);
  }

  // Mock data removed


  if (videos.length === 0) {
    videos = Array(4).fill({
      title: 'Yarımada FK 3-1 Neftçi',
      video_url: 'https://youtube.com/watch?v=mock',
      category: 'Oyunlar',
      created_at: '2026-10-05'
    });
  }

  return (
    <main className="flex-grow bg-[var(--ks-paper)] text-[var(--ks-ink)]">
      
      {/* HERO SECTION */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[40vh] flex flex-col justify-end p-8 md:p-16 bg-[#0a1628]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent z-0" />
          <div className="relative z-10 max-w-4xl">
            <FadeIn>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--ks-kinpaku)] mb-4 font-bold">QALEREYA</p>
              <h1 className="text-7xl md:text-9xl font-black font-condensed uppercase tracking-normal text-white mb-6 leading-[0.85] drop-shadow-xl">
                MEDİA
              </h1>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <FadeIn delay={0.1}>
          <div className="flex gap-4 mb-12">
            <Link 
              href="/media?tab=fotolar" 
              className={`ks-button !rounded-full !px-8 !py-4 font-bold text-lg transition-colors ${activeTab === 'fotolar' ? '!bg-[var(--ks-ink)] !text-white' : '!bg-gray-100 !text-gray-500 hover:!bg-gray-200 hover:!text-[var(--ks-ink)]'}`}
            >
              Fotolar
            </Link>
            <Link 
              href="/media?tab=videolar" 
              className={`ks-button !rounded-full !px-8 !py-4 font-bold text-lg transition-colors ${activeTab === 'videolar' ? '!bg-[var(--ks-ink)] !text-white' : '!bg-gray-100 !text-gray-500 hover:!bg-gray-200 hover:!text-[var(--ks-ink)]'}`}
            >
              Videolar
            </Link>
          </div>

          {/* FOTOLAR */}
          {activeTab === 'fotolar' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {photos.map((photo, i) => (
                <div key={i} className="group relative aspect-square bg-[var(--ks-paper-deep)] rounded-3xl overflow-hidden cursor-pointer shadow-sm border border-gray-100">
                  {photo.url ? (
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]/5 group-hover:bg-[#0a1628]/10 transition-colors">
                      <span className="font-black font-condensed text-4xl text-gray-300 uppercase tracking-widest opacity-30">YARIMADA FK</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                    <span className="text-[var(--ks-kinpaku)] font-mono text-xs uppercase tracking-widest font-bold mb-1">{photo.category}</span>
                    <h3 className="font-bold text-lg leading-tight">{photo.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VİDEOLAR */}
          {activeTab === 'videolar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video, i) => (
                <div key={i} className="group bg-[#0a1628] rounded-[2rem] p-4 flex flex-col shadow-lg border border-gray-100">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 relative cursor-pointer border border-white/10">
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4 text-white">
                    <span className="text-[var(--ks-kinpaku)] font-mono text-xs uppercase tracking-widest font-bold mb-2 block">{video.category}</span>
                    <h3 className="text-2xl font-black font-condensed uppercase tracking-wide">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </FadeIn>
      </section>
    </main>
  );
}
