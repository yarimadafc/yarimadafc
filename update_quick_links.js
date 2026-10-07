const fs = require('fs');
let content = fs.readFileSync('src/components/home/QuickLinks.tsx', 'utf-8');
content = content.replace(
  "const keys = ['quick_shop', 'quick_school', 'quick_academy'];",
  "const keys = ['quick_shop', 'quick_academy'];"
);
content = content.replace(
  "const links = [\n    { title: 'Onlayn mağaza', href: '/shop', key: 'quick_shop' },\n    { title: '\"Yarımada\" Futbol Məktəbi', href: '/school', key: 'quick_school' },\n    { title: 'Akademiya', href: '/academy', key: 'quick_academy' },\n  ];",
  "const links = [\n    { title: 'Onlayn mağaza', href: '/shop', key: 'quick_shop' },\n    { title: 'Akademiya', href: '/academy', key: 'quick_academy' },\n  ];"
);
content = content.replace(
  "className=\"grid grid-cols-1 md:grid-cols-3 gap-6\"",
  "className=\"grid grid-cols-1 md:grid-cols-2 gap-6\""
);
fs.writeFileSync('src/components/home/QuickLinks.tsx', content);
