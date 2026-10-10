'use client';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { motion } from 'framer-motion';
import { useSyncVersion } from '@/lib/siteSync';

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function Page() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const sync = useSyncVersion();
  useEffect(() => {
    async function loadVideos() {
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (data) setVideos(data);
      setLoading(false);
    }
    loadVideos();
  }, [sync]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen bg-bg-deep pt-header pb-20">
      <PageHero title="Klub mediası" subtitle="Yarımada FK-nın ən maraqlı oyun anları, məşqlər və klub daxili videoları." />
      <div className="container">
        
        {loading ? (
          <div className="h-96 border border-bg-border flex items-center justify-center rounded-2xl">
            <p className="text-accent font-bold text-lg uppercase tracking-widest animate-pulse">Yüklənir...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="h-96 border border-bg-border flex items-center justify-center rounded-2xl bg-bg-main">
            <p className="text-text-sec font-bold text-xl uppercase tracking-widest">Hələ video əlavə edilməyib</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="led-border led-hover card-fx bg-bg-main border border-bg-border rounded-2xl overflow-hidden shadow-lg flex flex-col h-full"
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
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg group-hover:bg-text-main hover:text-bg-main group-hover:scale-110 transition-all duration-300">
                          <Play className="w-5 h-5 text-on-accent fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <h3 className="text-text-main font-bold text-lg mb-3 line-clamp-2 leading-tight cursor-pointer hover:text-accent transition-colors" onClick={() => { if(playingId !== video.id) setPlayingId(video.id); }}>
                    {video.title}
                  </h3>
                  <span className="text-accent font-bold text-xs uppercase tracking-widest border-t border-bg-border pt-4 mt-auto">
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
