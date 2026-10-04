const fs = require('fs');
let file = 'src/app/adminpanel/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldMenu = `const menuItems = [
    { name: 'İdarə paneli', path: '/adminpanel' },
    { name: 'Xəbərlər', path: '/adminpanel/xeberler' },
    { name: 'Komandalar', path: '/adminpanel/komandalar' },
    { name: 'Futbolçular', path: '/adminpanel/futbolcular' },
    { name: 'Məşqçilər', path: '/adminpanel/mesqciler' },
    { name: 'Oyunlar', path: '/adminpanel/oyunlar' },
    { name: 'Turnirlər', path: '/adminpanel/turnir' },
    { name: 'Media', path: '/adminpanel/media' },
    { name: 'Sponsorlar', path: '/adminpanel/sponsorlar' },
    { name: 'Əlaqə mesajları', path: '/adminpanel/elaqe' },
    { name: 'Qeydiyyatlar', path: '/adminpanel/qeydiyyatlar' },
    { name: 'Bannerlər', path: '/adminpanel/bannerler' },
    { name: 'Parametrlər', path: '/adminpanel/parametrler' },
  ];`;

const newMenu = `const menuItems = [
    { name: 'Xəbərlər', path: '/adminpanel/xeberler' },
    { name: 'Komandalar', path: '/adminpanel/komandalar' },
    { name: 'Futbolçular', path: '/adminpanel/futbolcular' },
    { name: 'Məşqçilər', path: '/adminpanel/mesqciler' },
    { name: 'Oyunlar', path: '/adminpanel/oyunlar' },
    { name: 'Turnirlər', path: '/adminpanel/turnir' },
    { name: 'Media', path: '/adminpanel/media' },
    { name: 'Sponsorlar', path: '/adminpanel/sponsorlar' },
    { name: 'Əlaqə mesajları', path: '/adminpanel/elaqe' },
    { name: 'Qeydiyyatlar', path: '/adminpanel/qeydiyyatlar' },
    { name: 'Bannerlər', path: '/adminpanel/bannerler' },
    { name: 'Parametrlər', path: '/adminpanel/parametrler' },
  ];`;

content = content.replace(oldMenu, newMenu);
fs.writeFileSync(file, content, 'utf8');
