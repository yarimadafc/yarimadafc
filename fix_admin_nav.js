const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboard.tsx', 'utf-8');

// The mobile nav
content = content.replace(
  /<button onClick=\{\(\) => setActiveTab\('standings'\)\}.*?\n.*?\n.*?<\/button>\n.*?<button onClick=\{\(\) => setActiveTab\('matches'\)\}.*?\n.*?\n.*?<\/button>/g,
  ""
);

content = content.replace(
  /<button onClick=\{\(\) => setActiveTab\('sponsors'\)\} className=\{`flex-shrink-0[^>]+>Sponsorlar<\/button>/,
  `$&
          <button onClick={() => setActiveTab('standings')} className={\`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors \${activeTab === 'standings' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}\`}>Turnir Cədvəli</button>
          <button onClick={() => setActiveTab('matches')} className={\`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors \${activeTab === 'matches' ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400'}\`}>Oyunlar</button>`
);

// The desktop nav
if (!content.includes("<span>Turnir Cədvəli</span>\n            </button>")) {
  content = content.replace(
    /<button onClick=\{\(\) => setActiveTab\('sponsors'\)\} className=\{`w-full flex items-center space-x-3[^>]+>\n              <DollarSign className="w-4 h-4" \/>\n              <span>Sponsorlar<\/span>\n            <\/button>/,
    `$&
            <button onClick={() => setActiveTab('standings')} className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors \${activeTab === 'standings' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}\`}>
              <Trophy className="w-4 h-4" />
              <span>Turnir Cədvəli</span>
            </button>
            <button onClick={() => setActiveTab('matches')} className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors \${activeTab === 'matches' ? 'bg-[#d7bf7b] text-[#152741]' : 'text-gray-400 hover:text-white hover:bg-[#0d1a2d]'}\`}>
              <CheckCircle className="w-4 h-4" />
              <span>Oyunlar</span>
            </button>`
  );
}

fs.writeFileSync('src/app/admin/AdminDashboard.tsx', content);
