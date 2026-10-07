const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/CoachesAdmin.tsx', 'utf-8');

// 1. Fix fetchData to include leadership_coach_ids
content = content.replace(
  /const fetchData = async \(\) => \{[\s\S]*?setLoading\(false\);\n  \};/,
  `const fetchData = async () => {
    setLoading(true);
    const { data: cData } = await supabase.from('coaches').select('*, teams(name)').order('created_at', { ascending: false });
    if (cData) setCoaches(cData);
    
    const { data: tData } = await supabase.from('teams').select('id, name');
    if (tData) setTeams(tData);
    
    const { data: lsData } = await supabase.from('site_images').select('image_url').eq('section_key', 'leadership_coach_ids').maybeSingle();
    if (lsData && lsData.image_url) {
      setLeadershipIds(lsData.image_url.split(','));
    } else {
      setLeadershipIds([]);
    }
    
    setLoading(false);
  };`
);

// 2. Fix handleEdit to set isLeadership properly
content = content.replace(
  /setEditingId\(c\.id\);\n    setIsAdding\(true\);\n  \};/m,
  `setEditingId(c.id);
    setIsAdding(true);
    setIsLeadership(leadershipIds.includes(c.id.toString()));
  };`
);

// 3. Fix handleSave
content = content.replace(
  /const handleSave = async \(e: React\.FormEvent\) => \{[\s\S]*?fetchData\(\);\n  \};/m,
  `const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      role,
      license,
      image_url: imageUrl,
      team_id: teamId || null
    };

    let newId = editingId;

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
      const { data: lsExists } = await supabase.from('site_images').select('id').eq('section_key', 'leadership_coach_ids').maybeSingle();
      
      if (lsExists) {
        await supabase.from('site_images').update({ image_url: newIdsString }).eq('section_key', 'leadership_coach_ids');
      } else {
        await supabase.from('site_images').insert([{ section_key: 'leadership_coach_ids', image_url: newIdsString }]);
      }
    }

    setEditingId(null);
    setIsAdding(false);
    resetForm();
    fetchData();
  };`
);

// 4. Update the resetForm to also clear isLeadership
content = content.replace(
  "setImageUrl(''); setTeamId('');",
  "setImageUrl(''); setTeamId(''); setIsLeadership(false);"
);

fs.writeFileSync('src/app/admin/components/CoachesAdmin.tsx', content);
