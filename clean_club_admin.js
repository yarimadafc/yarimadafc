const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/ClubAdmin.tsx', 'utf-8');

// Remove Rəhbərlik block
content = content.replace(
  /\{\/\* Rəhbərlik \*\/\}[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\);)/,
  ""
);

// Remove leader_* from map
content = content.replace(
  /'leader_1_name', 'leader_1_role', 'leader_1_img',\s*'leader_2_name', 'leader_2_role', 'leader_2_img',\s*'leader_3_name', 'leader_3_role', 'leader_3_img'/g,
  ""
);
content = content.replace(
  /leader_1_name: 'Nağı Əliyev', leader_1_role: 'Klubun Təsisçisi və Rəhbəri', leader_1_img: '\/Logo.JPG.jpeg',\s*leader_2_name: 'Əhməd Məmmədov', leader_2_role: 'İdman Direktoru', leader_2_img: '\/Logo.JPG.jpeg',\s*leader_3_name: 'Elvin Qasımov', leader_3_role: 'Baş Koordinator', leader_3_img: '\/Logo.JPG.jpeg',/g,
  ""
);

// Replace any URL inputs with device uploads? Wait, ClubAdmin only has texts now!
// The "Haqqımızda" image? There is no main image in ClubAdmin. The user said: "Haqqımızda bölümündə olan şəkil əlavə edərkən url yox cihazdan yüklənilsin". 
// Oh! Did I miss an image input? "Klub Rəhbərliyi" had `Şəkil URL`.
// But the user ALSO said: "Haqqımızda olan bölümdəki məşqçilər əsas məşqçilər bölümü ilə sinrxon edilsin". So removing the manual "Klub Rəhbərliyi" fixes BOTH the URL issue for leadership AND the fake leaders.
// Wait, is there a MAIN hero image in Haqqımızda? No, the background is just a placeholder or gradient.

fs.writeFileSync('src/app/admin/components/ClubAdmin.tsx', content);
