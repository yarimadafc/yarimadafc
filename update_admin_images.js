const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');
content = content.replace(
  "{ id: 'quick_school', title: 'Sürətli Keçid: Futbol Məktəbi', desc: 'Ana səhifədəki Futbol Məktəbi keçidinin şəkli.' },",
  ""
);
fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
