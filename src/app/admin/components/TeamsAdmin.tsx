'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb, toast } from '@/lib/adminDb';
import { Plus, Trash2, Edit2, UploadCloud, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { sortTeams } from '@/lib/teamOrder';
import SquadStatsAdmin from './SquadStatsAdmin';
import { uploadFromInput } from '@/lib/uploadImage';

export default function TeamsAdmin() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Team adding state
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamLeague, setTeamLeague] = useState('');

  // Player managing state
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  
  // Player adding state
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  
  // Team details states
  const [teamPos, setTeamPos] = useState('');
  const [detailsLeague, setDetailsLeague] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [teamImg, setTeamImg] = useState('');
  const [uploadingTeamImg, setUploadingTeamImg] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerImage, setPlayerImage] = useState('');
  const [playerBirth, setPlayerBirth] = useState('');
  const [uploadingPlayerImg, setUploadingPlayerImg] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const { data } = await supabase.from('teams').select('*');
    if (data) setTeams(sortTeams(data));
    setLoading(false);
  };

  // Up / down arrows: the order is saved as teams.sort_order (1, 2, 3 ...) and the public site
  // (teams, academy, standings tabs, statistics filters, admin lists) uses the same order.
  const [savingOrder, setSavingOrder] = useState(false);
  const moveTeam = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (savingOrder || target < 0 || target >= teams.length) return;
    const next = [...teams];
    [next[index], next[target]] = [next[target], next[index]];
    const changed = next.map((t, i) => ({ ...t, sort_order: i + 1 })).filter((t, i) => teams.find(x => x.id === t.id)?.sort_order !== i + 1);
    setTeams(next.map((t, i) => ({ ...t, sort_order: i + 1 })));
    setSavingOrder(true);
    const results = await Promise.all(changed.map(t => adminDb.from('teams').update({ sort_order: t.sort_order }).eq('id', t.id).silent()));
    setSavingOrder(false);
    if (results.some(r => r.error)) return fetchTeams();
    toast('success', 'Komandaların sırası yadda saxlanıldı');
  };

  const fetchPlayers = async (teamId: string) => {
    const { data } = await supabase.from('players').select('*').eq('team_id', teamId).order('jersey_number', { ascending: true });
    if (data) setPlayers(data);
  };

  const handleSelectTeam = async (teamId: string) => {
    setSelectedTeamId(teamId);
    fetchPlayers(teamId);
    setIsAddingPlayer(false); setEditingPlayerId(null);
    
    // Load team extra details from site_images
    setTeamPos(''); setTeamDesc(''); setTeamImg('');
    setDetailsLeague(teams.find(t => t.id === teamId)?.league || '');
    const keys = [`team_${teamId}_pos`, `team_${teamId}_desc`, `team_${teamId}_img`];
    const { data } = await supabase.from('site_images').select('section_key, image_url').in('section_key', keys);
    if (data) {
      data.forEach(item => {
        if (item.section_key.endsWith('_pos')) setTeamPos(item.image_url);
        if (item.section_key.endsWith('_desc')) setTeamDesc(item.image_url);
        if (item.section_key.endsWith('_img')) setTeamImg(item.image_url);
      });
    }
  };
  

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    const sortOrder = teams.reduce((n, t) => Math.max(n, t.sort_order || 0), 0) + 1;
    const { error } = await adminDb.from('teams').insert([{ name: teamName, league: teamLeague || null, sort_order: sortOrder }]);
    if (error) return;
    setTeamName(''); setTeamLeague('');
    setIsAddingTeam(false);
    fetchTeams();
  };

  const handleSaveTeamDetails = async () => {
    if (!selectedTeamId) return;
    setSavingDetails(true);
    const [{ error: teamError }, { error: detailsError }] = await Promise.all([
      adminDb.from('teams').update({ league: detailsLeague || null, description: teamDesc || null }).eq('id', selectedTeamId).silent(),
      adminDb.from('site_images').upsert([
        { section_key: `team_${selectedTeamId}_pos`, image_url: teamPos },
        { section_key: `team_${selectedTeamId}_desc`, image_url: teamDesc },
        { section_key: `team_${selectedTeamId}_img`, image_url: teamImg },
      ], { onConflict: 'section_key' }).silent(),
    ]);
    setSavingDetails(false);
    if (teamError || detailsError) return;
    toast('success', 'Komanda məlumatları yadda saxlanıldı');
    fetchTeams();
  };

  const handleDeleteTeam = async (id: string) => {
    if (confirm('Komandanı və içindəki bütün oyunçuları silmək istədiyinizə əminsiniz?')) {
      await adminDb.from('teams').delete().eq('id', id);
      if (selectedTeamId === id) setSelectedTeamId(null);
      fetchTeams();
    }
  };

  
  const handleEditPlayer = (p: any) => {
    setEditingPlayerId(p.id);
    setPlayerName(p.name);
    setPlayerPosition(p.position || '');
    setPlayerNumber(p.jersey_number ? p.jersey_number.toString() : '');
    setPlayerImage(p.image_url || '');
    setPlayerBirth(p.birth_date || '');
    setIsAddingPlayer(true);
  };

  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !playerName || uploadingPlayerImg) return;
    const payload = {
      team_id: selectedTeamId,
      name: playerName,
      position: playerPosition || null,
      jersey_number: parseInt(playerNumber) || null,
      image_url: playerImage || null,
      birth_date: playerBirth || null,
    };
    // editing used to insert a duplicate player instead of updating
    const { error } = editingPlayerId
      ? await adminDb.from('players').update(payload).eq('id', editingPlayerId)
      : await adminDb.from('players').insert([payload]);
    if (error) return;
    setEditingPlayerId(null); setPlayerBirth('');
    setPlayerName(''); setPlayerPosition(''); setPlayerNumber(''); setPlayerImage('');
    setIsAddingPlayer(false);
    fetchPlayers(selectedTeamId);
  };

  const handleDeletePlayer = async (id: string) => {
    if (confirm('Oyunçunu silmək istədiyinizə əminsiniz?')) {
      await adminDb.from('players').delete().eq('id', id);
      if (selectedTeamId) fetchPlayers(selectedTeamId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Komandalar və Oyunçular</h2>
          <p className="text-gray-400 text-sm">Komandalar yaradın və tərkibini formalaşdırın.</p>
        </div>
        <button onClick={() => setIsAddingTeam(!isAddingTeam)} className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAddingTeam ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Komanda</span></>}
        </button>
      </div>

      {isAddingTeam && (
        <form onSubmit={handleAddTeam} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Adı</label>
            <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Məs: U-12" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Liqa / Turnir</label>
            <input type="text" value={teamLeague} onChange={e => setTeamLeague(e.target.value)} placeholder="Məs: Gənclər Liqası" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
          </div>
          <div className="flex items-end">
             <button type="submit" className="bg-accent text-on-accent py-3 px-6 rounded-lg font-bold text-xs uppercase tracking-widest h-[50px]">Yadda Saxla</button>
          </div>
        </form>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Teams List */}
        <div className="w-full md:w-1/3">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Komandalar</h3>
          <p className="text-gray-500 text-[11px] mb-4">Oxlarla sıranı dəyişin — saytda hər yerdə bu sıra ilə görünür.</p>
          <div className="space-y-3">
            {teams.map((t, i) => (
              <div 
                key={t.id} 
                className={`bg-gray-800 border ${selectedTeamId === t.id ? 'border-accent' : 'border-gray-700'} p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-accent/50 transition-colors`}
                onClick={() => handleSelectTeam(t.id)}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="text-gray-500 text-xs font-bold w-5 text-center">{i + 1}</span>
                  <span className={`font-black uppercase tracking-widest text-sm truncate ${selectedTeamId === t.id ? 'text-accent' : 'text-white'}`}>{t.name}</span>
                </span>
                <span className="flex items-center shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); moveTeam(i, -1); }} disabled={i === 0 || savingOrder} className="text-gray-400 hover:text-white disabled:opacity-20 p-1.5" aria-label="Yuxarı" title="Yuxarı">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveTeam(i, 1); }} disabled={i === teams.length - 1 || savingOrder} className="text-gray-400 hover:text-white disabled:opacity-20 p-1.5" aria-label="Aşağı" title="Aşağı">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteTeam(t.id); }} className="text-gray-400 hover:text-red-400 transition-colors p-1.5 ml-1" aria-label="Sil">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </span>
              </div>
            ))}
            {teams.length === 0 && <div className="text-gray-400 text-center py-4">Heç bir komanda yoxdur.</div>}
          </div>
        </div>

        {/* Players List */}
        <div className="w-full md:w-2/3">
          {selectedTeamId ? (
            <>
              <div className="mb-10 bg-gray-800 border border-accent/30 p-6 rounded-2xl">
                <h3 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Komandanın Ümumi Məlumatları</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Liqa / Turnir</label>
                    <input type="text" value={detailsLeague} onChange={e => setDetailsLeague(e.target.value)} placeholder="Məs: Gənclər Liqası" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Cari Mövqe</label>
                    <input type="text" value={teamPos} onChange={e => setTeamPos(e.target.value)} placeholder="Məs: 3-cü yer" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Şəkli (16:9 formatı)</label>
                    {teamImg ? (
                      <div className="relative w-full h-[50px] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden group">
                        <img src={teamImg} alt="Preview" className="w-full h-full object-cover opacity-50" />
                        <button type="button" onClick={() => setTeamImg('')} className="absolute inset-0 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-red-500/80 transition-colors">Şəkli Sil</button>
                      </div>
                    ) : (
                      <label className={`w-full h-[50px] flex items-center justify-center space-x-2 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:border-accent transition-colors ${uploadingTeamImg ? 'opacity-50' : ''}`}>
                        <UploadCloud className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-[10px] font-bold uppercase">{uploadingTeamImg ? 'Yüklənir...' : 'Cihazdan Şəkil Seç'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          disabled={uploadingTeamImg}
                          onChange={async (e) => {
                            setUploadingTeamImg(true);
                            const url = await uploadFromInput(e);
                            if (url) setTeamImg(url);
                            setUploadingTeamImg(false);
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Əlavə Məlumat</label>
                    <textarea value={teamDesc} onChange={e => setTeamDesc(e.target.value)} placeholder="Komanda haqqında qısa məlumat..." className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white h-20" />
                  </div>
                </div>
                <button onClick={handleSaveTeamDetails} disabled={savingDetails} className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
                  <Save className="w-4 h-4" /> <span>{savingDetails ? 'Saxlanılır...' : 'Məlumatları Yadda Saxla'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm">Oyunçular</h3>
                <button onClick={() => { setIsAddingPlayer(!isAddingPlayer); setEditingPlayerId(null); setPlayerName(""); setPlayerPosition(""); setPlayerNumber(""); setPlayerImage(""); setPlayerBirth(""); }} className="text-accent hover:text-white transition-colors text-xs font-bold uppercase flex items-center">
                  <Plus className="w-3 h-3 mr-1" /> Oyunçu Əlavə Et
                </button>
              </div>

              {isAddingPlayer && (
                <form onSubmit={handleSavePlayer} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ad Soyad</label><input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required /></div>
                  <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Mövqe</label><input type="text" value={playerPosition} onChange={e => setPlayerPosition(e.target.value)} placeholder="Məs: Hücumçu" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                  <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Nömrə</label><input type="number" value={playerNumber} onChange={e => setPlayerNumber(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                  <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Doğum tarixi</label><input type="date" value={playerBirth} onChange={e => setPlayerBirth(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" /></div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Oyunçu Şəkli</label>
                    {playerImage ? (
                      <div className="relative w-12 h-12 bg-gray-900 border border-gray-700 rounded-full overflow-hidden group">
                        <img src={playerImage} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setPlayerImage('')} className="absolute inset-0 bg-red-500/80 text-white text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">SIL</button>
                      </div>
                    ) : (
                      <label className={`flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-accent transition-colors ${uploadingPlayerImg ? 'opacity-50' : ''}`}>
                        <UploadCloud className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-gray-400 text-[10px] font-bold uppercase truncate">{uploadingPlayerImg ? 'Yüklənir...' : 'Cihazdan Şəkil Seç'}</span>
                        <input 
                          type="file" accept="image/*" className="hidden" disabled={uploadingPlayerImg}
                          onChange={async (e) => {
                            setUploadingPlayerImg(true);
                            const url = await uploadFromInput(e);
                            if (url) setPlayerImage(url);
                            setUploadingPlayerImg(false);
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <div className="col-span-2 mt-2"><button type="submit" disabled={uploadingPlayerImg} className="w-full bg-accent text-on-accent py-3 rounded-lg font-bold text-xs uppercase tracking-widest disabled:opacity-60">{uploadingPlayerImg ? 'Şəkil yüklənir...' : 'Yadda Saxla'}</button></div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {players.map(p => (
                  <div key={p.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center relative">
                    <div className="w-12 h-12 rounded-full bg-gray-900 overflow-hidden mr-4 border border-gray-700 shrink-0">
                      <img src={p.image_url || '/Logo.JPG.jpeg'} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-wide leading-tight mb-1">{p.name}</h4>
                      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
                         <span>Nöm: {p.jersey_number || '-'}</span>
                         <span>•</span>
                         <span>{p.position || 'Bilinmir'}</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button onClick={() => handleEditPlayer(p)} className="text-gray-600 hover:text-blue-400">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeletePlayer(p.id)} className="text-gray-600 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {players.length === 0 && !isAddingPlayer && <div className="col-span-full text-center text-gray-400 py-10 bg-gray-800 rounded-2xl border border-gray-700">Bu komandada oyunçu yoxdur.</div>}
              </div>

              <SquadStatsAdmin teamId={selectedTeamId} players={players} onSaved={() => fetchPlayers(selectedTeamId)} />
            </>
          ) : (
             <div className="flex justify-center items-center h-full min-h-[200px] border-2 border-dashed border-gray-700 rounded-2xl text-gray-400 font-bold uppercase text-xs tracking-widest">
                İdarə etmək üçün sol tərəfdən komanda seçin
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
