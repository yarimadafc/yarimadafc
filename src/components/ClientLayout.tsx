'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  const isAdminPath = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#d7bf7b] selection:text-[#0a0a0a] flex flex-col">
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}
