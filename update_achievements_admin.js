const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/AchievementsAdmin.tsx', 'utf-8');

// Add edit support and Trophy Form
content = content.replace(
  "const [orderNum, setOrderNum] = useState(0);",
  "const [orderNum, setOrderNum] = useState(0);\n  const [editingId, setEditingId] = useState<string | null>(null);"
);

content = content.replace(
  "const handleAdd = async (e: React.FormEvent) => {",
  `const handleEdit = (a: any) => {
    setTitle(a.title);
    setCount(a.count);
    setOrderNum(a.order_num);
    setEditingId(a.id);
    setIsAdding(true);
  };

  const handleAdd = async (e: React.FormEvent) => {`
);

content = content.replace(
  /const \{ error \} = await supabase\.from\('achievements'\)\.insert\(\[\{ title, count, order_num: orderNum \}\]\);/,
  `let error;
    if (editingId) {
      const res = await supabase.from('achievements').update({ title, count, order_num: orderNum }).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('achievements').insert([{ title, count, order_num: orderNum }]);
      error = res.error;
    }`
);

content = content.replace(
  "alert('Əlavə edildi!');",
  "alert(editingId ? 'Yeniləndi!' : 'Əlavə edildi!');"
);

content = content.replace(
  "setTitle(''); setCount(''); setOrderNum(0);",
  "setTitle(''); setCount(''); setOrderNum(0); setEditingId(null);"
);

content = content.replace(
  "<span>Ləğv Et</span>",
  "<span onClick={() => { setEditingId(null); setTitle(''); setCount(''); setOrderNum(0); }}>Ləğv Et</span>"
);

// Form updates
content = content.replace(
  /<div>\s*<label className="block text-gray-400 text-xs font-bold uppercase mb-2">Sıra<\/label>\s*<input type="number" value=\{orderNum\} onChange=\{e => setOrderNum\(Number\(e.target.value\)\)\} className="w-full bg-\[#0d1a2d\] border border-gray-700 rounded-lg p-3 text-white focus:border-\[#d7bf7b\] outline-none" \/>\s*<\/div>/,
  `<div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Kubok Forması</label>
            <select value={orderNum} onChange={e => setOrderNum(Number(e.target.value))} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white focus:border-[#d7bf7b] outline-none">
              <option value={1}>1-ci Yer (Qızıl)</option>
              <option value={2}>2-ci Yer (Gümüş)</option>
              <option value={3}>3-cü Yer (Bürünc)</option>
              <option value={0}>Digər Uğur</option>
            </select>
          </div>`
);

// Table updates
content = content.replace(
  /<th className="p-4">Sıra<\/th>/,
  `<th className="p-4 text-center">Növ</th>`
);

content = content.replace(
  /<td className="p-4 text-gray-400">\{a\.order_num\}<\/td>/,
  `<td className="p-4 text-center">
                  {a.order_num === 1 && <span className="text-yellow-500 font-bold">1-ci</span>}
                  {a.order_num === 2 && <span className="text-gray-300 font-bold">2-ci</span>}
                  {a.order_num === 3 && <span className="text-orange-400 font-bold">3-cü</span>}
                  {a.order_num === 0 && <span className="text-blue-400 font-bold">Digər</span>}
                </td>`
);

content = content.replace(
  /<button onClick=\{\(\) => handleDelete\(a\.id\)\} className="text-red-400 hover:text-red-300 transition-colors p-2 bg-red-400\/10 rounded-lg">/,
  `<button onClick={() => handleEdit(a)} className="text-blue-400 hover:text-blue-300 transition-colors p-2 bg-blue-400/10 rounded-lg mr-2">Düzəliş</button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300 transition-colors p-2 bg-red-400/10 rounded-lg">`
);

fs.writeFileSync('src/app/admin/components/AchievementsAdmin.tsx', content);
