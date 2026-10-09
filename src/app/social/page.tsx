'use client';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { socials } from '@/components/SocialIcons';
import { ArrowUpRight } from 'lucide-react';

const handles: Record<string, string> = {
  Instagram: '@yarimada_fk',
  Facebook: 'Yarımada FK',
  YouTube: '@yarimada_fk',
  TikTok: '@yarimadafk',
  Telegram: '@yarimadafk',
};

export default function SocialPage() {
  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title="Sosial media" subtitle="Klubdan ən son xəbərləri, görüntüləri və oyun anlarını rəsmi hesablarımızdan izləyin." />
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {socials.map(({ name, href, Icon }, i) => (
            <Reveal key={name} variant="up" delay={i * 0.08}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="group led-border card-fx block h-full bg-bg-sec rounded-2xl border border-bg-border p-8 text-center">
                <span className="mx-auto mb-6 flex w-20 h-20 items-center justify-center rounded-full bg-bg-card border border-bg-border text-text-main group-hover:bg-accent group-hover:text-on-accent transition-colors duration-300 led-glow">
                  <Icon className="w-9 h-9" />
                </span>
                <h2 className="text-xl font-bold text-text-main mb-1">{name}</h2>
                <p className="text-text-sec text-sm mb-6">{handles[name]}</p>
                <span className="btn-fx inline-flex items-center gap-2 rounded-full border border-bg-border px-5 py-2 text-sm font-semibold text-text-main group-hover:border-accent">
                  Hesaba keç <ArrowUpRight className="w-4 h-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
