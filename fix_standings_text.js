const fs = require('fs');
let file = 'src/app/[locale]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/>Klub</g, '>{t("standings_club")}<');
content = content.replace(/>O</g, '>{t("standings_pld")}<');
content = content.replace(/>Q</g, '>{t("standings_won")}<');
content = content.replace(/>M</g, '>{t("standings_lst")}<');
content = content.replace(/>X</g, '>{t("standings_pts")}<');
content = content.replace(/name:'Məlumat yüklənir'/g, "name: t('standings_loading')");
content = content.replace(/O=Oyun · Q=Qələbə · M=Məğlubiyyət · X=Xal/g, "{t('standings_legend')}");

fs.writeFileSync(file, content, 'utf8');
