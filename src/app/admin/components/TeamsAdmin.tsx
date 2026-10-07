'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

export default function TeamsAdmin() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Team adding state
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [teamName, setTeamName] = useState('');

  // Player managing state
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  
  // Player adding state
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerImage, setPlayerImage] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const { data } = await supabase.from('teams').select('*').order('created_at', { ascending: false });
    if (data) setTeams(data);
    setLoading(false);
  };

  const fetchPlayers = async (teamId: string) => {
    const { data } = await supabase.from('players').select('*').eq('team_id', teamId).order('jersey_number', { ascending: true });
    if (data) setPlayers(data);
  };

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    fetchPlayers(teamId);
    setIsAddingPlayer(false);
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    await supabase.from('teams').insert([{ name: teamName }]);
    setTeamName('');
    setIsAddingTeam(false);
    fetchTeams();
  };

  const handleDeleteTeam = async (id: string) => {
    if (confirm('Komandanı və içindəki bütün oyunçuları silmək istədiyinizə əminsiniz?')) {
      await supabase.from('teams').delete().eq('id', id);
      if (selectedTeamId === id) setSelectedTeamId(null);
      fetchTeams();
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !playerName) return;
    await supabase.from('players').insert([{ 
      team_id: selectedTeamId,
      name: playerName,
      position: playerPosition,
      jersey_number: parseInt(playerNumber) || null,
      image_url: playerImage
    }]);
    setPlayerName(''); setPlayerPosition(''); setPlayerNumber(''); setPlayerImage('');
    setIsAddingPlayer(false);
    fetchPlayers(selectedTeamId);
  };

  const handleDeletePlayer = async (id: string) => {
    if (confirm('Oyunçunu silmək istədiyinizə əminsiniz?')) {
      await supabase.from('players').delete().eq('id', id);
      if (selectedTeamId) fetchPlayers(selectedTeamId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Komandalar və Oyunçular</h2>
          <p className="text-gray-400 text-sm">Komandalar yaradın və tərkibini formalaşdırın.</p>
        </div>
        <button onClick={() => setIsAddingTeam(!isAddingTeam)} className="bg-[#d7bf7b] text-[#152741] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAddingTeam ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Komanda</span></>}
        </button>
      </div>

      {isAddingTeam && (
        <form onSubmit={handleAddTeam} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-8 flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Adı</label>
            <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Məs: U-12" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required />
          </div>
          <div className="flex items-end">
             <button type="submit" className="bg-[#d7bf7b] text-[#152741] py-3 px-6 rounded-lg font-bold text-xs uppercase tracking-widest h-[50px]">Yadda Saxla</button>
          </div>
        </form>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Teams List */}
        <div className="w-full md:w-1/3">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Komandalar</h3>
          <div className="space-y-3">
            {teams.map(t => (
              <div 
                key={t.id} 
                className={`bg-[#152741] border ${selectedTeamId === t.id ? 'border-[#d7bf7b]' : 'border-gray-800'} p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-[#d7bf7b]/50 transition-colors`}
                onClick={() => handleSelectTeam(t.id)}
              >
                <span className={`font-black uppercase tracking-widest text-sm ${selectedTeamId === t.id ? 'text-[#d7bf7b]' : 'text-white'}`}>{t.name}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteTeam(t.id); }} className="text-gray-500 hover:text-red-400 transition-colors p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {teams.length === 0 && <div className="text-gray-500 text-center py-4">Heç bir komanda yoxdur.</div>}
          </div>
        </div>

        {/* Players List */}
        <div className="w-full md:w-2/3">
          {selectedTeamId ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm">Oyunçular</h3>
                <button onClick={() => setIsAddingPlayer(!isAddingPlayer)} className="text-[#d7bf7b] hover:text-white transition-colors text-xs font-bold uppercase flex items-center">
                  <Plus className="w-3 h-3 mr-1" /> Oyunçu Əlavə Et
                </button>
              </div>

              {isAddingPlayer && (
                <form onSubmit={handleAddPlayer} className="bg-[#152741] p-6 rounded-2xl border border-gray-800 mb-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ad Soyad</label><input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" required /></div>
                  <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Mövqe</label><input type="text" value={playerPosition} onChange={e => setPlayerPosition(e.target.value)} placeholder="Məs: Hücumçu" className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
                  <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Nömrə</label><input type="number" value={playerNumber} onChange={e => setPlayerNumber(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
                  <div className="col-span-2 md:col-span-1"><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Şəkil URL</label><input type="text" value={playerImage} onChange={e => setPlayerImage(e.target.value)} className="w-full bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white" /></div>
                  <div className="col-span-2 mt-2"><button type="submit" className="w-full bg-[#d7bf7b] text-[#152741] py-3 rounded-lg font-bold text-xs uppercase tracking-widest">Yadda Saxla</button></div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {players.map(p => (
                  <div key={p.id} className="bg-[#152741] border border-gray-800 rounded-xl p-4 flex items-center relative">
                    <div className="w-12 h-12 rounded-full bg-[#0d1a2d] overflow-hidden mr-4 border border-gray-700 shrink-0">
                      <img src={p.image_url || '/placeholder-player.jpg'} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-wide leading-tight mb-1">{p.name}</h4>
                      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
                         <span>Nöm: {p.jersey_number || '-'}</span>
                         <span>•</span>
                         <span>{p.position || 'Bilinmir'}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeletePlayer(p.id)} className="absolute top-2 right-2 text-gray-600 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {players.length === 0 && !isAddingPlayer && <div className="col-span-full text-center text-gray-500 py-10 bg-[#152741] rounded-2xl border border-gray-800">Bu komandada oyunçu yoxdur.</div>}
              </div>
            </>
          ) : (
             <div className="flex justify-center items-center h-full min-h-[200px] border-2 border-dashed border-gray-800 rounded-2xl text-gray-500 font-bold uppercase text-xs tracking-widest">
                İdarə etmək üçün sol tərəfdən komanda seçin
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
