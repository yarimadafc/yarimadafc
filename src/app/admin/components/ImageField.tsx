'use client';
import { useState } from 'react';
import { Crop, ImageIcon, Trash2, UploadCloud } from 'lucide-react';
import { editImageUrl, uploadFromInput, type UploadOptions } from '@/lib/uploadImage';
import { focusStyle } from '@/lib/imageFocus';

// One image control for every admin form: preview + "Choose" / "Edit" (crop, important part) / "Remove".
// Buttons are always visible (no hover-only delete), so it works the same on phones.
const SHAPES = {
  wide: 'w-full max-w-sm aspect-video',
  portrait: 'w-28 aspect-[3/4]',
  square: 'w-24 aspect-square',
  logo: 'w-16 aspect-square rounded-full bg-white',
} as const;

export default function ImageField({ label, hint, value, onChange, options, shape = 'wide', contain = false, onBusy }: {
  label?: string;
  hint?: string;
  value?: string | null;
  onChange: (url: string) => void | Promise<void>;
  options?: UploadOptions;
  shape?: keyof typeof SHAPES;
  /** show the whole picture in the preview (logos) */
  contain?: boolean;
  onBusy?: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const run = async (task: () => Promise<string | null>) => {
    setBusy(true); onBusy?.(true);
    try {
      const url = await task();
      if (url && url !== value) await onChange(url);
    } finally {
      setBusy(false); onBusy?.(false);
    }
  };
  const btn = 'inline-flex items-center gap-1.5 bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50';

  return (
    <div>
      {label && <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{label}</label>}
      <div className="flex flex-wrap items-center gap-3">
        <div className={`${SHAPES[shape]} shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 flex items-center justify-center`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className={`w-full h-full ${contain ? 'object-contain p-1' : 'object-cover'}`} style={contain ? undefined : focusStyle(value)} />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-600" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className={`${btn} cursor-pointer text-white hover:border-accent ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{busy ? 'Yüklənir...' : value ? 'Dəyiş' : 'Şəkil seç'}</span>
            <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={e => run(() => uploadFromInput(e, options))} />
          </label>
          {value && (
            <>
              <button type="button" disabled={busy} onClick={() => run(() => editImageUrl(value, options))} className={`${btn} text-gray-300 hover:text-white hover:border-accent`}>
                <Crop className="w-3.5 h-3.5" /><span>Redaktə et</span>
              </button>
              <button type="button" disabled={busy} onClick={() => { if (confirm('Şəkil silinsin?')) onChange(''); }} className={`${btn} text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500`}>
                <Trash2 className="w-3.5 h-3.5" /><span>Sil</span>
              </button>
            </>
          )}
        </div>
      </div>
      {hint && <p className="text-gray-500 text-[11px] mt-2">{hint}</p>}
    </div>
  );
}
