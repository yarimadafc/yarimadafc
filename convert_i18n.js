const fs = require('fs');

const translations = {
  hero_label: { AZ: 'Yarımada FK • Rəsmi Sayt', EN: 'Yarimada FC • Official Website', RU: 'Yarımada FK • Официальный Сайт' },
  hero_title: { AZ: 'MEYDANDA GÜC, QƏLBDƏ FUTBOL!', EN: 'POWER ON THE PITCH, FOOTBALL IN THE HEART!', RU: 'СИЛА НА ПОЛЕ, ФУТБОЛ В СЕРДЦЕ!' },
  hero_subtitle: { AZ: 'Futbol sadəcə oyun deyil, bir həyat tərzidir. Əsl futbol ruhunu hiss et, zəfərlərə bizimlə addımla və gələcəyin çempionu ol!', EN: 'Football is not just a game, it\'s a way of life. Feel the true spirit of football, step towards victory with us and become the champion of the future!', RU: 'Футбол — это не просто игра, это образ жизни. Почувствуй настоящий дух футбола, шагай к победам вместе с нами и стань чемпионом будущего!' },
  hero_btn1: { AZ: 'Komandalarımıza bax', EN: 'View Our Teams', RU: 'Наши команды' },
  hero_btn2: { AZ: 'Son oyunlar', EN: 'Recent Matches', RU: 'Последние матчи' },
  all_matches: { AZ: 'Bütün oyunlar', EN: 'All matches', RU: 'Все матчи' },
  matches_label: { AZ: 'MEYDANDA', EN: 'ON THE PITCH', RU: 'НА ПОЛЕ' },
  matches_title: { AZ: 'OYUNLAR', EN: 'MATCHES', RU: 'МАТЧИ' },
  next_match: { AZ: 'NÖVBƏTİ OYUN', EN: 'NEXT MATCH', RU: 'СЛЕДУЮЩИЙ МАТЧ' },
  last_result: { AZ: 'SON NƏTİCƏ', EN: 'LAST RESULT', RU: 'ПОСЛЕДНИЙ РЕЗУЛЬТАТ' },
  no_upcoming: { AZ: 'Yaxın vaxtda oyun planlanmayıb', EN: 'No upcoming matches scheduled', RU: 'Ближайших матчей не запланировано' },
  no_results: { AZ: 'Hələ heç bir oyun keçirilməyib', EN: 'No matches played yet', RU: 'Матчи ещё не проводились' },
  standings_label: { AZ: 'STATİSTİKA', EN: 'STATISTICS', RU: 'СТАТИСТИКА' },
  standings_title: { AZ: 'TURNİR CƏDVƏLİ', EN: 'STANDINGS', RU: 'ТУРНИРНАЯ ТАБЛИЦА' },
  full_table: { AZ: 'Tam cədvələ bax →', EN: 'Full Standings →', RU: 'Полная таблица →' },
  news_label: { AZ: 'XƏBƏRLƏR', EN: 'NEWS', RU: 'НОВОСТИ' },
  news_title: { AZ: 'SON YENİLİKLƏR', EN: 'LATEST NEWS', RU: 'ПОСЛЕДНИЕ НОВОСТИ' },
  all_news: { AZ: 'Bütün xəbərlər', EN: 'All News', RU: 'Все новости' },
  read_more: { AZ: 'Ətraflı oxu', EN: 'Read More', RU: 'Подробнее' },
  about_label: { AZ: 'BİZ KİMİK?', EN: 'ABOUT US', RU: 'КТО МЫ?' },
  about_title: { AZ: 'YARIMADA FK HAQQINDA.', EN: 'ABOUT YARIMADA FC.', RU: 'О YARYMADA FK.' },
  about_text: { AZ: 'Yarımada Futbol Klubu gənc istedadları üzə çıxarmaq, onlara peşəkar futbol təhsili vermək və Azərbaycan futboluna yeni nəfəs gətirmək məqsədilə yaradılmışdır. Biz sadəcə bir klub deyil, həm də böyük bir ailəyik.', EN: 'Yarimada Football Club was founded with the mission to discover young talents, provide them professional football education and bring fresh breath to Azerbaijani football. We are not just a club, we are a big family.', RU: 'Футбольный клуб Yarımada был основан с миссией открывать молодые таланты, предоставлять им профессиональное футбольное образование и вносить свежую струю в азербайджанский футбол. Мы не просто клуб — мы большая семья.' },
  about_btn: { AZ: 'Ətraflı', EN: 'Learn More', RU: 'Подробнее' },
  media_videos: { AZ: 'SON VİDEOLAR', EN: 'LATEST VIDEOS', RU: 'ПОСЛЕДНИЕ ВИДЕО' },
  media_photos: { AZ: 'FOTOLAR', EN: 'PHOTOS', RU: 'ФОТО' },
  teams_label: { AZ: 'AKADEMİYA', EN: 'ACADEMY', RU: 'АКАДЕМИЯ' },
  teams_title: { AZ: 'KOMANDALARIMIZ', EN: 'OUR TEAMS', RU: 'НАШИ КОМАНДЫ' },
  // Additional typical ones
  home: { AZ: 'Ana Səhifə', EN: 'Home', RU: 'Главная' },
  club: { AZ: 'Klub', EN: 'Club', RU: 'Клуб' },
  teams: { AZ: 'Komandalar', EN: 'Teams', RU: 'Команды' },
  matches: { AZ: 'Oyunlar', EN: 'Matches', RU: 'Матчи' },
  coaches: { AZ: 'Məşqçilər', EN: 'Coaches', RU: 'Тренеры' },
  media: { AZ: 'Media', EN: 'Media', RU: 'Медиа' },
  contact: { AZ: 'Əlaqə', EN: 'Contact', RU: 'Контакты' },
};

const az = {};
const en = {};
const ru = {};

for (const [key, langs] of Object.entries(translations)) {
  az[key] = langs.AZ;
  en[key] = langs.EN;
  ru[key] = langs.RU;
}

fs.writeFileSync('messages/az.json', JSON.stringify(az, null, 2));
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/ru.json', JSON.stringify(ru, null, 2));

console.log('Dictionaries created');
