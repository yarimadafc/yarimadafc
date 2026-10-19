'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { type PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Crosshair, X } from 'lucide-react';
import { EDITOR_EVENT, setEditorHost, type EditorRequest } from '@/lib/imageEditor';
import { parseFocus, stripFocus, type Focus } from '@/lib/imageFocus';

// Opens for every image the admin uploads or re-edits (lib/uploadImage.ts):
// 1) crop the picture freely or to a ratio, 2) click the part that must always stay visible (face, ball...).
// The site shows photos in frames of different shapes (phone / desktop), the focus point keeps that part in view.

const RATIOS: { label: string; value: number | null }[] = [
  { label: 'Sərbəst', value: null },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
];
const FULL: PercentCrop = { unit: '%', x: 0, y: 0, width: 100, height: 100 };
const MAX_SIDE = 4000;
const CENTER: Focus = { x: 50, y: 50 };

const isFull = (c?: PercentCrop) => !c || (c.width >= 99.5 && c.height >= 99.5);

function ratioCrop(aspect: number, w: number, h: number): PercentCrop {
  const img = w / h;
  const width = aspect > img ? 100 : (aspect / img) * 100;
  const height = aspect > img ? (img / aspect) * 100 : 100;
  return { unit: '%', width, height, x: (100 - width) / 2, y: (100 - height) / 2 };
}

async function cropToFile(img: HTMLImageElement, crop: PercentCrop, type: string, name: string): Promise<File> {
  const sw = (crop.width / 100) * img.naturalWidth;
  const sh = (crop.height / 100) * img.naturalHeight;
  const scale = Math.min(1, MAX_SIDE / Math.max(sw, sh));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sw * scale));
  canvas.height = Math.max(1, Math.round(sh * scale));
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, (crop.x / 100) * img.naturalWidth, (crop.y / 100) * img.naturalHeight, sw, sh, 0, 0, canvas.width, canvas.height);
  // PNG keeps transparent logos; photos go out as near-lossless WebP (JPEG where WebP encoding is missing)
  const out = type === 'image/png' ? 'image/png' : 'image/webp';
  const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, out, 0.95))
    ?? await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.95));
  if (!blob) throw new Error('Şəkil kəsilə bilmədi');
  const ext = blob.type.split('/')[1] || 'jpg';
  return new File([blob], `${name.replace(/\.[^.]+$/, '') || 'image'}.${ext}`, { type: blob.type });
}

