const fs = require('fs');
let coaches = fs.readFileSync('src/app/admin/components/CoachesAdmin.tsx', 'utf-8');
coaches = coaches.replace(/compressImage\(e\.target\.files\[0\],\s*800\)/, 'compressImage(e.target.files[0])');
fs.writeFileSync('src/app/admin/components/CoachesAdmin.tsx', coaches);

let teams = fs.readFileSync('src/app/admin/components/TeamsAdmin.tsx', 'utf-8');
teams = teams.replace(/compressImage\(e\.target\.files\[0\],\s*1200\)/, 'compressImage(e.target.files[0])');
fs.writeFileSync('src/app/admin/components/TeamsAdmin.tsx', teams);
