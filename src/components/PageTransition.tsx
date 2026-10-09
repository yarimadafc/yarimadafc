'use client';
import { ReactNode } from 'react';
import PageHero from '@/components/PageHero';

// Standard page frame: wide container + animated title. Kept for pages that pass a title and children.
export default function PageTransition({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title={title} subtitle={subtitle} />
      <div className="container">{children}</div>
    </div>
  );
}
