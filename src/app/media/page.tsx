import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'





export default async function MediaPage({
  searchParams
}: {
  searchParams: { tab?: string }
}) {
  const currentTab = searchParams.tab || 'photos';

  let photos = [];
  let videos = [];

  try {
    if (currentTab === 'photos') {
      const { data, error } = await supabase.from('media_photos').select('*');
      if (data && !error && data.length > 0) photos = data;
    } else {
      const { data, error } = await supabase.from('media_videos').select('*');
      if (data && !error && data.length > 0) videos = data;
    }
  } catch (error) {
    console.error("Error fetching media:", error);
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#0a1628] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-center mb-12">
          Media
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1">
            <Link 
              href="?tab=photos" 
              className={`px-8 py-3 rounded-md font-bold uppercase tracking-wide transition-colors ${
                currentTab === 'photos' 
                  ? 'bg-[#0a1628] text-[#c9a84c]' 
                  : 'text-gray-500 hover:text-[#0a1628]'
              }`}
            >
              Fotolar
            </Link>
            <Link 
              href="?tab=videos" 
              className={`px-8 py-3 rounded-md font-bold uppercase tracking-wide transition-colors ${
                currentTab === 'videos' 
                  ? 'bg-[#0a1628] text-[#c9a84c]' 
                  : 'text-gray-500 hover:text-[#0a1628]'
              }`}
            >
              Videolar
            </Link>
          </div>
        </div>

        {/* Content */}
        {currentTab === 'photos' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {photo.url ? (
                    <Image src={photo.url} alt={photo.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl mb-2">📸</span>
                      <span className="uppercase text-xs font-bold tracking-widest">{photo.category}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-bold text-lg">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-800 relative group cursor-pointer">
                  {video.thumbnail ? (
                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <span className="text-5xl mb-2 text-white/50 group-hover:text-white transition-colors">▶</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-[#c9a84c] text-[#0a1628] px-2 py-1 rounded text-xs font-bold uppercase tracking-wider z-10">
                    {video.category}
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-bold text-lg leading-snug hover:text-[#0a1628]/80 cursor-pointer">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
