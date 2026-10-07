const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');

if (!content.includes("import CoachesAdmin")) {
  content = content.replace("import ClubAdmin from './components/ClubAdmin';", "import ClubAdmin from './components/ClubAdmin';\nimport CoachesAdmin from './components/CoachesAdmin';\nimport TeamsAdmin from './components/TeamsAdmin';");
}

if (!content.includes("setActiveTab('teams')")) {
  // Mobile
  content = content.replace(
    /<button onClick=\{\(\) => setActiveTab\('club'\)\}.*?>Klub<\/button>/,
    "$&" + `
          <button onClick={() => setActiveTab('coaches')} className={\`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors \${activeTab === 'coaches' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}\`}>Məşqçilər</button>
          <button onClick={() => setActiveTab('teams')} className={\`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors \${activeTab === 'teams' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}\`}>Komandalar</button>`
  );

  // Desktop
  content = content.replace(
    /<button onClick=\{\(\) => setActiveTab\('club'\)\}.*?>\n\s*<FileText.*\n\s*<span>Klub \(Haqqımızda\)<\/span>\n\s*<\/button>/,
    "$&" + `
            <button onClick={() => setActiveTab('coaches')} className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors \${activeTab === 'coaches' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}\`}>
              <CheckCircle className="w-4 h-4" />
              <span>Məşqçilər</span>
            </button>
            <button onClick={() => setActiveTab('teams')} className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors \${activeTab === 'teams' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}\`}>
              <CheckCircle className="w-4 h-4" />
              <span>Komandalar</span>
            </button>`
  );
}

if (!content.includes("{activeTab === 'teams' && <TeamsAdmin />}")) {
  content = content.replace(
    "{activeTab === 'club' && <ClubAdmin />}",
    "{activeTab === 'club' && <ClubAdmin />}\n        {activeTab === 'coaches' && <CoachesAdmin />}\n        {activeTab === 'teams' && <TeamsAdmin />}"
  );
}

fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
