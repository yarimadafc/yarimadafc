const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

if (!content.includes("import MatchesSection")) {
  content = content.replace(
    "import NewsSection from '@/components/home/NewsSection';",
    "import NewsSection from '@/components/home/NewsSection';\nimport MatchesSection from '@/components/home/MatchesSection';"
  );
}

if (!content.includes("<MatchesSection />")) {
  content = content.replace(
    "{/* 5. Yarımada TV */}",
    "{/* 4.5 Oyunlar Təqvimi */}\n        <MatchesSection />\n\n        {/* 5. Yarımada TV */}"
  );
}

fs.writeFileSync('src/app/page.tsx', content);
