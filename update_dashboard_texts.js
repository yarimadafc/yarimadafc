const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');

if (!content.includes("import TextsAdmin")) {
  content = content.replace("import StandingsAdmin from './components/StandingsAdmin';", "import StandingsAdmin from './components/StandingsAdmin';\nimport TextsAdmin from './components/TextsAdmin';");
}

if (!content.includes("setActiveTab('texts')")) {
  // Mobile
  content = content.replace(
    /<button onClick=\{\(\) => setActiveTab\('images'\)\}.*?>Şəkillər<\/button>/,
    "$&" + `\n          <button onClick={() => setActiveTab('texts')} className={\`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors \${activeTab === 'texts' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}\`}>Sayt Yazıları</button>`
  );

  // Desktop
  content = content.replace(
    /<button onClick=\{\(\) => setActiveTab\('images'\)\}.*?>\n\s*<ImageIcon.*\n\s*<span>Sayt Şəkilləri<\/span>\n\s*<\/button>/,
    "$&" + `
            <button onClick={() => setActiveTab('texts')} className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors \${activeTab === 'texts' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}\`}>
              <FileText className="w-4 h-4" />
              <span>Sayt Yazıları</span>
            </button>`
  );
}

if (!content.includes("{activeTab === 'texts' && <TextsAdmin />}")) {
  content = content.replace(
    "{activeTab === 'images' && (",
    "{activeTab === 'texts' && <TextsAdmin />}\n        {activeTab === 'images' && ("
  );
}

fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
