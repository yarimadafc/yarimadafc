'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { LanguageProvider } from '@/lib/i18n';
import DomTranslator from './DomTranslator';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  const isAdminPath = pathname.startsWith('/admin');

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-accent selection:text-on-accent flex flex-col">
        {!isAdminPath && <Navbar />}
        <main className="flex-grow">
          {children}
        </main>
        {!isAdminPath && <Footer />}
      </div>
      <DomTranslator />
    </LanguageProvider>
  );
}
