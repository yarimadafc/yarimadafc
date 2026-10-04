const fs = require('fs');

// Fix Footer.tsx
let footerFile = 'src/components/Footer.tsx';
let footerContent = fs.readFileSync(footerFile, 'utf8');
footerContent = footerContent.replace(
  /\{lang === "EN" \? "All rights reserved" : lang === "RU" \? "Все права защищены" : "\{lang === "EN" \? "All rights reserved" : lang === "RU" \? "Все права защищены" : "Bütün hüquqlar qorunur"\}"\}/g,
  '{lang === "EN" ? "All rights reserved" : lang === "RU" ? "Все права защищены" : "Bütün hüquqlar qorunur"}'
);
fs.writeFileSync(footerFile, footerContent, 'utf8');

// Fix MatchesTabs.tsx
let matchesFile = 'src/components/MatchesTabs.tsx';
let matchesContent = fs.readFileSync(matchesFile, 'utf8');
matchesContent = matchesContent.replace(
  /\{lang === 'EN' \? 'Next Match' : lang === 'RU' \? 'Следующий Матч' : '\{lang === 'EN' \? 'Next Match' : lang === 'RU' \? 'Следующий Матч' : 'Növbəti Oyun'\}'\}/g,
  "{lang === 'EN' ? 'Next Match' : lang === 'RU' ? 'Следующий Матч' : 'Növbəti Oyun'}"
);
matchesContent = matchesContent.replace(
  /\{lang === 'EN' \? 'Last Result' : lang === 'RU' \? 'Последний Результат' : '\{lang === 'EN' \? 'Last Result' : lang === 'RU' \? 'Последний Результат' : 'Son Nəticə'\}'\}/g,
  "{lang === 'EN' ? 'Last Result' : lang === 'RU' ? 'Последний Результат' : 'Son Nəticə'}"
);
matchesContent = matchesContent.replace(
  /\{lang === 'EN' \? 'No information' : lang === 'RU' \? 'Нет информации' : '\{lang === 'EN' \? 'No information' : lang === 'RU' \? 'Нет информации' : 'Məlumat yoxdur'\}'\}/g,
  "{lang === 'EN' ? 'No information' : lang === 'RU' ? 'Нет информации' : 'Məlumat yoxdur'}"
);

fs.writeFileSync(matchesFile, matchesContent, 'utf8');
console.log("Syntax fixed");
