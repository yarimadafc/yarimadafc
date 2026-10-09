import Link from 'next/link';

interface Props {
  title: string;
  href?: string;
  linkText?: string;
  center?: boolean;
  as?: 'h1' | 'h2';
}

export default function SectionHeading({ title, href, linkText, center = false, as: Tag = 'h2' }: Props) {
  return (
    <div className={`flex gap-4 mb-8 md:mb-10 ${center ? 'flex-col items-center text-center' : 'items-end justify-between'}`}>
      <div className={center ? 'flex flex-col items-center' : ''}>
        <span className="block w-12 h-[3px] bg-accent mb-4" aria-hidden />
        <Tag className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-main leading-tight">{title}</Tag>
      </div>
      {href && linkText && (
        <Link href={href} className="shrink-0 text-sm font-semibold text-text-main border-b-2 border-accent pb-1 whitespace-nowrap hover:text-accent transition-colors">
          {linkText}
        </Link>
      )}
    </div>
  );
}
