import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Yarımada FC | Rəsmi Veb Səhifə',
  description: 'Yarımada Futbol Klubunun rəsmi veb səhifəsi. Oyunlar, komandalar, xəbərlər və daha çoxu.',
  keywords: ['Yarımada FK', 'Yarımada Football Club', 'futbol akademiyası Bakı', 'uşaq futbolu Bakı', 'AFFA U-12'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
