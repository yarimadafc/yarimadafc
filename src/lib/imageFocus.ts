import type { CSSProperties } from 'react';

// The "important part" of a photo (face, ball...) is stored in the image URL fragment: `...jpg#f=50,20`
// (x,y in percent). Browsers never send the fragment to the server, so the image loads as before and no
// database column is needed. Every place that crops a photo with object-cover keeps that point visible.
export type Focus = { x: number; y: number };

const RE = /#f=(\d{1,3}(?:\.\d+)?),(\d{1,3}(?:\.\d+)?)$/;
const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

export function parseFocus(url?: string | null): Focus | null {
  const m = url ? RE.exec(url) : null;
  return m ? { x: clamp(Number(m[1])), y: clamp(Number(m[2])) } : null;
}

export const stripFocus = (url: string) => url.replace(RE, '');

export function withFocus(url: string, focus: Focus | null): string {
  const base = stripFocus(url);
  if (!focus || (focus.x === 50 && focus.y === 50)) return base;
  return `${base}#f=${clamp(focus.x)},${clamp(focus.y)}`;
}

/** Inline style for an object-cover <img>; undefined when the photo has no saved focus point. */
export function focusStyle(url?: string | null): CSSProperties | undefined {
  const f = parseFocus(url);
  return f ? { objectPosition: `${f.x}% ${f.y}%` } : undefined;
}

/** Same for a CSS background photo. */
export function bgStyle(url: string): CSSProperties {
  const f = parseFocus(url);
  return { backgroundImage: `url("${url.replace(/"/g, '%22')}")`, ...(f ? { backgroundPosition: `${f.x}% ${f.y}%` } : {}) };
}
