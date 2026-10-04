"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { label: "Ana səhifə", href: "/" },
    {
      label: "Klub",
      href: "/klub",
      dropdown: [
        { label: "Haqqımızda", href: "/klub" },
        { label: "Rəhbərlik", href: "/klub#rehberlik" },
        { label: "Nailiyyətlər", href: "/klub#nailiyyetler" },
      ],
    },
    {
      label: "Komandalar",
      href: "/komandalar",
      dropdown: [
        { label: "U-12", href: "/komandalar?age=U-12" },
        { label: "U-11", href: "/komandalar?age=U-11" },
        { label: "U-10", href: "/komandalar?age=U-10" },
        { label: "U-9", href: "/komandalar?age=U-9" },
        { label: "Bütün komandalar", href: "/komandalar" },
      ],
    },
    { label: "Oyunlar", href: "/oyunlar" },
    { label: "Turnir cədvəli", href: "/turnir-cedveli" },
    { label: "Xəbərlər", href: "/xeberler" },
    {
      label: "Media",
      href: "/media",
      dropdown: [
        { label: "Fotolar", href: "/media?tab=photos" },
        { label: "Videolar", href: "/media?tab=videos" },
      ],
    },
    { label: "Məşqçilər", href: "/mesqciler" },
    { label: "Əlaqə", href: "/elaqe" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a1628]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-700 bg-white">
                <Image
                  src="/IMG_7966.JPG.jpeg"
                  alt="Yarımada FC Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-white text-xl tracking-wider uppercase">
                Yarımada FC
              </span>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-4">
            {navLinks.map((item, idx) => (
              <div key={idx} className="relative group">
                <Link
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    pathname === item.href
                      ? "text-[#00e5a0] border-[#00e5a0]"
                      : "text-gray-300 hover:text-white border-transparent hover:border-[#00e5a0]/50"
                  }`}
                >
                  {item.label}
                </Link>
                {/* Dropdown */}
                {item.dropdown && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-[#0a1628] border border-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                      {item.dropdown.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT: Language & Action */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <button className="text-white hover:text-[#00e5a0] transition-colors">AZ</button>
              <span className="text-gray-600">|</span>
              <button className="hover:text-white transition-colors">RU</button>
              <span className="text-gray-600">|</span>
              <button className="hover:text-white transition-colors">EN</button>
            </div>
            <Link
              href="/qeydiyyat"
              className="px-5 py-2 border-2 border-[#00e5a0] text-[#00e5a0] font-bold text-sm rounded hover:bg-[#00e5a0] hover:text-[#0a1628] transition-colors duration-300 uppercase tracking-wider"
            >
              Akademiyaya Qoşul
            </Link>
          </div>

          {/* MOBILE: Hamburger Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE: Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-[#0a1628] z-40 overflow-y-auto">
          <div className="flex flex-col px-6 py-8 space-y-6">
            {navLinks.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white uppercase tracking-wider hover:text-[#00e5a0] transition-colors"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="pl-4 mt-3 flex flex-col space-y-3 border-l-2 border-gray-800">
                    {item.dropdown.map((sub, subIdx) => (
                      <Link
                        key={subIdx}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg text-gray-400 hover:text-white transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-8 border-t border-gray-800 flex flex-col gap-6">
              <div className="flex items-center gap-6 text-xl font-bold text-gray-400">
                <button className="text-white">AZ</button>
                <button>RU</button>
                <button>EN</button>
              </div>
              <Link
                href="/qeydiyyat"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-block text-center px-6 py-4 border-2 border-[#00e5a0] text-[#00e5a0] font-bold text-lg rounded uppercase tracking-wider"
              >
                Akademiyaya Qoşul
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
