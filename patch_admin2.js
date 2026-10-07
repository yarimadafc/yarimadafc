const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf8');

if (!content.includes('import TransfersAdmin')) {
  content = content.replace("import HeroAdmin from './components/HeroAdmin';", "import HeroAdmin from './components/HeroAdmin';\nimport TransfersAdmin from './components/TransfersAdmin';");
  
  content = content.replace(
    "{ id: 'sponsors', label: 'Sponsorlar', icon: Image },",
    "{ id: 'sponsors', label: 'Sponsorlar', icon: Image },\n    { id: 'transfers', label: 'Transferlər', icon: Users },"
  );
  
  content = content.replace(
    "{activeTab === 'sponsors' && <SponsorsAdmin />}",
    "{activeTab === 'sponsors' && <SponsorsAdmin />}\n          {activeTab === 'transfers' && <TransfersAdmin />}"
  );
  
  fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content, 'utf8');
}
