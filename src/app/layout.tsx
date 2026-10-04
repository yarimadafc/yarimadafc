import type { Metadata } from 'next';
import { Albert_Sans, JetBrains_Mono, Alumni_Sans } from 'next/font/google';
import './globals.css';
import Preloader from "@/components/Preloader";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstrumentStripInit from '@/components/InstrumentStripInit';
import PushNotificationManager from '@/components/PushNotificationManager';

const albert = Albert_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-albert'
});

const alumni = Alumni_Sans({ 
  subsets: ['latin'], 
  weight: ['700', '800', '900'],
  variable: '--font-alumni'
});

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: 'Yarmada FK',
  description: 'Yarımada Futbol Klubunun rəsmi veb səhifəsi. Oyunlar, komandalar, xəbərlər və daha çoxu.',
  keywords: ['Yarımada FK', 'Yarımada Football Club', 'futbol akademiyası Bakı', 'uşaq futbolu Bakı', 'AFFA U-12'],
  icons: {
    icon: '/Logo.JPG.jpeg',
    apple: '/Logo.JPG.jpeg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" className={`${albert.variable} ${alumni.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="icon" type="image/jpeg" href="/Logo.JPG.jpeg" />
        <link rel="apple-touch-icon" href="/Logo.JPG.jpeg" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Preloader />
        <PushNotificationManager />
        <InstrumentStripInit />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
