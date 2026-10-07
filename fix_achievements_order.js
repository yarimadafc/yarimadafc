const fs = require('fs');

let adminContent = fs.readFileSync('src/app/admin/components/AchievementsAdmin.tsx', 'utf-8');
adminContent = adminContent.replace(
  "order('order_num', { ascending: true })",
  "order('created_at', { ascending: false })"
);
fs.writeFileSync('src/app/admin/components/AchievementsAdmin.tsx', adminContent);

let uiContent = fs.readFileSync('src/components/home/Achievements.tsx', 'utf-8');
uiContent = uiContent.replace(
  "order('order_num', { ascending: true })",
  "order('created_at', { ascending: false })"
);
fs.writeFileSync('src/components/home/Achievements.tsx', uiContent);

