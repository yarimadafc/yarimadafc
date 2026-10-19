'use client';
import { useState } from 'react';
import { Crop } from 'lucide-react';
import { editImageUrl, type UploadOptions } from '@/lib/uploadImage';

// "Edit" next to an already uploaded picture: re-crop it or change the part that must stay visible.
export default function EditImageButton({ url, onChange, options, className = '' }: {
  url?: string | null;
  onChange: (url: string) => void | Promise<void>;
  options?: UploadOptions;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  if (!url) return null;
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const next = await editImageUrl(url, options);
        if (next && next !== url) await onChange(next);
        setBusy(false);
      }}
      className={`inline-flex items-center gap-1.5 bg-gray-900 border border-gray-700 hover:border-accent text-gray-300 hover:text-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${className}`}
      title="Şəkli kəs və ya vacib hissəni seç"
    >
      <Crop className="w-3.5 h-3.5" />
      <span>{busy ? '...' : 'Redaktə et'}</span>
    </button>
  );
}
