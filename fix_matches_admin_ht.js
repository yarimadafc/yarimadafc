const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/MatchesAdmin.tsx', 'utf-8');

// Add ht state
content = content.replace(
  "const [h1, setH1] = useState(45);",
  "const [h1, setH1] = useState(45);\n  const [ht, setHt] = useState(15);"
);

// Add to handleEdit
content = content.replace(
  "setH1(m.half_1_duration || 45);",
  "setH1(m.half_1_duration || 45);\n    setHt(m.halftime_duration || 15);"
);

// Add to resetForm
content = content.replace(
  "setH1(45); setH2(45);",
  "setH1(45); setHt(15); setH2(45);"
);

// Add to payload
content = content.replace(
  "half_1_duration: h1,",
  "half_1_duration: h1,\n      halftime_duration: ht,"
);

// Add input field in UI
const oldInputs = `<div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0d1a2d] p-4 rounded-xl border border-gray-800">
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">1-ci hissə (Dəq)</label>
                  <input type="number" value={h1} onChange={e => setH1(Number(e.target.value))} className="w-full bg-[#152741] border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">2-ci hissə (Dəq)</label>
                  <input type="number" value={h2} onChange={e => setH2(Number(e.target.value))} className="w-full bg-[#152741] border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">1-ci Hissəyə Əlavə</label>
                  <input type="number" value={ex1} onChange={e => setEx1(Number(e.target.value))} className="w-full bg-[#152741] border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">2-ci Hissəyə Əlavə</label>
                  <input type="number" value={ex2} onChange={e => setEx2(Number(e.target.value))} className="w-full bg-[#152741] border border-gray-700 rounded p-2 text-white" />
                </div>
              </div>`;

const newInputs = `<div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-[#0d1a2d] p-4 rounded-xl border border-gray-800">
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">1-ci hissə (Dəq)</label>
                  <input type="number" value={h1} onChange={e => setH1(Number(e.target.value))} className="w-full bg-[#152741] border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Fasilə (Dəq)</label>
                  <input type="number" value={ht} onChange={e => setHt(Number(e.target.value))} className="w-full bg-[#152741] border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">2-ci hissə (Dəq)</label>
                  <input type="number" value={h2} onChange={e => setH2(Number(e.target.value))} className="w-full bg-[#152741] border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">1-ci hissəyə əlavə</label>
                  <input type="number" value={ex1} onChange={e => setEx1(Number(e.target.value))} className="w-full bg-[#152741] border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">2-ci hissəyə əlavə</label>
                  <input type="number" value={ex2} onChange={e => setEx2(Number(e.target.value))} className="w-full bg-[#152741] border border-gray-700 rounded p-2 text-white" />
                </div>
              </div>`;

content = content.replace(oldInputs, newInputs);
fs.writeFileSync('src/app/admin/components/MatchesAdmin.tsx', content);
