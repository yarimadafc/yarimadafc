const fs = require('fs');

let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf8');

if (!content.includes('import HeroAdmin')) {
  content = content.replace("import VideosAdmin from './components/VideosAdmin';", "import VideosAdmin from './components/VideosAdmin';\nimport HeroAdmin from './components/HeroAdmin';");
  
  content = content.replace(
    "{ id: 'teams', label: 'Komandalar & Oyunçular', icon: Users },",
    "{ id: 'teams', label: 'Komandalar & Oyunçular', icon: Users },\n    { id: 'hero', label: 'Ana Səhifə Karuseli', icon: Image },"
  );
  
  content = content.replace(
    "{activeTab === 'videos' && <VideosAdmin />}",
    "{activeTab === 'videos' && <VideosAdmin />}\n          {activeTab === 'hero' && <HeroAdmin />}"
  );
  
  // Also import Image icon if missing
  content = content.replace("Video,", "Video, Image,");
  
  fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content, 'utf8');
}
