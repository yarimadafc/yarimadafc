'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Simple client-side auth check
  useEffect(() => {
    if (!document.cookie.includes('admin_session=true') && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'İdarə paneli', path: '/admin' },
    { name: 'Xəbərlər', path: '/admin/xeberler' },
    { name: 'Komandalar', path: '/admin/komandalar' },
    { name: 'Futbolçular', path: '/admin/futbolcular' },
    { name: 'Məşqçilər', path: '/admin/mesqciler' },
    { name: 'Oyunlar', path: '/admin/oyunlar' },
    { name: 'Turnirlər', path: '/admin/turnir' },
    { name: 'Media', path: '/admin/media' },
    { name: 'Sponsorlar', path: '/admin/sponsorlar' },
    { name: 'Əlaqə mesajları', path: '/admin/elaqe' },
    { name: 'Qeydiyyatlar', path: '/admin/qeydiyyatlar' },
    { name: 'Bannerlər', path: '/admin/bannerler' },
    { name: 'Parametrlər', path: '/admin/parametrler' },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1628] text-white hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#00e5a0] tracking-wider">YARIMADA FK</h2>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`block px-4 py-3 rounded transition-colors ${pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path)) ? 'bg-[#112240] text-[#00e5a0] font-medium border-l-4 border-[#00e5a0]' : 'text-gray-300 hover:bg-[#112240] hover:text-white'}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">İdarə Paneli</h1>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition font-medium">Çıxış</button>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
