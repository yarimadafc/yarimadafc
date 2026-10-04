const fs = require('fs');
let file = 'src/components/ClientLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure isAdmin covers all possible bases and check if ReactLenis or Preloader is messing with layout
// Wait! If they are on admin panel, do they still get ReactLenis?
// if (isAdmin) return <>{children}</>; This bypasses ReactLenis!
// Why did the user say "yoxa çıxdı sayta çevrildi"?
// Oh! Did I overwrite adminpanel/page.tsx or layout.tsx with something that renders the site? No!
// Wait! "sayta çevrildi" could mean that the Navbar and Footer are showing up ON the Admin panel!
// If Navbar and Footer are showing up, it means `isAdmin` is FALSE!
// When would `isAdmin` be FALSE for `/az/adminpanel`?
// Oh! If they are on `/az/adminpanel/`, then `pathname` is `/az/adminpanel/`.
// But wait! Is `pathname` really what I think it is?
// What if they are using `usePathname` from `next-intl` in `ClientLayout.tsx`?
// Let's see the imports in ClientLayout: `import { usePathname } from 'next/navigation';`
// Wait, is it possible that during client hydration, `pathname` is `/adminpanel`? Yes, `includes('/adminpanel')` covers that.

// What if they clicked a link from the site that went to `/adminpanel`?
// Let's replace isAdmin check just to be absolutely foolproof:
const newCheck = `
  const pathname = usePathname() || '';
  const isAdmin = pathname.includes('/adminpanel') || (typeof window !== 'undefined' && window.location.pathname.includes('/adminpanel'));
`;
content = content.replace(/const pathname = usePathname\(\);\s*const isAdmin = pathname\?\.includes\('\/adminpanel'\);/, newCheck);

fs.writeFileSync(file, content, 'utf8');
