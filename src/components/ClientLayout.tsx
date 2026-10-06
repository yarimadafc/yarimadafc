'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/adminpanel');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#06101e] text-white font-sans selection:bg-[#d7bf7b] selection:text-[#06101e] flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
