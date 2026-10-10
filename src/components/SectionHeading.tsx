'use client';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { useLang } from '@/lib/i18n';

interface Props {
  title: string;
  href?: string;
  linkText?: string;
  center?: boolean;
  as?: 'h1' | 'h2';
}

export default function SectionHeading({ title, href, linkText, center = false, as: Tag = 'h2' }: Props) {
  const { t } = useLang();
  return (
    <Reveal variant="left">
      <div className={`flex gap-4 mb-6 md:mb-8 ${center ? 'flex-col items-center text-center' : 'items-end justify-between'}`}>
        <div className={center ? 'flex flex-col items-center' : ''}>
          <span className="block w-14 h-[3px] led-bar mb-4 rounded-full" aria-hidden />
          <Tag className="text-2xl md:text-4xl font-extrabold tracking-tight text-text-main leading-tight">{t(title)}</Tag>
        </div>
        {href && linkText && (
          <Link href={href} className="btn-fx shrink-0 text-sm font-semibold text-text-main border-b-2 border-accent pb-1 whitespace-nowrap hover:text-accent">
            {t(linkText)}
          </Link>
        )}
      </div>
    </Reveal>
  );
}
