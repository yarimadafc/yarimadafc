const fs = require('fs');
let file = 'src/app/[locale]/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import ClientLayout from '@\/components\/ClientLayout';/, `import ClientLayout from '@/components/ClientLayout';\nimport {NextIntlClientProvider} from 'next-intl';\nimport {getMessages, setRequestLocale} from 'next-intl/server';`);

const oldExport = `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" className={\`\${albert.variable} \${alumni.variable} \${jetbrains.variable}\`}>
      <head>
        <link rel="icon" type="image/jpeg" href="/Logo.JPG.jpeg" />
        <link rel="apple-touch-icon" href="/Logo.JPG.jpeg" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}`;

const newExport = `export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className={\`\${albert.variable} \${alumni.variable} \${jetbrains.variable}\`}>
      <head>
        <link rel="icon" type="image/jpeg" href="/Logo.JPG.jpeg" />
        <link rel="apple-touch-icon" href="/Logo.JPG.jpeg" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}`;

content = content.replace(oldExport, newExport);

// Also we should add generateStaticParams for static export support, but since we are dynamic, we don't strictly need it unless requested.
// But next-intl recommends it.
content += `\nexport function generateStaticParams() {
  return [{locale: 'az'}, {locale: 'en'}, {locale: 'ru'}];
}\n`;

fs.writeFileSync(file, content, 'utf8');
