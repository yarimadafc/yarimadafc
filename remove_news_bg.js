const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');
content = content.replace(/{ id: 'news_bg', title: 'Xəbərlər Şəkli', desc: 'Ana səhifədəki son xəbərlər blokunun əsas şəkli.' },\n\s*/, "");
fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
