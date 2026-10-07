const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/VideosAdmin.tsx', 'utf-8');

content = content.replace(
  "const [isAdding, setIsAdding] = useState(false);",
  "const [isAdding, setIsAdding] = useState(false);\n  const [editingId, setEditingId] = useState<string | null>(null);"
);

content = content.replace(
  "const handleAddVideo = async (e: React.FormEvent) => {",
  `const handleEdit = (v: any) => {
    setTitle(v.title);
    setUrl(v.url);
    setEditingId(v.id);
    setIsAdding(true);
  };

  const handleAddVideo = async (e: React.FormEvent) => {`
);

content = content.replace(
  /const \{ error \} = await supabase\.from\('videos'\)\.insert\(\[\{\s*title,\s*url,\s*thumbnail_url: thumbUrl,\s*published_date: new Date\(\)\.toISOString\(\)\s*\}\]\);/,
  `let error;
    if (editingId) {
      const res = await supabase.from('videos').update({ 
        title, 
        url, 
        thumbnail_url: thumbUrl 
      }).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('videos').insert([{ 
        title, 
        url, 
        thumbnail_url: thumbUrl, 
        published_date: new Date().toISOString() 
      }]);
      error = res.error;
    }`
);

content = content.replace(
  "alert('Video əlavə edildi!');",
  "alert(editingId ? 'Video yeniləndi!' : 'Video əlavə edildi!');"
);

content = content.replace(
  "setTitle(''); setUrl('');",
  "setTitle(''); setUrl(''); setEditingId(null);"
);

content = content.replace(
  "<span>Ləğv Et</span>",
  "<span onClick={() => { setEditingId(null); setTitle(''); setUrl(''); }}>Ləğv Et</span>"
);

content = content.replace(
  /<button onClick=\{\(\) => handleDelete\(v\.id\)\} className="mt-2 flex items-center justify-center space-x-2 text-red-400/g,
  `<div className="mt-2 flex space-x-2">
     <button onClick={() => handleEdit(v)} className="flex-1 flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 py-2 rounded-lg transition-colors text-xs font-bold uppercase">
       Düzəliş
     </button>
     <button onClick={() => handleDelete(v.id)} className="flex-1 flex items-center justify-center space-x-2 text-red-400`
);

content = content.replace(
  /<span>Sil<\/span>\s*<\/button>/,
  `<span>Sil</span>\n                   </button>\n                 </div>`
);

fs.writeFileSync('src/app/admin/components/VideosAdmin.tsx', content);
