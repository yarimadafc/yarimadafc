'use client';
import { useEffect, useState } from 'react';

type Toast = { id: number; kind: 'success' | 'error'; message: string };

// Shows the result of every admin database write (see lib/adminDb.ts).
export default function AdminToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const onToast = (e: Event) => {
      const { kind, message } = (e as CustomEvent).detail;
      const id = Date.now() + Math.random();
      setToasts(t => [...t.slice(-3), { id, kind, message }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), kind === 'error' ? 7000 : 2500);
    };
    window.addEventListener('admin-toast', onToast);
    return () => window.removeEventListener('admin-toast', onToast);
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-3 rounded-lg shadow-2xl text-sm font-bold text-white ${t.kind === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {t.kind === 'error' ? 'Xəta: ' : '✓ '}{t.message}
        </div>
      ))}
    </div>
  );
}
