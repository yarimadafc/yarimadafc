const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

if (!content.includes("const [heroTexts")) {
  content = content.replace(
    "export default function HomePage() {",
    `export default function HomePage() {
  const [heroTexts, setHeroTexts] = useState<Record<string, string>>({
    hero_title_1: 'YENİ MÖVSÜM,',
    hero_title_2: 'YENİ HƏDƏFLƏR',
    hero_subtitle: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!'
  });
  const [nextMatch, setNextMatch] = useState<any>(null);`
  );
}

if (!content.includes("await supabase.from('matches').select('*')")) {
  content = content.replace(
    "loadHeroImage();",
    `loadHeroImage();
    
    async function loadData() {
      const { data: texts } = await supabase.from('site_images').select('section_key, image_url').in('section_key', ['hero_title_1', 'hero_title_2', 'hero_subtitle']);
      if (texts) {
        const map: Record<string, string> = { hero_title_1: 'YENİ MÖVSÜM,', hero_title_2: 'YENİ HƏDƏFLƏR', hero_subtitle: 'Gələcəyin çempionları burada yetişir. Böyük hədəflərə doğru birlikdə addımlayırıq!' };
        texts.forEach(t => { map[t.section_key] = t.image_url; });
        setHeroTexts(map);
      }
      const { data: match } = await supabase.from('matches').select('*').order('match_date', { ascending: true }).limit(1).single();
      if (match) setNextMatch(match);
    }
    loadData();`
  );
}

fs.writeFileSync('src/app/page.tsx', content);
