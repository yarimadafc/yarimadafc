'use client';

import { useState } from 'react';
import { isYarimada } from '@/lib/matchUtils';
import { useTeamLogos } from '@/lib/teamLogos';

interface Props {
  name?: string | null;
  logo?: string | null;
  size?: number;
  className?: string;
}

// Round club crest everywhere. Uploaded logos are drawn at 70% so even a square crest stays fully
// inside the circle (a square fits a circle only up to 1/√2 ≈ 70.7% of its diameter). Source order: logo passed in (e.g. the match's own upload) ->
// club-wide logo registry -> Yarımada crest -> initials. A broken image falls back too.
export default function TeamLogo({ name, logo, size = 40, className = '' }: Props) {
  const logoFor = useTeamLogos();
  const [failed, setFailed] = useState<string | null>(null);
  const style = { width: size, height: size };
  const src = [logo, logoFor(name), isYarimada(name) ? '/Logo.JPG.jpeg' : null].find(u => u && u !== failed);

  if (src) {
    const own = src === '/Logo.JPG.jpeg';
    return (
      <span data-no-fallback style={style} className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-black/10 shadow-sm ${className}`}>
        <img
          src={src}
          alt={name || ''}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(src)}
          className={own ? 'h-full w-full object-cover' : 'h-[70%] w-[70%] object-contain'}
        />
      </span>
    );
  }
  return (
    <span
      style={{ ...style, fontSize: Math.max(10, size / 3) }}
      className={`rounded-full bg-bg-card ring-1 ring-bg-border text-text-sec font-bold inline-flex items-center justify-center shrink-0 uppercase ${className}`}
      aria-label={name || ''}
    >
      {(name || '?').trim().slice(0, 2)}
    </span>
  );
}
