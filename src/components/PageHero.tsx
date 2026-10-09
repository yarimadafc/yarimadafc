'use client';
import Reveal from '@/components/Reveal';

interface Props {
  title: string;
  subtitle?: string;
  /** optional faded background image behind the title */
  bg?: string;
  children?: React.ReactNode;
}

// Wide, left-aligned page heading (accent LED bar + big title + intro text).
export default function PageHero({ title, subtitle, bg, children }: Props) {
  return (
    <div className="container relative mb-10 md:mb-14">
      {bg && <div className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-center opacity-[0.12] [mask-image:linear-gradient(to_left,#000,transparent)] pointer-events-none" style={{ backgroundImage: `url(${bg})` }} aria-hidden />}
      <Reveal variant="left" className="relative">
        <span className="block w-14 h-[3px] led-bar rounded-full mb-4" aria-hidden />
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main leading-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-text-sec text-base md:text-lg max-w-5xl leading-relaxed">{subtitle}</p>}
        {children}
      </Reveal>
    </div>
  );
}
