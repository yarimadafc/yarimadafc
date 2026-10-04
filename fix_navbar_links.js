const fs = require('fs');
let file = 'src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Move getNavLinks inside the component to use t
const oldNavLinks = `const getNavLinks = (lang: string) => [
  { name: t('home'), href: '/' },
  { name: t('club'), href: '/klub' },
  { name: t('teams'), href: '/komandalar' },
  { name: t('matches'), href: '/oyunlar' },
  { name: t('coaches'), href: '/mesqciler' },
  { name: t('media'), href: '/media' },
  { name: t('contact'), href: '/elaqe' },
];`;

content = content.replace(oldNavLinks, ''); // Remove the outside declaration

// Inside the component
content = content.replace(/const navLinks = getNavLinks\(lang\);/, `const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('club'), href: '/klub' },
    { name: t('teams'), href: '/komandalar' },
    { name: t('matches'), href: '/oyunlar' },
    { name: t('coaches'), href: '/mesqciler' },
    { name: t('media'), href: '/media' },
    { name: t('contact'), href: '/elaqe' },
  ];`);

// Fix the hardcoded mobile links
content = content.replace(/\{lang === "EN" \? "Home" : lang === "RU" \? "Главная" : "Ana Səhifə"\}/g, "{t('home')}");
content = content.replace(/lang/g, "locale"); // any remaining lang variable should be locale, if there are any harmless ones. Actually wait!
// Let's manually replace the remaining ones just in case.

fs.writeFileSync(file, content, 'utf8');
