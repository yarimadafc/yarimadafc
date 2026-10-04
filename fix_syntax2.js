const fs = require('fs');
let file = 'src/components/MatchesTabs.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\{isNext \? 'Qarşıdakı Qarşılaşma' : '\{lang === 'EN' \? 'Last Result' : lang === 'RU' \? 'Последний Результат' : 'Son Nəticə'\}'\}/,
  "{isNext ? (lang === 'EN' ? 'Upcoming Match' : lang === 'RU' ? 'Предстоящий Матч' : 'Qarşıdakı Qarşılaşma') : (lang === 'EN' ? 'Last Result' : lang === 'RU' ? 'Последний Результат' : 'Son Nəticə')}"
);

content = content.replace(
  /\{isNext \? 'Detallar' : '\{lang === 'EN' \? 'Report' : lang === 'RU' \? 'Отчет' : 'Hesabat'\}'\}/,
  "{isNext ? (lang === 'EN' ? 'Details' : lang === 'RU' ? 'Детали' : 'Detallar') : (lang === 'EN' ? 'Report' : lang === 'RU' ? 'Отчет' : 'Hesabat')}"
);

fs.writeFileSync(file, content, 'utf8');
console.log("Syntax fixed 2");
