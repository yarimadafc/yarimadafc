import type { Metadata } from 'next';
import { Montserrat, JetBrains_Mono, Oswald } from 'next/font/google';
import '../globals.css';
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
  title: 'Yarmada FK - Admin Panel',
  description: 'Yarımada Futbol Klubunun idarəetmə paneli.',
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
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{locale: 'az'}, {locale: 'en'}, {locale: 'ru'}];
}
