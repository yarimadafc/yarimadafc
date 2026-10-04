const fs = require('fs');

const az = JSON.parse(fs.readFileSync('messages/az.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const ru = JSON.parse(fs.readFileSync('messages/ru.json', 'utf8'));

const newKeys = {
  standings_club: { az: 'Klub', en: 'Club', ru: 'Клуб' },
  standings_pld: { az: 'O', en: 'P', ru: 'И' },
  standings_won: { az: 'Q', en: 'W', ru: 'В' },
  standings_drw: { az: 'H', en: 'D', ru: 'Н' },
  standings_lst: { az: 'M', en: 'L', ru: 'П' },
  standings_pts: { az: 'X', en: 'Pts', ru: 'О' },
  standings_legend: { az: 'O=Oyun · Q=Qələbə · H=Heç-heçə · M=Məğlubiyyət · X=Xal', en: 'P=Played · W=Won · D=Draw · L=Lost · Pts=Points', ru: 'И=Игры · В=Выигрыши · Н=Ничьи · П=Поражения · О=Очки' },
  standings_loading: { az: 'Məlumat yüklənir', en: 'Loading...', ru: 'Загрузка...' },
};

for (const key of Object.keys(newKeys)) {
  az[key] = newKeys[key].az;
  en[key] = newKeys[key].en;
  ru[key] = newKeys[key].ru;
}

fs.writeFileSync('messages/az.json', JSON.stringify(az, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/ru.json', JSON.stringify(ru, null, 2));

console.log('JSON files updated.');
