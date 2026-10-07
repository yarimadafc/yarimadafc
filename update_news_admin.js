const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/NewsAdmin.tsx', 'utf-8');

// Add edit state
content = content.replace(
  "const [isAdding, setIsAdding] = useState(false);",
  "const [isAdding, setIsAdding] = useState(false);\n  const [editingId, setEditingId] = useState<string | null>(null);"
);

// Modify handleAddNews to support editing
content = content.replace(
  "const handleAddNews = async (e: React.FormEvent) => {",
  `const handleEdit = (newsItem: any) => {
    setTitle(newsItem.title_az);
    setContent(newsItem.content_az);
    setCategory(newsItem.category || 'Əsas Komanda');
    setImageUrl(newsItem.image_url || '');
    setEditingId(newsItem.id);
    setIsAdding(true);
  };

  const handleAddNews = async (e: React.FormEvent) => {`
);

content = content.replace(
  /const { error } = await supabase\.from\('news'\)\.insert\(\[\{\s*title_az: title,\s*content_az: content,\s*category: category,\s*image_url: imageUrl,\s*published: true\s*\}\]\);/,
  `let error;
    if (editingId) {
      const res = await supabase.from('news').update({ 
        title_az: title, 
        content_az: content, 
        category: category,
        image_url: imageUrl 
      }).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('news').insert([{ 
        title_az: title, 
        content_az: content, 
        category: category,
        image_url: imageUrl,
        published: true
      }]);
      error = res.error;
    }`
);

content = content.replace(
  "alert('Xəbər əlavə edildi!');",
  "alert(editingId ? 'Xəbər yeniləndi!' : 'Xəbər əlavə edildi!');"
);

content = content.replace(
  "setTitle(''); setContent(''); setImageUrl(''); setCategory('Əsas Komanda');",
  "setTitle(''); setContent(''); setImageUrl(''); setCategory('Əsas Komanda'); setEditingId(null);"
);

content = content.replace(
  "<span>Ləğv Et</span>",
  "<span onClick={() => { setEditingId(null); setTitle(''); setContent(''); setImageUrl(''); }}>Ləğv Et</span>"
);

content = content.replace(
  /<button onClick=\{\(\) => handleDelete\(n\.id\)\} className="mt-4 flex items-center justify-center space-x-2 text-red-400/g,
  `<div className="mt-4 flex space-x-2">
     <button onClick={() => handleEdit(n)} className="flex-1 flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 py-2 rounded-lg transition-colors text-xs font-bold uppercase">
       Düzəliş
     </button>
     <button onClick={() => handleDelete(n.id)} className="flex-1 flex items-center justify-center space-x-2 text-red-400`
);

content = content.replace(
  /<span>Sil<\/span>\s*<\/button>/,
  `<span>Sil</span>\n                   </button>\n                 </div>`
);

fs.writeFileSync('src/app/admin/components/NewsAdmin.tsx', content);
