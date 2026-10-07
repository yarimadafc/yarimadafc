const fs = require('fs');

let content = fs.readFileSync('src/app/standings/page.tsx', 'utf8');

// Title margin
content = content.replace('mb-8 border-b border-bg-border pb-4 flex items-center', 'mt-12 mb-8 border-b border-bg-border pb-4 flex items-center');

// Tabs state
content = content.replace('const [loading, setLoading] = useState(true);', 'const [loading, setLoading] = useState(true);\n  const [activeTab, setActiveTab] = useState("standings");\n  const [results, setResults] = useState<any[]>([]);');

// Fetch results
const fetchResults = `
    async function loadResults() {
      const { data } = await supabase.from('matches').select('*').eq('status', 'finished').order('date', { ascending: false });
      if (data) setResults(data);
    }
    loadResults();
`;
content = content.replace('loadStandings();', 'loadStandings();\n' + fetchResults);

// Sidebar logic
const oldSidebar = `<div className="w-full lg:w-1/4 flex flex-col space-y-2 border-r border-bg-border pr-4">
             <div className="bg-bg-sec text-text-main p-4 rounded-lg font-bold flex items-center justify-between cursor-pointer border-l-4 border-accent">
               <span>Turnir cədvəli</span>
               <ChevronRight className="w-4 h-4 text-accent" />
             </div>
             <div className="text-text-sec p-4 rounded-lg font-bold hover:bg-bg-sec hover:text-text-main transition-colors cursor-pointer flex items-center justify-between">
               <span>Təqvim</span>
               <ChevronRight className="w-4 h-4" />
             </div>
             <div className="text-text-sec p-4 rounded-lg font-bold hover:bg-bg-sec hover:text-text-main transition-colors cursor-pointer flex items-center justify-between">
               <span>Nəticələr</span>
               <ChevronRight className="w-4 h-4" />
             </div>
          </div>`;

const newSidebar = `<div className="w-full lg:w-1/4 flex flex-col space-y-2 border-r border-bg-border pr-4">
             <div onClick={() => setActiveTab('standings')} className={\`\${activeTab === 'standings' ? 'bg-bg-sec text-text-main border-l-4 border-accent' : 'text-text-sec hover:bg-bg-sec hover:text-text-main'} p-4 rounded-lg font-bold flex items-center justify-between cursor-pointer transition-colors\`}>
               <span>Turnir cədvəli</span>
               {activeTab === 'standings' && <ChevronRight className="w-4 h-4 text-accent" />}
             </div>
             <div onClick={() => setActiveTab('results')} className={\`\${activeTab === 'results' ? 'bg-bg-sec text-text-main border-l-4 border-accent' : 'text-text-sec hover:bg-bg-sec hover:text-text-main'} p-4 rounded-lg font-bold flex items-center justify-between cursor-pointer transition-colors\`}>
               <span>Nəticələr</span>
               {activeTab === 'results' && <ChevronRight className="w-4 h-4 text-accent" />}
             </div>
          </div>`;

content = content.replace(oldSidebar, newSidebar);

// Render results or standings based on tab
const renderBody = `
            {loading ? (
              <div className="text-center py-20 text-accent font-medium text-sm">Yüklənir...</div>
            ) : activeTab === 'standings' ? (
`;

content = content.replace(`{loading ? (
              <div className="text-center py-20 text-accent font-medium text-sm">Yüklənir...</div>
            ) : (`, renderBody);


const resultsComponent = `
            ) : (
              <div className="space-y-4">
                {results.filter(r => (r.tournament || leagues[0]) === activeLeague).map(m => (
                  <div key={m.id} className="bg-bg-sec rounded-xl p-4 border border-bg-border flex items-center justify-between">
                    <div className="flex flex-col items-center w-1/3">
                      <span className="text-text-main font-bold text-sm uppercase">{m.home_team}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                       <span className="text-accent font-black text-xl">{m.home_score} - {m.away_score}</span>
                       <span className="text-text-sec text-[10px] mt-1">{m.date}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                      <span className="text-text-main font-bold text-sm uppercase">{m.away_team}</span>
                    </div>
                  </div>
                ))}
                {results.filter(r => (r.tournament || leagues[0]) === activeLeague).length === 0 && (
                  <div className="text-center py-20 text-text-sec font-medium">Bu qrup üzrə nəticə tapılmadı.</div>
                )}
              </div>
            )}
`;

content = content.replace('</table>\n              </div>\n            )}', '</table>\n              </div>\n' + resultsComponent);


fs.writeFileSync('src/app/standings/page.tsx', content, 'utf8');
