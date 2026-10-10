'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSyncVersion } from '@/lib/siteSync';

// Admin-editable texts live in site_images (section_key -> image_url, the table doubles as a key/value store).
// Pass the defaults; an empty or missing value in the database falls back to the default.

export const CONTACT_DEFAULTS = {
  contact_phone: '055 447 74 67',
  contact_email: 'info@yarimadafc.com',
  contact_address: 'Kristal Abşeron 1, Xırdalan şəhəri',
};

export const TICKETS_DEFAULTS = {
  tickets_title: 'Biletlər',
  tickets_subtitle: 'Qarşıdakı oyunlar üçün bilet sifarişini WhatsApp vasitəsilə birbaşa klub ilə əlaqə saxlayaraq verə bilərsiniz.',
  tickets_whatsapp: '',
  tickets_empty: 'Hazırda bilet satışı üçün təyin olunmuş oyun yoxdur.',
};

export function useSiteTexts<T extends Record<string, string>>(defaults: T): T {
  const sync = useSyncVersion();
  const [values, setValues] = useState<T>(defaults);
  const keys = Object.keys(defaults).join(',');
  useEffect(() => {
    let cancelled = false;
    supabase.from('site_images').select('section_key, image_url').in('section_key', keys.split(',')).then(({ data }) => {
      if (cancelled || !data) return;
      const next = { ...defaults };
      data.forEach((r: { section_key: string; image_url: string | null }) => {
        if (r.image_url && r.image_url.trim()) (next as Record<string, string>)[r.section_key] = r.image_url;
      });
      setValues(next);
    });
    return () => { cancelled = true; };
    // defaults are module constants; keys covers their identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync, keys]);
  return values;
}

/** "055 447 74 67" -> "+994554477467" (for tel: links) */
export function telHref(phone: string): string {
  let d = phone.replace(/[^\d+]/g, '');
  if (d.startsWith('+')) return `tel:${d}`;
  if (d.startsWith('994')) return `tel:+${d}`;
  if (d.startsWith('0')) d = d.slice(1);
  return `tel:+994${d}`;
}

/** Digits for wa.me links ("055 447 74 67" -> "994554477467"); empty when no number is given. */
export function waNumber(phone: string): string {
  const href = telHref(phone);
  return phone.trim() ? href.replace(/\D/g, '') : '';
}
