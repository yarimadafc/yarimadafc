const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');

if (!content.includes("import StandingsAdmin")) {
  content = content.replace("import VideosAdmin from './components/VideosAdmin';", "import VideosAdmin from './components/VideosAdmin';\nimport StandingsAdmin from './components/StandingsAdmin';\nimport MatchesAdmin from './components/MatchesAdmin';");
}

if (!content.includes("onClick={() => setActiveTab('standings')}")) {
  content = content.replace(
    /<button onClick=\{\(\) => setActiveTab\('sponsors'\)\}.*Sponsorlar<\/button>/,
    "$&" + `
            <button onClick={() => setActiveTab('standings')} className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors \${activeTab === 'standings' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}\`}>
              <Trophy className="w-4 h-4" /> <span>Turnir Cədvəli</span>
            </button>
            <button onClick={() => setActiveTab('matches')} className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors \${activeTab === 'matches' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}\`}>
              <CheckCircle className="w-4 h-4" /> <span>Oyunlar</span>
            </button>`
  );
}

if (!content.includes("{activeTab === 'standings' && <StandingsAdmin />}")) {
  content = content.replace(
    "{activeTab === 'sponsors' && <SponsorsAdmin />}",
    "{activeTab === 'sponsors' && <SponsorsAdmin />}\n          {activeTab === 'standings' && <StandingsAdmin />}\n          {activeTab === 'matches' && <MatchesAdmin />}"
  );
}

fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
