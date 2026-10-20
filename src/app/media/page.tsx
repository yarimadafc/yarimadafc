'use client';
import { Play, Image as ImageIcon, Video, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { motion } from 'framer-motion';
import { useSyncVersion } from '@/lib/siteSync';
import { focusStyle } from '@/lib/imageFocus';

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

type Photo = { id: string; title: string | null; image_url: string; thumb_url: string | null; created_at: string };

const preload = (src?: string) => { if (src) { const img = new Image(); img.decoding = 'async'; img.src = src; } };

// Full-screen viewer: original-quality photo, arrows / keyboard / swipe, neighbours preloaded.
function Lightbox({ photos, index, onClose, onIndex }: { photos: Photo[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const photo = photos[index];
  const [loaded, setLoaded] = useState(false);
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => { setLoaded(false); onIndex((index + d + photos.length) % photos.length); }, [index, photos.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [go, onClose]);

  useEffect(() => {
    if (photos.length < 2) return;
    preload(photos[(index + 1) % photos.length]?.image_url);
    preload(photos[(index - 1 + photos.length) % photos.length]?.image_url);
  }, [index, photos]);

  if (!photo) return null;
  return (
    <div
      role="dialog" aria-modal="true" aria-label={photo.title || 'Şəkil'}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center select-none"
      onClick={onClose}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <button type="button" aria-label="Bağla" onClick={onClose} className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><X className="w-6 h-6" /></button>
      {photos.length > 1 && (
        <>
          <button type="button" aria-label="Əvvəlki" onClick={e => { e.stopPropagation(); go(-1); }} className="absolute left-2 md:left-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white hidden sm:flex items-center justify-center"><ChevronLeft className="w-6 h-6" /></button>
          <button type="button" aria-label="Növbəti" onClick={e => { e.stopPropagation(); go(1); }} className="absolute right-2 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white hidden sm:flex items-center justify-center"><ChevronRight className="w-6 h-6" /></button>
        </>
      )}
      <figure className="relative max-w-[94vw] max-h-[88vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
        {/* the light grid copy is shown instantly (already cached), the original fades in over it */}
        {!loaded && photo.thumb_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.thumb_url} alt="" aria-hidden className="max-w-[94vw] max-h-[82vh] object-contain blur-[2px]" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.id}
          src={photo.image_url}
          alt={photo.title || ''}
          decoding="async"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          className={`max-w-[94vw] max-h-[82vh] object-contain ${loaded || !photo.thumb_url ? '' : 'absolute inset-0 opacity-0'}`}
        />
        <figcaption className="mt-3 text-white/80 text-sm text-center px-4">
          {photo.title && <span className="font-semibold text-white">{photo.title}</span>}
          {photos.length > 1 && <span className="ml-3 text-white/50 text-xs">{index + 1} / {photos.length}</span>}
        </figcaption>
      </figure>
    </div>
  );
}

export default function Page() {
  const [videos, setVideos] = useState<any[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [tab, setTab] = useState<'photos' | 'videos' | null>(null);
  const [viewer, setViewer] = useState<number | null>(null);

  const sync = useSyncVersion();
  useEffect(() => {
    async function loadMedia() {
      const [v, p] = await Promise.all([
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery_photos').select('id, title, image_url, thumb_url, created_at').order('created_at', { ascending: false }),
      ]);
      if (v.data) setVideos(v.data);
      // until the gallery table exists the page simply shows the videos
      if (p.data) setPhotos(p.data);
      setTab(prev => prev ?? ((p.data?.length ?? 0) === 0 && (v.data?.length ?? 0) > 0 ? 'videos' : 'photos'));
      setLoading(false);
    }
    loadMedia();
  }, [sync]);

  const closeViewer = useCallback(() => setViewer(null), []);
  const tabBtn = (active: boolean) => `inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest border transition-colors ${active ? 'bg-accent text-on-accent border-accent' : 'bg-bg-main text-text-sec border-bg-border hover:text-text-main'}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen bg-bg-deep pt-header pb-20">
      <PageHero title="Klub mediası" subtitle="Yarımada FK-nın ən maraqlı oyun anları, məşqlər və klub daxili videoları." />
      <div className="container">
        <div className="flex gap-3 mb-8" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'photos'} onClick={() => setTab('photos')} className={tabBtn(tab === 'photos')}><ImageIcon className="w-4 h-4" /> Şəkillər</button>
          <button type="button" role="tab" aria-selected={tab === 'videos'} onClick={() => setTab('videos')} className={tabBtn(tab === 'videos')}><Video className="w-4 h-4" /> Videolar</button>
        </div>

        {loading ? (
          <div className="h-96 border border-bg-border flex items-center justify-center rounded-2xl">
            <p className="text-accent font-bold text-lg uppercase tracking-widest animate-pulse">Yüklənir...</p>
          </div>
        ) : tab === 'photos' ? (
          photos.length === 0 ? (
            <div className="h-96 border border-bg-border flex items-center justify-center rounded-2xl bg-bg-main">
              <p className="text-text-sec font-bold text-xl uppercase tracking-widest">Hələ şəkil əlavə edilməyib</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setViewer(i)}
                  onMouseEnter={() => preload(photo.image_url)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl md:rounded-2xl border border-bg-border bg-bg-main led-hover"
                  aria-label={photo.title || 'Şəkli böyüt'}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.thumb_url || photo.image_url}
                    alt={photo.title || ''}
                    loading={i < 8 ? 'eager' : 'lazy'}
                    fetchPriority={i < 4 ? 'high' : 'auto'}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {photo.title && (
                    <span className="absolute inset-x-0 bottom-0 p-2 md:p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs md:text-sm font-semibold text-left line-clamp-2">{photo.title}</span>
                  )}
                </button>
              ))}
            </div>
          )
        ) : videos.length === 0 ? (
          <div className="h-96 border border-bg-border flex items-center justify-center rounded-2xl bg-bg-main">
            <p className="text-text-sec font-bold text-xl uppercase tracking-widest">Hələ video əlavə edilməyib</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                      <img src={video.thumbnail_url} style={focusStyle(video.thumbnail_url)} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg group-hover:bg-text-main hover:text-bg-main group-hover:scale-110 transition-all duration-300">
                          <Play className="w-4 h-4 text-on-accent fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <h3 className="text-text-main font-bold text-sm md:text-base mb-3 line-clamp-2 leading-tight cursor-pointer hover:text-accent transition-colors" onClick={() => { if(playingId !== video.id) setPlayingId(video.id); }}>
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
      {viewer !== null && <Lightbox photos={photos} index={viewer} onClose={closeViewer} onIndex={setViewer} />}
    </motion.div>
  );
}
