import type { ReactNode } from 'react';

const svg = (children: ReactNode) => ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);

export const InstagramIcon = svg(<><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>);
export const FacebookIcon = svg(<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />);
export const YoutubeIcon = svg(<><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></>);
export const TiktokIcon = svg(<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />);
export const TelegramIcon = svg(<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>);

export const socials = [
  { name: 'Instagram', href: 'https://www.instagram.com/yarimada_fk/', Icon: InstagramIcon },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590640762611', Icon: FacebookIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@yarimada_fk', Icon: YoutubeIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@yarimadafk', Icon: TiktokIcon },
  { name: 'Telegram', href: 'https://t.me/yarimadafk', Icon: TelegramIcon },
];

export function SocialLinks({ className = '', iconClass = 'w-[18px] h-[18px]', gap = 'gap-4' }: { className?: string; iconClass?: string; gap?: string }) {
  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {socials.map(({ name, href, Icon }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}
          className="text-text-sec hover:text-accent hover:scale-125 hover:-translate-y-0.5 transition-all duration-300">
          <Icon className={iconClass} />
        </a>
      ))}
    </div>
  );
}
