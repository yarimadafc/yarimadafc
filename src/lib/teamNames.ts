// Team and tournament names in the other site languages. Names are not translated word by word
// ("Yarımada" would become "Peninsula"), they are written the way clubs are named in that language:
//   EN: Yarımada FK U-13 -> Yarimada FC U-13      RU: Yarımada FK U-13 -> Ярымада ФК U-13
// Every name (ours and the opponents') goes through the same rules, so a page never mixes scripts.
export type NameLang = 'az' | 'en' | 'ru';

const LETTERS = /[A-Za-zƏəİıÖöÜüŞşÇçĞğ]+/g;

// well-known names whose usual spelling differs from the letter rules (keys: lower case)
const EN_WORDS: Record<string, string> = {
  bakı: 'Baku', qəbələ: 'Gabala', gəncə: 'Ganja', neftçi: 'Neftchi', qarabağ: 'Qarabag', sumqayıt: 'Sumgayit',
  xırdalan: 'Khirdalan', şamaxı: 'Shamakhi', mingəçevir: 'Mingachevir', şəmkir: 'Shamkir', zirə: 'Zira', səbail: 'Sabail', kəpəz: 'Kapaz',
};
const RU_WORDS: Record<string, string> = {
  yarımada: 'Ярымада', bakı: 'Баку', baku: 'Баку', qarabağ: 'Карабах', neftçi: 'Нефтчи', bayern: 'Байерн', sabah: 'Сабах',
  sumqayıt: 'Сумгайыт', qəbələ: 'Габала', gəncə: 'Гянджа', gənclik: 'Генджлик', zirə: 'Зиря', kəpəz: 'Кяпаз', səbail: 'Сабаил',
  şamaxı: 'Шамахы', xırdalan: 'Хырдалан', mingəçevir: 'Мингячевир', şəmkir: 'Шамкир', turan: 'Туран', araz: 'Араз',
  qalası: 'Галасы', liman: 'Лиман', real: 'Реал', inter: 'Интер', dinamo: 'Динамо', olimp: 'Олимп', city: 'Сити', united: 'Юнайтед',
};

const EN_CHARS: Record<string, string> = { ə: 'a', ı: 'i', ş: 'sh', ç: 'ch', ğ: 'g', ö: 'o', ü: 'u', i: 'i' };
const RU_CHARS: Record<string, string> = {
  a: 'а', b: 'б', c: 'дж', ç: 'ч', d: 'д', e: 'е', ə: 'я', f: 'ф', g: 'г', ğ: 'г', h: 'х', x: 'х', ı: 'ы', i: 'и', j: 'ж',
  k: 'к', q: 'г', l: 'л', m: 'м', n: 'н', o: 'о', ö: 'ё', p: 'п', r: 'р', s: 'с', ş: 'ш', t: 'т', u: 'у', ü: 'ю', v: 'в',
  w: 'в', y: 'й', z: 'з',
};
const RU_PAIRS: Record<string, string> = { ya: 'я', yu: 'ю', ye: 'е', yo: 'ё', sh: 'ш', ch: 'ч', kh: 'х', ts: 'ц' };
const RU_ABBR: Record<string, string> = { FK: 'ФК', FC: 'ФК', PFK: 'ПФК', PFC: 'ПФК' };

const lower = (s: string) => s.toLocaleLowerCase('az');
const isUpper = (s: string) => s === s.toLocaleUpperCase('az') && s !== lower(s);

function casing(src: string, out: string, allCaps: boolean): string {
  if (allCaps || (src.length > 1 && isUpper(src))) return out.toLocaleUpperCase('ru');
  return isUpper(src[0]) ? out[0].toLocaleUpperCase('ru') + out.slice(1) : out;
}

function enWord(word: string, allCaps: boolean): string {
  if (/^(FK|PFK)$/.test(word)) return word.replace('FK', 'FC');
  const known = EN_WORDS[lower(word)];
  if (known) return casing(word, known, allCaps);
  const out = [...lower(word)].map(c => EN_CHARS[c] ?? c).join('');
  return casing(word, out, allCaps);
}

function ruWord(word: string, allCaps: boolean): string {
  const abbr = RU_ABBR[word.toUpperCase()];
  if (abbr && word.length <= 3) return abbr;
  const known = RU_WORDS[lower(word)];
  if (known) return casing(word, known, allCaps);
  // short all-caps parts (İK, UFK...) are read letter by letter
  if (word.length <= 4 && isUpper(word) && !allCaps) return [...lower(word)].map(c => RU_CHARS[c] ?? c).join('').toLocaleUpperCase('ru');
  const src = lower(word);
  let out = '';
  for (let i = 0; i < src.length; i++) {
    const pair = RU_PAIRS[src.slice(i, i + 2)];
    if (pair) { out += pair; i++; continue; }
    const c = src[i];
    out += c === 'ə' && i === 0 ? 'а' : RU_CHARS[c] ?? c;
  }
  return casing(word, out, allCaps);
}

/** A team / tournament name written for the given site language (Azerbaijani stays as typed). */
export function localTeamName(name: string | null | undefined, lang: NameLang): string {
  let text = String(name ?? '').trim().replace(/\s+/g, ' ');
  if (!text) return '';
  // a name typed in capitals ("YARIMADA FK U-12") is shown like the others ("Yarımada FK U-12"); short parts (FK, U) stay
  const letters = text.replace(/[^A-Za-zƏəİıÖöÜüŞşÇçĞğ]/g, '');
  if (letters.length > 4 && isUpper(letters)) text = text.replace(LETTERS, w => (w.length > 3 ? w[0] + lower(w.slice(1)) : w));
  if (lang === 'az') return text;
  const allCaps = false;
  return text
    .split(/(\s+)/)
    .map(token => (/^U-?\d+$/i.test(token) ? token : token.replace(LETTERS, w => (lang === 'en' ? enWord(w, allCaps) : ruWord(w, allCaps)))))
    .join('');
}
