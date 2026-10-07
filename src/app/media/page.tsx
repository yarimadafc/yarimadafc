'use client';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function Page() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (data) setVideos(data);
      setLoading(false);
    }
    loadVideos();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen bg-[#000000] pt-[140px] pb-20">
      <div className="w-full bg-[#141414] py-12 md:py-16 border-b border-gray-800 relative overflow-hidden ">
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            KLUB <span className="text-[#d7bf7b]">MEDİASI</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d7bf7b] mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Yarımada FK-nın ən maraqlı oyun anları, məşqlər və klub daxili videoları.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8">
        
        {loading ? (
          <div className="h-96 border border-gray-800 flex items-center justify-center rounded-2xl">
            <p className="text-[#d7bf7b] font-bold text-lg uppercase tracking-widest animate-pulse">Yüklənir...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="h-96 border border-gray-800 flex items-center justify-center rounded-2xl bg-[#0a0a0a]">
            <p className="text-gray-500 font-bold text-xl uppercase tracking-widest">Hələ video əlavə edilməyib</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col"
              >
                <div className="w-full aspect-video bg-black relative flex-shrink-0">
                  {playingId === video.id ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}?autoplay=1`} 
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="cursor-pointer absolute inset-0 w-full h-full group" onClick={() => setPlayingId(video.id)}>
                      <img src={video.thumbnail_url} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#d7bf7b] rounded-full flex items-center justify-center shadow-lg group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                          <Play className="w-5 h-5 text-[#141414] fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 leading-tight cursor-pointer hover:text-[#d7bf7b] transition-colors" onClick={() => { if(playingId !== video.id) setPlayingId(video.id); }}>
                    {video.title}
                  </h3>
                  <span className="text-[#d7bf7b] font-bold text-xs uppercase tracking-widest border-t border-gray-800 pt-4 mt-auto">
                    {(new Date(video.published_date || video.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(video.published_date || video.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(video.published_date || video.created_at).getFullYear())}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

          </div>
      </div>
    </motion.div>
  );
}
