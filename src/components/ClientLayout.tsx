'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { LanguageProvider } from '@/lib/i18n';
import DomTranslator from './DomTranslator';
import SiteTracker from './SiteTracker';
import AccountWatcher from './AccountWatcher';
import { SiteSyncProvider } from '@/lib/siteSync';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  // Any image whose link is dead (deleted / blocked host) shows the club crest instead of a broken icon.
  useEffect(() => {
    const onError = (e: Event) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || img.dataset.fallback || img.closest('[data-no-fallback]')) return;
      img.dataset.fallback = '1';
      img.src = '/Logo.JPG.jpeg';
      img.style.objectFit = 'contain';
      img.style.padding = '12%';
      img.style.opacity = '0.5';
    };
    document.addEventListener('error', onError, true);
    return () => document.removeEventListener('error', onError, true);
  }, []);

  const isAdminPath = pathname.startsWith('/admin');

  return (
    <LanguageProvider>
      <SiteSyncProvider enabled={!isAdminPath}>
      <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-accent selection:text-on-accent flex flex-col">
        {!isAdminPath && <Navbar />}
        <main className="flex-grow">
          {children}
        </main>
        {!isAdminPath && <Footer />}
      </div>
      </SiteSyncProvider>
      <DomTranslator />
      <SiteTracker />
      {!isAdminPath && <AccountWatcher />}
    </LanguageProvider>
  );
}
