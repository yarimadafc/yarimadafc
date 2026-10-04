import type { Metadata } from 'next';
import { Montserrat, JetBrains_Mono, Oswald } from 'next/font/google';
import '../globals.css';
import ClientLayout from '@/components/ClientLayout';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';

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
  title: 'Yarmada FK',
  description: 'Yarımada Futbol Klubunun rəsmi veb səhifəsi. Oyunlar, komandalar, xəbərlər və daha çoxu.',
  keywords: ['Yarımada FK', 'Yarımada Football Club', 'futbol akademiyası Bakı', 'uşaq futbolu Bakı', 'AFFA U-12'],
  icons: {
    icon: '/Logo.JPG.jpeg',
    shortcut: '/Logo.JPG.jpeg',
    apple: '/Logo.JPG.jpeg',
  }
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${albert.variable} ${alumni.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="icon" type="image/jpeg" href="/Logo.JPG.jpeg" />
        <link rel="apple-touch-icon" href="/Logo.JPG.jpeg" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientLayout key={locale}>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{locale: 'az'}, {locale: 'en'}, {locale: 'ru'}];
}
