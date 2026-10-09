'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export interface Field {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'date' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface Props {
  fields: Field[];
  /** Message header line written before the field values. */
  intro: string;
  submitLabel: string;
  phone?: string;
}

const inputCls = 'w-full bg-bg-main text-text-main border border-bg-border rounded-xl px-4 py-3 text-base focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_18%,transparent)] transition-all placeholder:text-text-sec/70';

// Static-site friendly form: composes the message and opens WhatsApp chat with the club.
export default function WhatsAppForm({ fields, intro, submitLabel, phone = '994554477467' }: Props) {
  const { t } = useLang();
  const [values, setValues] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = fields.map(f => `${f.label}: ${values[f.name] || '-'}`);
    const text = `${intro}\n\n${lines.join('\n')}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {fields.map(f => (
        <label key={f.name} className="block">
          <span className="block text-sm font-semibold text-text-sec mb-2">{t(f.label)}{f.required && <span className="text-accent"> *</span>}</span>
          {f.type === 'textarea' ? (
            <textarea rows={5} required={f.required} placeholder={f.placeholder ? t(f.placeholder) : undefined} className={inputCls} value={values[f.name] || ''} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} />
          ) : f.type === 'select' ? (
            <select required={f.required} className={inputCls} value={values[f.name] || ''} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))}>
              <option value="">{t('Seçin...')}</option>
              {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input type={f.type || 'text'} required={f.required} placeholder={f.placeholder ? t(f.placeholder) : undefined} className={inputCls} value={values[f.name] || ''} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} />
          )}
        </label>
      ))}
      <button type="submit" className="btn-fx led-border w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-8 py-3.5 rounded-xl">
        <Send className="w-4 h-4" /> {t(submitLabel)}
      </button>
    </form>
  );
}
