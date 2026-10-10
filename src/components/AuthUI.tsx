'use client';
import { useLang } from '@/lib/i18n';

export const inputCls = 'w-full bg-bg-main text-text-main border border-bg-border rounded-xl px-4 py-3 text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_18%,transparent)] transition-all placeholder:text-text-sec/70 disabled:opacity-60';

export function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  const { t } = useLang();
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-text-sec mb-2">{t(label)}{required && <span className="text-accent"> *</span>}</span>
      {children}
      {hint && <span className="block mt-1.5 text-xs text-text-sec">{t(hint)}</span>}
    </label>
  );
}

export function Notice({ kind, children }: { kind: 'error' | 'success'; children: React.ReactNode }) {
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${kind === 'error' ? 'border-red-500/40 bg-red-500/10 text-red-500' : 'border-green-500/40 bg-green-500/10 text-green-500'}`}>
      {children}
    </div>
  );
}

export function AuthCard({ children }: { children: React.ReactNode }) {
  return <div className="led-border bg-bg-sec rounded-3xl border border-bg-border p-6 md:p-10 max-w-3xl mx-auto">{children}</div>;
}
