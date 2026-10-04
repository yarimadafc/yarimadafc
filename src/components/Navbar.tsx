import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl tracking-wider">
                YARIMADA FK
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Ana Səhifə
              </Link>
              <Link href="/teams" className="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Komanda
              </Link>
              <Link href="/matches" className="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Oyunlar
              </Link>
              <Link href="/news" className="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Xəbərlər
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
