const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/CoachesAdmin.tsx', 'utf-8');

// Add leadership state
content = content.replace(
  "const [uploadingImage, setUploadingImage] = useState(false);",
  "const [uploadingImage, setUploadingImage] = useState(false);\n  const [isLeadership, setIsLeadership] = useState(false);\n  const [leadershipIds, setLeadershipIds] = useState<string[]>([]);"
);

// Fetch leadershipIds in fetchCoaches
content = content.replace(
  "const fetchCoaches = async () => {\n    setLoading(true);\n    const { data } = await supabase.from('coaches').select('*, teams(name)').order('created_at', { ascending: false });\n    if (data) setCoaches(data);\n    setLoading(false);\n  };",
  `const fetchCoaches = async () => {
    setLoading(true);
    const { data } = await supabase.from('coaches').select('*, teams(name)').order('created_at', { ascending: false });
    if (data) setCoaches(data);
    
    const { data: lsData } = await supabase.from('site_images').select('image_url').eq('section_key', 'leadership_coach_ids').single();
    if (lsData && lsData.image_url) {
      setLeadershipIds(lsData.image_url.split(','));
    }
    setLoading(false);
  };`
);

// handleEdit update
content = content.replace(
  "setEditingId(c.id);\n    setIsAdding(true);",
  "setEditingId(c.id);\n    setIsAdding(true);\n    setIsLeadership(leadershipIds.includes(c.id.toString()));"
);

// handleSave update - Wait, I don't know the ID when inserting!
// If inserting, I must insert first, then get the new ID, then update site_images if isLeadership!
content = content.replace(
  /if \(editingId\) \{[\s\S]*?fetchCoaches\(\);\n  \};/m,
  `let newId = editingId;
    if (editingId) {
      await supabase.from('coaches').update(payload).eq('id', editingId);
      alert('Yeniləndi!');
    } else {
      const { data: insertedData } = await supabase.from('coaches').insert([payload]).select();
      if (insertedData && insertedData.length > 0) newId = insertedData[0].id;
      alert('Əlavə edildi!');
    }

    if (newId) {
      let updatedIds = [...leadershipIds];
      if (isLeadership && !updatedIds.includes(newId.toString())) {
        updatedIds.push(newId.toString());
      } else if (!isLeadership && updatedIds.includes(newId.toString())) {
        updatedIds = updatedIds.filter(id => id !== newId.toString());
      }
      
      const newIdsString = updatedIds.join(',');
      const { data: lsExists } = await supabase.from('site_images').select('id').eq('section_key', 'leadership_coach_ids').single();
      if (lsExists) {
        await supabase.from('site_images').update({ image_url: newIdsString }).eq('section_key', 'leadership_coach_ids');
      } else {
        await supabase.from('site_images').insert([{ section_key: 'leadership_coach_ids', image_url: newIdsString }]);
      }
    }

    setEditingId(null);
    setIsAdding(false);
    resetForm();
    fetchCoaches();
  };`
);

// resetForm update
content = content.replace(
  "setImageUrl(''); setTeamId('');",
  "setImageUrl(''); setTeamId(''); setIsLeadership(false);"
);

// Add checkbox UI
content = content.replace(
  /<div className="md:col-span-2 mt-4"><button type="submit"/,
  `<div className="md:col-span-2 mb-4">
            <label className="flex items-center space-x-3 cursor-pointer bg-[#0d1a2d] p-4 rounded-lg border border-gray-700 hover:border-[#d7bf7b] transition-colors">
              <input type="checkbox" checked={isLeadership} onChange={e => setIsLeadership(e.target.checked)} className="w-5 h-5 accent-[#d7bf7b]" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">Haqqımızda səhifəsində (Rəhbərlik kimi) göstərilsin</span>
            </label>
          </div>
          <div className="md:col-span-2"><button type="submit"`
);

// Add visual indicator to the list
content = content.replace(
  /<div className="text-white font-black text-lg">\{c.name\}<\/div>/,
  `<div className="text-white font-black text-lg flex items-center space-x-2">
                <span>{c.name}</span>
                {leadershipIds.includes(c.id.toString()) && <span className="bg-[#d7bf7b] text-[#152741] text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest">RƏHBƏRLİK</span>}
              </div>`
);

fs.writeFileSync('src/app/admin/components/CoachesAdmin.tsx', content);
