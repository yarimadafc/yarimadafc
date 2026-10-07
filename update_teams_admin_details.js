const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/TeamsAdmin.tsx', 'utf-8');

content = content.replace("import { Plus, Trash2 } from 'lucide-react';", "import { Plus, Trash2, UploadCloud, Save } from 'lucide-react';\nimport { compressImage } from '@/lib/imageCompress';");

// Add team details states
content = content.replace(
  "const [isAddingPlayer, setIsAddingPlayer] = useState(false);",
  `const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  
  // Team details states
  const [teamPos, setTeamPos] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [teamImg, setTeamImg] = useState('');
  const [uploadingTeamImg, setUploadingTeamImg] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);`
);

// Fetch team details when selecting a team
content = content.replace(
  "const handleSelectTeam = (teamId: string) => {",
  `const handleSelectTeam = async (teamId: string) => {
    setSelectedTeamId(teamId);
    fetchPlayers(teamId);
    setIsAddingPlayer(false);
    
    // Load team extra details from site_images
    setTeamPos(''); setTeamDesc(''); setTeamImg('');
    const keys = [\`team_\${teamId}_pos\`, \`team_\${teamId}_desc\`, \`team_\${teamId}_img\`];
    const { data } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
    if (data) {
      data.forEach(item => {
        if (item.section_key.endsWith('_pos')) setTeamPos(item.image_url);
        if (item.section_key.endsWith('_desc')) setTeamDesc(item.image_url);
        if (item.section_key.endsWith('_img')) setTeamImg(item.image_url);
      });
    }
  };
  
  const handleSelectTeamOld = (teamId: string) => {`
);
content = content.replace("handleSelectTeamOld", "ignoreThisFunction");

// handleSaveTeamDetails
content = content.replace(
  "const handleDeleteTeam = async (id: string) => {",
  `const handleSaveTeamDetails = async () => {
    if (!selectedTeamId) return;
    setSavingDetails(true);
    
    const details = [
      { key: \`team_\${selectedTeamId}_pos\`, val: teamPos },
      { key: \`team_\${selectedTeamId}_desc\`, val: teamDesc },
      { key: \`team_\${selectedTeamId}_img\`, val: teamImg }
    ];

    for (const d of details) {
      const { data } = await supabase.from('site_images').select('id').eq('section_key', d.key).single();
      if (data) {
        await supabase.from('site_images').update({ image_url: d.val }).eq('section_key', d.key);
      } else {
        await supabase.from('site_images').insert([{ section_key: d.key, image_url: d.val }]);
      }
    }
    
    setSavingDetails(false);
    alert('Komanda məlumatları yadda saxlanıldı!');
  };

  const handleDeleteTeam = async (id: string) => {`
);

// Insert UI above players
content = content.replace(
  /<div className="flex justify-between items-center mb-4">\s*<h3 className="text-white font-bold uppercase tracking-widest text-sm">Oyunçular<\/h3>/,
  `<div className="mb-10 bg-[#152741] border border-[#d7bf7b]/30 p-6 rounded-2xl">
                <h3 className="text-[#d7bf7b] font-bold uppercase tracking-widest text-sm mb-4">Komandanın Ümumi Məlumatları</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Cari Mövqe</label>
                    <input type="text" value={teamPos} onChange={e => setTeamPos(e.target.value)} placeholder="Məs: 3-cü yer" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Şəkli (16:9 formatı)</label>
                    {teamImg ? (
                      <div className="relative w-full h-[50px] bg-[#0d1a2d] border border-gray-700 rounded-lg overflow-hidden group">
                        <img src={teamImg} alt="Preview" className="w-full h-full object-cover opacity-50" />
                        <button type="button" onClick={() => setTeamImg('')} className="absolute inset-0 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-red-500/80 transition-colors">Şəkli Sil</button>
                      </div>
                    ) : (
                      <label className={\`w-full h-[50px] flex items-center justify-center space-x-2 bg-[#0d1a2d] border border-gray-700 rounded-lg cursor-pointer hover:border-[#d7bf7b] transition-colors \${uploadingTeamImg ? 'opacity-50' : ''}\`}>
                        <UploadCloud className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-[10px] font-bold uppercase">{uploadingTeamImg ? 'Yüklənir...' : 'Cihazdan Şəkil Seç'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          disabled={uploadingTeamImg}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadingTeamImg(true);
                              try {
                                const base64 = await compressImage(e.target.files[0], 1200);
                                const res = await fetch('/api/upload', { method: 'POST', body: JSON.stringify({ image: base64 }) });
                                const data = await res.json();
                                if (data.url) setTeamImg(data.url);
                              } catch (err) {}
                              setUploadingTeamImg(false);
                            }
                          }} 
                        />
                      </label>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Əlavə Məlumat</label>
                    <textarea value={teamDesc} onChange={e => setTeamDesc(e.target.value)} placeholder="Komanda haqqında qısa məlumat..." className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white h-20" />
                  </div>
                </div>
                <button onClick={handleSaveTeamDetails} disabled={savingDetails} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
                  <Save className="w-4 h-4" /> <span>{savingDetails ? 'Saxlanılır...' : 'Məlumatları Yadda Saxla'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm">Oyunçular</h3>`
);

fs.writeFileSync('src/app/admin/components/TeamsAdmin.tsx', content);
