'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function VideoSection() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false }).limit(4);
      if (data) {
        setVideos(data);
      }
      setLoading(false);
    }
    loadVideos();
  }, []);

  if (loading || videos.length === 0) return null;

  const mainVideo = videos[0];
  const smallVideos = videos.slice(1, 4);

  return (
    <section className="bg-bg-main py-20 border-b border-bg-border/50 overflow-hidden relative">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-start mb-12"
        >
          <div className="w-8 h-[2px] bg-accent mb-4"></div>
          <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase">VİDEOLAR</h2>
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Main Video */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex-grow xl:w-2/3"
          >
            <div className="group relative rounded-2xl overflow-hidden block bg-black">
              <div className="w-full aspect-video relative">
                 {playingId === mainVideo.id ? (
                   <iframe 
                     src={`https://www.youtube.com/embed/${getYoutubeId(mainVideo.url)}?autoplay=1`} 
                     title={mainVideo.title}
                     className="absolute inset-0 w-full h-full"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen
                   ></iframe>
                 ) : (
                   <div className="cursor-pointer absolute inset-0 w-full h-full" onClick={() => setPlayingId(mainVideo.id)}>
                     <img src={mainVideo.thumbnail_url} alt={mainVideo.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                     
                     {/* Play Button Overlay */}
                     <div className="absolute bottom-4 md:bottom-6 lg:bottom-12 left-4 md:left-6 lg:left-12 right-4 flex flex-col items-start z-10">
                       <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-accent rounded-xl flex items-center justify-center mb-3 md:mb-6 shadow-lg shadow-black/50 group-hover:bg-text-main hover:text-bg-main transition-colors">
                         <Play className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-on-accent fill-current ml-1" />
                       </div>
                       <h3 className="text-text-main font-black text-lg sm:text-xl md:text-2xl lg:text-4xl uppercase tracking-tight leading-tight max-w-2xl group-hover:text-accent transition-colors drop-shadow-md line-clamp-3">
                         {mainVideo.title}
                       </h3>
                       <span className="text-text-sec font-medium text-xs sm:text-sm mt-2 md:mt-4 drop-shadow-md">
                         {(new Date(mainVideo.published_date || mainVideo.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(mainVideo.published_date || mainVideo.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(mainVideo.published_date || mainVideo.created_at).getFullYear())}
                       </span>
                     </div>
                     
                     {/* Gradient for text readability */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                   </div>
                 )}
              </div>
            </div>
          </motion.div>

          {/* Video List & Button */}
          <div className="xl:w-1/3 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              {smallVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="group flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pb-6 border-b border-bg-border/50 hover:bg-gray-800/10 rounded-lg transition-colors p-2">
                    {/* Thumb / Video */}
                    <div className="w-full sm:w-48 aspect-video bg-black rounded-xl relative overflow-hidden flex-shrink-0">
                      {playingId === video.id ? (
                         <iframe 
                           src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}?autoplay=1`} 
                           title={video.title}
                           className="absolute inset-0 w-full h-full"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowFullScreen
                         ></iframe>
                      ) : (
                        <div className="cursor-pointer absolute inset-0 w-full h-full" onClick={() => setPlayingId(video.id)}>
                          <img src={video.thumbnail_url} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute bottom-2 left-2 w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-md group-hover:bg-text-main hover:text-bg-main transition-colors z-10">
                            <Play className="w-4 h-4 text-on-accent fill-current ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col justify-center cursor-pointer" onClick={() => { if(playingId !== video.id) setPlayingId(video.id); }}>
                      <h4 className="text-text-main font-bold text-sm lg:text-base leading-tight mb-2 group-hover:text-accent transition-colors uppercase line-clamp-3">
                        {video.title}
                      </h4>
                      <span className="text-text-sec font-medium text-xs">
                        {(new Date(video.published_date || video.created_at).getDate().toString().padStart(2, '0') + '.' + (new Date(video.published_date || video.created_at).getMonth() + 1).toString().padStart(2, '0') + '.' + new Date(video.published_date || video.created_at).getFullYear())}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bütün Videolar button */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-8 flex justify-end"
            >
              <Link href="/media" className="text-text-main font-bold text-sm tracking-widest border-b-2 border-accent pb-1 hover:text-accent transition-colors uppercase">
                Bütün videolar
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
