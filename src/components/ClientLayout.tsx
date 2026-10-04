'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';
import { ReactLenis } from 'lenis/react';
import InstrumentStripInit from '@/components/InstrumentStripInit';
import PushNotificationManager from '@/components/PushNotificationManager';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/adminpanel');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
        <Preloader />
        <PushNotificationManager />
        <InstrumentStripInit />
        <Navbar />
        {children}
        <Footer />
      </ReactLenis>
    </>
  );
}
