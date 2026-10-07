const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/TeamsAdmin.tsx', 'utf-8');

// Add uploading state for player image
content = content.replace(
  "const [playerImage, setPlayerImage] = useState('');",
  "const [playerImage, setPlayerImage] = useState('');\n  const [uploadingPlayerImg, setUploadingPlayerImg] = useState(false);"
);

// Replace player image URL input
content = content.replace(
  /<div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Şəkil URL<\/label><input type="text" value=\{playerImage\} onChange=\{e => setPlayerImage\(e\.target\.value\)\} className="w-full bg-\[#0d1a2d\] border border-gray-700 rounded-lg p-3 text-white" \/><\/div>/,
  `<div className="col-span-2 md:col-span-1">
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Oyunçu Şəkli</label>
                    {playerImage ? (
                      <div className="relative w-12 h-12 bg-[#0d1a2d] border border-gray-700 rounded-full overflow-hidden group">
                        <img src={playerImage} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setPlayerImage('')} className="absolute inset-0 bg-red-500/80 text-white text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">SIL</button>
                      </div>
                    ) : (
                      <label className={\`flex items-center space-x-2 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-[#d7bf7b] transition-colors \${uploadingPlayerImg ? 'opacity-50' : ''}\`}>
                        <UploadCloud className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-gray-400 text-[10px] font-bold uppercase truncate">{uploadingPlayerImg ? 'Yüklənir...' : 'Cihazdan Şəkil Seç'}</span>
                        <input 
                          type="file" accept="image/*" className="hidden" disabled={uploadingPlayerImg}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadingPlayerImg(true);
                              try {
                                const base64 = await compressImage(e.target.files[0]);
                                const res = await fetch('/api/upload', { method: 'POST', body: JSON.stringify({ image: base64 }) });
                                const data = await res.json();
                                if (data.url) setPlayerImage(data.url);
                              } catch (err) {}
                              setUploadingPlayerImg(false);
                            }
                          }} 
                        />
                      </label>
                    )}
                  </div>`
);

fs.writeFileSync('src/app/admin/components/TeamsAdmin.tsx', content);
