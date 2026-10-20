'use client';
import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Trash2, UploadCloud, Video, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { adminDb, toast } from '@/lib/adminDb';
import { uploadGalleryPhoto } from '@/lib/uploadImage';
import VideosAdmin from './VideosAdmin';

// "Foto və video" page: photos and videos are added separately, from one section.
// Photos -> ImgBB (Supabase Storage fallback), their URLs/captions -> Supabase table gallery_photos.
type Photo = { id: string; title: string | null; image_url: string; thumb_url: string | null; created_at: string };

const CONCURRENCY = 2;

function PhotosAdmin() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState<{ done: number; total: number; failed: number } | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchPhotos() {
    const { data, error } = await supabase.from('gallery_photos').select('*').order('created_at', { ascending: false });
    if (error) setLoadError(error.message);
    else { setLoadError(null); setPhotos(data || []); }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
    fetchPhotos();
  }, []);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length || progress) return;

    const title = caption.trim() || null;
    const state = { done: 0, total: files.length, failed: 0 };
    setProgress({ ...state });
    const errors: string[] = [];
    const queue = [...files];

    // each photo is saved as soon as it is uploaded, so one failure never loses the others
    const worker = async () => {
      for (let file = queue.shift(); file; file = queue.shift()) {
        try {
          const img = await uploadGalleryPhoto(file);
          const { error } = await adminDb.from('gallery_photos').insert({
            title, image_url: img.url, thumb_url: img.thumb, width: img.width, height: img.height,
          }).silent();
          if (error) throw new Error(error.message);
        } catch (err) {
          state.failed++;
          errors.push(`${file.name}: ${(err as Error).message}`);
        }
        state.done++;
        setProgress({ ...state });
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));

    const ok = state.total - state.failed;
    if (ok) toast('success', `${ok} şəkil əlavə olundu`);
    if (errors.length) toast('error', errors.slice(0, 3).join(' | '));
    setProgress(null);
    if (ok) setCaption('');
    fetchPhotos();
  };

  const saveTitle = async (p: Photo) => {
    const value = (drafts[p.id] ?? p.title ?? '').trim();
    if (value === (p.title ?? '')) return;
    const { error } = await adminDb.from('gallery_photos').update({ title: value || null }).eq('id', p.id);
    if (!error) {
      setPhotos(prev => prev.map(x => (x.id === p.id ? { ...x, title: value || null } : x)));
      setDrafts(prev => { const next = { ...prev }; delete next[p.id]; return next; });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu şəkli silmək istədiyinizə əminsiniz?')) return;
    const { error } = await adminDb.from('gallery_photos').delete().eq('id', id);
    if (!error) setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const busy = !!progress;

  return (
    <div>
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 space-y-4">
        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Şəkil başlığı (istəyə bağlı)</label>
          <input type="text" value={caption} onChange={e => setCaption(e.target.value)} disabled={busy} placeholder="Məs.: U-13 — məşq, oktyabr 2026" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-accent outline-none disabled:opacity-50" />
          <p className="text-gray-500 text-[11px] mt-1">Bir dəfəyə seçilən bütün şəkillərə eyni başlıq yazılır; sonra hər birini ayrıca dəyişmək olar.</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        <button type="button" disabled={busy || !!loadError} onClick={() => inputRef.current?.click()} className="w-full bg-accent text-on-accent py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-text-main hover:text-bg-main transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          <UploadCloud className="w-4 h-4" />
          {progress ? `Yüklənir... ${progress.done}/${progress.total}` : 'Şəkil seç və yüklə (bir neçə şəkil seçmək olar)'}
        </button>
        {progress && (
          <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center text-accent py-10">Yüklənir...</div>
      ) : loadError ? (
        <div className="text-center text-red-400 py-10 text-sm">
          Fotoqalereya cədvəli tapılmadı. Supabase SQL Editor-da <code className="text-white">supabase/2026-10-21_gallery_photos.sql</code> faylını işə salın.
          <div className="text-gray-500 text-xs mt-2">{loadError}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(p => {
            const draft = drafts[p.id] ?? p.title ?? '';
            const dirty = draft.trim() !== (p.title ?? '');
            return (
              <div key={p.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col">
                <a href={p.image_url} target="_blank" rel="noreferrer" className="block aspect-[4/3] bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.thumb_url || p.image_url} alt={p.title || ''} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </a>
                <div className="p-3 flex-1 flex flex-col gap-2">
                  <div className="flex gap-1">
                    <input type="text" value={draft} placeholder="Başlıq" onChange={e => setDrafts(prev => ({ ...prev, [p.id]: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') saveTitle(p); }} className="flex-1 min-w-0 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-xs focus:border-accent outline-none" />
                    {dirty && (
                      <button type="button" onClick={() => saveTitle(p)} aria-label="Başlığı saxla" className="px-2 rounded-lg bg-accent text-on-accent"><Check className="w-4 h-4" /></button>
                    )}
                  </div>
                  <button onClick={() => handleDelete(p.id)} className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 py-2 rounded-lg transition-colors text-xs font-bold uppercase">
                    <Trash2 className="w-4 h-4" /> <span>Sil</span>
                  </button>
                </div>
              </div>
            );
          })}
          {photos.length === 0 && <div className="col-span-full text-center text-gray-400 py-10">Hələ şəkil əlavə edilməyib.</div>}
        </div>
      )}
    </div>
  );
}

export default function GalleryAdmin() {
  const [tab, setTab] = useState<'photos' | 'videos'>('photos');
  const tabBtn = (active: boolean) => `flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${active ? 'bg-accent text-on-accent' : 'bg-gray-800 text-gray-300 hover:text-white'}`;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Fotoqalereya</h2>
        <p className="text-gray-400 text-sm mb-4">«Foto və video» səhifəsi: şəkilləri və videoları ayrı-ayrılıqda əlavə edin.</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setTab('photos')} className={tabBtn(tab === 'photos')}><ImageIcon className="w-4 h-4" /> Şəkillər</button>
          <button type="button" onClick={() => setTab('videos')} className={tabBtn(tab === 'videos')}><Video className="w-4 h-4" /> Videolar</button>
        </div>
      </div>
      {tab === 'photos' ? <PhotosAdmin /> : <VideosAdmin />}
    </div>
  );
}
