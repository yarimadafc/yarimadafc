import type { Metadata } from 'next';
import { Montserrat, JetBrains_Mono, Oswald } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const albert = Montserrat({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-albert'
});

const alumni = Oswald({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-alumni'
});

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: 'Yarımada FK | Rəsmi Vebsayt',
  description: 'Yarımada Futbol Klubunun rəsmi vebsaytı.',
  icons: {
    icon: '/Logo.JPG.jpeg',
    shortcut: '/Logo.JPG.jpeg',
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
      <body className="min-h-screen flex flex-col antialiased bg-[#0d1a2d]">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
