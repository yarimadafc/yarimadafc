const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');

// Add imports
if (!content.includes('import LeadershipAdmin')) {
  content = content.replace(
    "import ShopAdmin from './components/ShopAdmin';",
    "import ShopAdmin from './components/ShopAdmin';\nimport LeadershipAdmin from './components/LeadershipAdmin';\nimport CoachCoursesAdmin from './components/CoachCoursesAdmin';"
  );
}

// Add tabs in render
content = content.replace(
  "{ id: 'texts', label: 'Mətnlər', icon: FileText },",
  "{ id: 'leadership', label: 'Rəhbərlik', icon: Users },\n            { id: 'courses', label: 'Məşqçi Kursu', icon: Video },\n            { id: 'texts', label: 'Mətnlər', icon: FileText },"
);

// Add component render
content = content.replace(
  "{activeTab === 'texts' && <TextsAdmin />}",
  "{activeTab === 'leadership' && <LeadershipAdmin />}\n        {activeTab === 'courses' && <CoachCoursesAdmin />}\n        {activeTab === 'texts' && <TextsAdmin />}"
);

// We should also check if "Users" is imported. I see "Users" might not be in lucide-react import
// "Users, PlayCircle, ShoppingCart"
content = content.replace(
  "LayoutDashboard, Settings, Trash2, ShoppingCart } from 'lucide-react'",
  "LayoutDashboard, Settings, Trash2, ShoppingCart, Users, PlayCircle } from 'lucide-react'"
);

fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
