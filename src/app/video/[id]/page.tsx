'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { useSyncVersion } from '@/lib/siteSync';

const youtubeId = (url?: string) => {
  const m = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return m && m[2].length === 11 ? m[2] : null;
};

export default function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sync = useSyncVersion();
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('videos').select('*').eq('id', id).maybeSingle();
      setVideo(data);
      setLoading(false);
    }
    load();
  }, [id, sync]);

  const yt = youtubeId(video?.url);

  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title={loading ? '...' : video?.title || 'Video tapılmadı'} />
      <div className="container">
        {yt ? (
          <div className="led-border rounded-2xl overflow-hidden bg-black aspect-video w-full max-w-5xl mx-auto">
            <iframe src={`https://www.youtube.com/embed/${yt}`} title={video.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        ) : !loading && (
          <div className="rounded-xl border border-bg-border bg-bg-sec py-20 text-center text-text-sec">Bu video mövcud deyil.</div>
        )}
        <Link href="/media" className="btn-fx inline-block mt-8 border border-bg-border rounded-xl px-6 py-3 font-semibold text-text-main hover:border-accent">← Bütün videolar</Link>
      </div>
    </div>
  );
}
