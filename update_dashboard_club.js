const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');

if (!content.includes("import ClubAdmin")) {
  content = content.replace("import TextsAdmin from './components/TextsAdmin';", "import TextsAdmin from './components/TextsAdmin';\nimport ClubAdmin from './components/ClubAdmin';");
}

if (!content.includes("setActiveTab('club')")) {
  // Mobile
  content = content.replace(
    /<button onClick=\{\(\) => setActiveTab\('texts'\)\}.*?>Sayt Yazıları<\/button>/,
    "$&" + `\n          <button onClick={() => setActiveTab('club')} className={\`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors \${activeTab === 'club' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}\`}>Klub</button>`
  );

  // Desktop
  content = content.replace(
    /<button onClick=\{\(\) => setActiveTab\('texts'\)\}.*?>\n\s*<FileText.*\n\s*<span>Sayt Yazıları<\/span>\n\s*<\/button>/,
    "$&" + `\n            <button onClick={() => setActiveTab('club')} className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors \${activeTab === 'club' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}\`}>\n              <FileText className="w-4 h-4" />\n              <span>Klub (Haqqımızda)</span>\n            </button>`
  );
}

if (!content.includes("{activeTab === 'club' && <ClubAdmin />}")) {
  content = content.replace(
    "{activeTab === 'texts' && <TextsAdmin />}",
    "{activeTab === 'texts' && <TextsAdmin />}\n        {activeTab === 'club' && <ClubAdmin />}"
  );
}

fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
