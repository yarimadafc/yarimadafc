import { isYarimada } from '@/lib/matchUtils';

interface Props {
  name?: string | null;
  logo?: string | null;
  size?: number;
  className?: string;
}

// Club crest with graceful fallbacks: uploaded logo -> Yarımada crest -> initials.
export default function TeamLogo({ name, logo, size = 40, className = '' }: Props) {
  const style = { width: size, height: size };
  if (logo) {
    return <img src={logo} alt={name || ''} loading="lazy" style={style} className={`object-contain shrink-0 ${className}`} />;
  }
  if (isYarimada(name)) {
    return <img src="/Logo.JPG.jpeg" alt="Yarımada FK" loading="lazy" style={style} className={`object-cover rounded-full shrink-0 ${className}`} />;
  }
  return (
    <span
      style={{ ...style, fontSize: Math.max(10, size / 3) }}
      className={`rounded-full bg-bg-card text-text-sec font-bold flex items-center justify-center shrink-0 uppercase ${className}`}
      aria-label={name || ''}
    >
      {(name || '?').trim().slice(0, 2)}
    </span>
  );
}
