'use client';
import React, { useEffect } from 'react';

import { usePathname, useRouter, Link } from '@/i18n/routing';

import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!document.cookie.includes('admin_session=true') && !pathname.includes('/adminpanel/login')) {
      router.push('/adminpanel/login');
    }
  }, [pathname, router]);

  if (pathname.includes('/adminpanel/login')) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'Xəbərlər', path: '/adminpanel/xeberler' },
    { name: 'Komandalar', path: '/adminpanel/komandalar' },
    { name: 'Futbolçular', path: '/adminpanel/futbolcular' },
    { name: 'Məşqçilər', path: '/adminpanel/mesqciler' },
    { name: 'Oyunlar', path: '/adminpanel/oyunlar' },
    { name: 'Turnirlər', path: '/adminpanel/turnir' },
    { name: 'Media', path: '/adminpanel/media' },
    { name: 'Sponsorlar', path: '/adminpanel/sponsorlar' },
    { name: 'Əlaqə mesajları', path: '/adminpanel/elaqe' },
    { name: 'Qeydiyyatlar', path: '/adminpanel/qeydiyyatlar' },
    { name: 'Bannerlər', path: '/adminpanel/bannerler' },
    { name: 'Parametrlər', path: '/adminpanel/parametrler' },
  ];

  const handleLogout = async () => {
    await fetch('/api/adminpanel/logout', { method: 'POST' });
    router.push('/adminpanel/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-64 bg-[#152741] text-white hidden md:flex flex-col fixed h-full z-10 shadow-2xl"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#d7bf7b] tracking-wider">YARIMADA FK</h2>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + (index * 0.03) }}
            >
              <Link 
                href={item.path}
                className={`block px-4 py-3 rounded transition-colors ${pathname === item.path || (item.path !== '/adminpanel' && pathname.startsWith(item.path)) ? 'bg-[#112240] text-[#d7bf7b] font-medium border-l-4 border-[#d7bf7b]' : 'text-gray-300 hover:bg-[#112240] hover:text-white'}`}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10"
        >
          <h1 className="text-xl font-bold text-gray-800">İdarə Paneli</h1>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition font-medium">Çıxış</button>
        </motion.header>
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
