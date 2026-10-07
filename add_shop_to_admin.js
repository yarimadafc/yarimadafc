const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');

// Import ShopAdmin
if (!content.includes('ShopAdmin')) {
  content = content.replace(
    "import SponsorsAdmin from './components/SponsorsAdmin';",
    "import SponsorsAdmin from './components/SponsorsAdmin';\nimport ShopAdmin from './components/ShopAdmin';"
  );
}

// Add icon
if (!content.includes('ShoppingCart')) {
  content = content.replace(
    "DollarSign, LayoutDashboard, Settings, Trash2 } from 'lucide-react';",
    "DollarSign, LayoutDashboard, Settings, Trash2, ShoppingCart } from 'lucide-react';"
  );
}

// Add to Sidebar
content = content.replace(
  /<button onClick=\{\(\) => setActiveTab\('matches'\)\}.*?<\/button>/,
  `$&
            <button onClick={() => setActiveTab('shop')} className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors \${activeTab === 'shop' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}\`}>
              <ShoppingCart className="w-4 h-4" />
              <span>Mağaza</span>
            </button>`
);

// Add to Topbar mobile
content = content.replace(
  /<button onClick=\{\(\) => setActiveTab\('matches'\)\}.*?<\/button>/,
  `$&
          <button onClick={() => setActiveTab('shop')} className={\`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors \${activeTab === 'shop' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}\`}>Mağaza</button>`
);

// Render ShopAdmin
content = content.replace(
  /\{activeTab === 'matches' && <MatchesAdmin \/>\}/,
  `$&
        {activeTab === 'shop' && <ShopAdmin />}`
);

fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
