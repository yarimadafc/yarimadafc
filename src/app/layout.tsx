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
    <html lang="az" suppressHydrationWarning className={`${albert.variable} ${alumni.variable} ${jetbrains.variable}`}>
      <head>
        {/* Apply the saved theme before first paint (default: dark) to avoid a light-mode flash */}
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}" }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-bg-main">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

// Force rebuild: cache invalidation
