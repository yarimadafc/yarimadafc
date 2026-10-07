const fs = require('fs');
let content = fs.readFileSync('src/app/club/page.tsx', 'utf-8');

// Add state for club info
content = content.replace(
  "const [aboutBg, setAboutBg] = useState<string>('/placeholder-hero.jpg');",
  `const [aboutBg, setAboutBg] = useState<string>('/placeholder-hero.jpg');
  const [clubTexts, setClubTexts] = useState<Record<string, string>>({});`
);

// Add fetch inside loadAboutImage
content = content.replace(
  "const { data } = await supabase.from('site_images').select('image_url').eq('section_key', 'about_bg').single();",
  `const keys = [
          'about_bg', 'club_about_1', 'club_about_2',
          'club_mission', 'club_vision', 'club_values',
          'leader_1_name', 'leader_1_role', 'leader_1_img',
          'leader_2_name', 'leader_2_role', 'leader_2_img',
          'leader_3_name', 'leader_3_role', 'leader_3_img'
        ];
        const { data: allData } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
        if (allData) {
          const map: Record<string, string> = {};
          allData.forEach(item => { map[item.section_key] = item.image_url; });
          setClubTexts(map);
          if (map['about_bg']) setAboutBg(map['about_bg']);
        }`
);
content = content.replace(
  "if (data && data.image_url) {\n          setAboutBg(data.image_url);\n        }",
  ""
);

// Delete hardcoded leadership and values
content = content.replace(
  /const leadership = \[\s*\{ name: 'Nağı Əliyev'.*?\];/s,
  `const leadership = [
    { name: clubTexts['leader_1_name'] || 'Nağı Əliyev', role: clubTexts['leader_1_role'] || 'Klubun Təsisçisi və Rəhbəri', image: clubTexts['leader_1_img'] || '/Logo.JPG.jpeg' },
    { name: clubTexts['leader_2_name'] || 'Əhməd Məmmədov', role: clubTexts['leader_2_role'] || 'İdman Direktoru', image: clubTexts['leader_2_img'] || '/Logo.JPG.jpeg' },
    { name: clubTexts['leader_3_name'] || 'Elvin Qasımov', role: clubTexts['leader_3_role'] || 'Baş Koordinator', image: clubTexts['leader_3_img'] || '/Logo.JPG.jpeg' },
  ];`
);

content = content.replace(
  /const values = \[\s*\{ title: 'MİSSİYAMIZ'.*?\];/s,
  `const values = [
    { title: 'MİSSİYAMIZ', desc: clubTexts['club_mission'] || 'Uşaq və gənclərə sağlam həyat tərzini aşılamaq, onlarda daxili intizam, liderlik və kollektivdə işləmək bacarıqlarını inkişaf etdirmək.' },
    { title: 'VİZYONUMUZ', desc: clubTexts['club_vision'] || 'Azərbaycanın ən böyük və peşəkar uşaq futbol akademiyalarından birinə çevrilərək, milli komandalara və peşəkar klublara davamlı oyunçu yetişdirmək.' },
    { title: 'DƏYƏRLƏRİMİZ', desc: clubTexts['club_values'] || 'Hörmət, Dürüstlük, Əzmkarlıq və Sağlam Rəqabət. Biz təkcə yaxşı futbolçu deyil, həm də layiqli vətəndaş yetişdiririk.' }
  ];`
);

// Replace hardcoded about texts
content = content.replace(
  /<p className="text-gray-400 leading-relaxed font-medium">\s*Yarımada Futbol Klubu.*?<\/p>\s*<p className="text-gray-400 leading-relaxed font-medium">\s*Bizim üçün hər bir uşaq.*?<\/p>/s,
  `<p className="text-gray-400 leading-relaxed font-medium">
              {clubTexts['club_about_1'] || 'Yarımada Futbol Klubu uşaq və gənclər futbolunun inkişafı, onlarda idmana sevgi yaratmaq məqsədilə təsis edilmişdir. Yarandığı gündən etibarən klubumuz qısa zamanda böyük uğurlara imza atmış və bir çox istedadlı gəncləri üzə çıxarmışdır.'}
            </p>
            <p className="text-gray-400 leading-relaxed font-medium">
              {clubTexts['club_about_2'] || 'Bizim üçün hər bir uşaq gələcəyin ulduzudur. Mütəxəssis məşqçilərimiz tərəfindən tətbiq olunan xüsusi inkişaf proqramları ilə futbolçularımızın həm fiziki, həm də psixoloji cəhətdən tam hazırlıqlı olmasını təmin edirik.'}
            </p>`
);

fs.writeFileSync('src/app/club/page.tsx', content);
