const fs = require('fs');
let file = 'src/components/ClientLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import Preloader from '@\/components\/Preloader';/, "import Preloader from '@/components/Preloader';\nimport { ReactLenis } from 'lenis/react';");

content = content.replace(
  /<Preloader \/>\s*<PushNotificationManager \/>\s*<InstrumentStripInit \/>\s*<Navbar \/>\s*\{children\}\s*<Footer \/>/,
  `<ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
        <Preloader />
        <PushNotificationManager />
        <InstrumentStripInit />
        <Navbar />
        {children}
        <Footer />
      </ReactLenis>`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Lenis added');