export default function ImageEditor() {
  const [req, setReq] = useState<EditorRequest | null>(null);
  const [src, setSrc] = useState('');
  const [canCrop, setCanCrop] = useState(true);
  const [broken, setBroken] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);
  const [crop, setCrop] = useState<PercentCrop>(FULL);
  const [focus, setFocus] = useState<Focus>(CENTER);
  const [cropped, setCropped] = useState('');
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const meta = useRef({ type: 'image/jpeg', name: 'image' });

  const objectUrl = useRef('');
  const openId = useRef(0);
  const release = useCallback(() => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); objectUrl.current = ''; }, []);

  useEffect(() => {
    setEditorHost(true);
    // load the picture as a local object URL (a remote one is downloaded first so the canvas may read it)
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<EditorRequest>).detail;
      const source = detail.source;
      release();
      setReq(prev => { prev?.resolve(null); return detail; });
      setBroken(false); setCrop(FULL); setCropped(''); setBusy(false);
      setRatio(detail.options.aspect ?? null);
      setFocus(typeof source === 'string' ? parseFocus(source) ?? CENTER : CENTER);
      const id = ++openId.current;
      const start = (url: string, crop: boolean) => { if (id === openId.current) { setSrc(url); setCanCrop(crop); } else if (url.startsWith('blob:')) URL.revokeObjectURL(url); };
      if (typeof source === 'string') {
        setSrc('');
        fetch(stripFocus(source), { mode: 'cors' })
          .then(r => (r.ok ? r.blob() : Promise.reject()))
          .then(b => {
            if (id !== openId.current) return;
            meta.current = { type: b.type, name: 'image' };
            objectUrl.current = URL.createObjectURL(b);
            start(objectUrl.current, true);
          })
          .catch(() => start(stripFocus(source), false));
      } else {
        meta.current = { type: source.type, name: source.name };
        objectUrl.current = URL.createObjectURL(source);
        start(objectUrl.current, true);
      }
    };
    window.addEventListener(EDITOR_EVENT, onOpen);
    return () => { setEditorHost(false); window.removeEventListener(EDITOR_EVENT, onOpen); release(); };
  }, [release]);

  // live preview of the cropped part (used for the focus picker and the frame previews)
  const cropping = canCrop && !broken && !isFull(crop);
  useEffect(() => {
    const img = imgRef.current;
    if (!cropping || !img?.naturalWidth) return;
    let cancelled = false;
    const t = setTimeout(() => {
      cropToFile(img, crop, 'image/jpeg', 'preview').then(f => {
        if (cancelled) return;
        const url = URL.createObjectURL(f);
        setCropped(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
      }).catch(() => {});
    }, 200);
    return () => { cancelled = true; clearTimeout(t); };
  }, [crop, cropping, src]);
  const preview = cropping && cropped ? cropped : src;

  const close = useCallback((result: Parameters<EditorRequest['resolve']>[0]) => {
    req?.resolve(result);
    openId.current++;
    setReq(null); setSrc(''); setBusy(false);
    setCropped(prev => { if (prev) URL.revokeObjectURL(prev); return ''; });
    release();
  }, [req, release]);

  useEffect(() => {
    if (!req) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [req, close]);

  const pickRatio = (value: number | null) => {
    setRatio(value);
    const img = imgRef.current;
    if (!img?.naturalWidth) return;
    setCrop(value ? ratioCrop(value, img.naturalWidth, img.naturalHeight) : FULL);
  };

  const onImageLoad = () => {
    const img = imgRef.current;
    if (img && ratio) setCrop(ratioCrop(ratio, img.naturalWidth, img.naturalHeight));
  };

  const pickFocus = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setFocus({ x: Math.round(((e.clientX - r.left) / r.width) * 100), y: Math.round(((e.clientY - r.top) / r.height) * 100) });
  };

  const apply = async () => {
    if (!req) return;
    const original = typeof req.source === 'string' ? null : req.source;
    const img = imgRef.current;
    if (broken || !canCrop || !img || isFull(crop)) return close({ file: original, focus });
    setBusy(true);
    try {
      close({ file: await cropToFile(img, crop, meta.current.type, meta.current.name), focus });
    } catch {
      close({ file: original, focus });
    }
  };

  if (!req) return null;
  const pos = { objectPosition: `${focus.x}% ${focus.y}%` };

  return (
    <div className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6" role="dialog" aria-modal="true" aria-label="Şəkli redaktə et">
      <div className="w-full max-w-6xl max-h-full overflow-y-auto bg-gray-800 border border-gray-700 rounded-2xl text-white shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div>
            <h3 className="font-black uppercase tracking-widest text-sm">Şəkli redaktə et</h3>
            <p className="text-gray-400 text-xs mt-1">1) Lazım olan hissəni kəsin. 2) Sağda şəklin ən vacib yerinə (üz, top) klikləyin — sayt həmin hissəni həmişə göstərəcək.</p>
          </div>
          <button onClick={() => close(null)} className="p-2 text-gray-400 hover:text-white" aria-label="Bağla"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid lg:grid-cols-[1fr_20rem] gap-5 p-5">
          <div className="min-w-0">
            {canCrop && !broken && (
              <div className="flex flex-wrap gap-2 mb-3">
                {RATIOS.map(r => (
                  <button key={r.label} type="button" onClick={() => pickRatio(r.value)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${ratio === r.value ? 'bg-accent text-on-accent border-accent' : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-accent'}`}>{r.label}</button>
                ))}
                <button type="button" onClick={() => { setRatio(null); setCrop(FULL); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-gray-900 border-gray-700 text-gray-300 hover:border-accent">Bütün şəkil</button>
              </div>
            )}
            <div className="bg-gray-950 rounded-xl border border-gray-700 flex items-center justify-center min-h-[240px] p-2">
              {!src ? (
                <span className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">Yüklənir...</span>
              ) : broken ? (
                <p className="text-gray-400 text-sm text-center p-6">Bu formatı brauzer göstərə bilmir (məs. HEIC). Şəkil olduğu kimi yüklənəcək.</p>
              ) : canCrop ? (
                <ReactCrop crop={crop} onChange={(_, pc) => setCrop(pc)} aspect={ratio ?? undefined} keepSelection ruleOfThirds minWidth={40} minHeight={40}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={imgRef} src={src} alt="" onLoad={onImageLoad} onError={() => setBroken(true)} className="max-h-[60vh] w-auto max-w-full" />
                </ReactCrop>
              ) : (
                <div className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={imgRef} src={src} alt="" onError={() => setBroken(true)} className="max-h-[50vh] w-auto max-w-full mx-auto" />
                  <p className="text-amber-400 text-xs mt-3">Bu şəkil başqa serverdədir, ona görə yalnız vacib hissə seçilə bilər. Kəsmək üçün şəkli yenidən yükləyin.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><Crosshair className="w-3.5 h-3.5" /> Vacib hissə (klikləyin)</p>
              <div onPointerDown={pickFocus} className="relative rounded-lg overflow-hidden border border-gray-700 cursor-crosshair select-none touch-none bg-gray-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {preview && <img src={preview} alt="" draggable={false} className="w-full h-auto block pointer-events-none" />}
                <span className="absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,.6)] bg-accent/40 pointer-events-none" style={{ left: `${focus.x}%`, top: `${focus.y}%` }} />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Saytda belə görünəcək</p>
              <div className="grid grid-cols-[3fr_4fr] gap-2 items-start">
                <figure>
                  <div className="aspect-[3/4] rounded-md overflow-hidden bg-gray-950 border border-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {preview && <img src={preview} alt="" className="w-full h-full object-cover" style={pos} />}
                  </div>
                  <figcaption className="text-[10px] text-gray-500 mt-1 text-center">Telefon</figcaption>
                </figure>
                <div className="space-y-2">
                  <figure>
                    <div className="aspect-[2.2/1] rounded-md overflow-hidden bg-gray-950 border border-gray-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {preview && <img src={preview} alt="" className="w-full h-full object-cover" style={pos} />}
                    </div>
                    <figcaption className="text-[10px] text-gray-500 mt-1 text-center">Kompüter</figcaption>
                  </figure>
                  <figure>
                    <div className="aspect-square w-2/3 mx-auto rounded-md overflow-hidden bg-gray-950 border border-gray-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {preview && <img src={preview} alt="" className="w-full h-full object-cover" style={pos} />}
                    </div>
                    <figcaption className="text-[10px] text-gray-500 mt-1 text-center">Kvadrat</figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-4 border-t border-gray-700">
          <button type="button" onClick={() => close(null)} className="px-5 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-widest">Ləğv et</button>
          <button type="button" disabled={busy || !src} onClick={apply} className="px-6 py-3 rounded-lg bg-accent text-on-accent text-xs font-bold uppercase tracking-widest disabled:opacity-50">{busy ? 'Hazırlanır...' : 'Yadda saxla'}</button>
        </div>
      </div>
    </div>
  );
}
