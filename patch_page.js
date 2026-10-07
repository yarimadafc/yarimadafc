const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

if (!content.includes('import MatchesSection')) {
  content = content.replace(
    "import MatchesAndStandings from '@/components/home/MatchesAndStandings';",
    "import MatchesAndStandings from '@/components/home/MatchesAndStandings';\nimport MatchesSection from '@/components/home/MatchesSection';"
  );

  const newLayout = `
        {/* 2. Xəbərlər (News) - Overlaps Hero */}
        <div className="-mt-32 relative z-20">
          <NewsSection />
        </div>

        {/* 3. Təqvim və nəticələr (Matches) */}
        <MatchesSection />

        {/* 4. Turnir cədvəli & Növbəti oyunlar (Standings) */}
        <MatchesAndStandings />
        
        <QuickLinks />

        {/* 5. Yarımada TV */}
        <CoachCoursesSection />
        <VideoSection />

        {/* 6. Nailiyyətlər */}
        <Achievements />
`;

  content = content.replace(/\{\/\* 2\. Sürətli Keçidlər[\s\S]*<Achievements \/>/m, newLayout.trim());
  fs.writeFileSync('src/app/page.tsx', content, 'utf8');
}
