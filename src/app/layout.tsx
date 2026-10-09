import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import '@fontsource-variable/montserrat/index.css';
import '@fontsource-variable/oswald/index.css';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#051024',
};

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
    <html lang="az" suppressHydrationWarning className={jetbrains.variable}>
      <body className="min-h-screen flex flex-col antialiased bg-bg-main">
        <Script id="theme-init" strategy="beforeInteractive">{"try{var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}"}</Script>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

// Force rebuild: cache invalidation
