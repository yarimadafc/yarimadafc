const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/SponsorsAdmin.tsx', 'utf-8');

// Add editingId state
content = content.replace(
  "const [logoUrl, setLogoUrl] = useState('');",
  "const [logoUrl, setLogoUrl] = useState('');\n  const [editingId, setEditingId] = useState<string | null>(null);"
);

// Update isAdding toggle to clear form
content = content.replace(
  "onClick={() => setIsAdding(!isAdding)}",
  "onClick={() => { setIsAdding(!isAdding); setEditingId(null); setName(''); setLogoUrl(''); }}"
);

// Add handleEdit function
content = content.replace(
  "const handleAdd = async (e: React.FormEvent) => {",
  `const handleEdit = (s: any) => {
    setName(s.name);
    setLogoUrl(s.logo_url);
    setEditingId(s.id);
    setIsAdding(true);
  };\n\n  const handleAdd = async (e: React.FormEvent) => {`
);

// Update handleAdd to handle updates
content = content.replace(
  "const { error } = await supabase.from('sponsors').insert([{ name, logo_url: logoUrl }]);",
  `let error;
    if (editingId) {
      const res = await supabase.from('sponsors').update({ name, logo_url: logoUrl }).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('sponsors').insert([{ name, logo_url: logoUrl }]);
      error = res.error;
    }`
);

// Update handleAdd alert message
content = content.replace(
  "alert('Sponsor əlavə edildi!');",
  "alert(editingId ? 'Sponsor yeniləndi!' : 'Sponsor əlavə edildi!');"
);

// Add editingId null reset
content = content.replace(
  "setName(''); setLogoUrl('');",
  "setName(''); setLogoUrl(''); setEditingId(null);"
);

// Add edit button to UI
content = content.replace(
  /<button onClick=\{.*?handleDelete\(s\.id\).*?>[\s\S]*?<\/button>/,
  `<div className="flex space-x-4 w-full justify-center">
                <button onClick={() => handleEdit(s)} className="text-blue-400 text-xs font-bold uppercase flex items-center justify-center hover:text-blue-300">
                  Düzəliş
                </button>
                <button onClick={() => handleDelete(s.id)} className="text-red-500 text-xs font-bold uppercase flex items-center justify-center space-x-1 hover:text-red-400">
                  <Trash2 className="w-3 h-3" /> <span>Sil</span>
                </button>
              </div>`
);

fs.writeFileSync('src/app/admin/components/SponsorsAdmin.tsx', content);
