import type { Metadata } from 'next';
import { Albert_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstrumentStripInit from '@/components/InstrumentStripInit';

const albert = Albert_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-albert'
});

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: 'Yarımada FC | Rəsmi Veb Səhifə',
  description: 'Yarımada Futbol Klubunun rəsmi veb səhifəsi. Oyunlar, komandalar, xəbərlər və daha çoxu.',
  keywords: ['Yarımada FK', 'Yarımada Football Club', 'futbol akademiyası Bakı', 'uşaq futbolu Bakı', 'AFFA U-12'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" className={`${albert.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <InstrumentStripInit />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
