'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb, toast } from '@/lib/adminDb';
import { sortTeams } from '@/lib/teamOrder';
import { uploadFromInput } from '@/lib/uploadImage';
import { teamLogoKey } from '@/lib/teamLogos';
import { isYarimada } from '@/lib/matchUtils';
import { entryGoals, entryPlayed } from '@/lib/playerStats';
import { Trash2, Plus, UploadCloud, Radio, Clock, Users, Play, Pause, Square, AlertCircle, Minus } from 'lucide-react';
import { calculateLiveMinute, TimerStatus } from '@/lib/matchTimer';

export default function MatchesAdmin() {
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Tabs for the form
  const [activeTab, setActiveTab] = useState<'info' | 'timer' | 'lineup'>('info');

  // Basic Info
  const [tournament, setTournament] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeLogo, setHomeLogo] = useState('');
  const [awayLogo, setAwayLogo] = useState('');
  const [homeScore, setHomeScore] = useState<number | ''>('');
  const [awayScore, setAwayScore] = useState<number | ''>('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [venue, setVenue] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming');
  const [isHero, setIsHero] = useState(false);

  // Timer
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('stopped');
  const [timerStartedAt, setTimerStartedAt] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [h1, setH1] = useState(45);
  const [ht, setHt] = useState(15);
  const [h2, setH2] = useState(45);
  const [ex1, setEx1] = useState(0);
  const [ex2, setEx2] = useState(0);

  // Lineup
  const [yarimadaLineup, setYarimadaLineup] = useState<any[]>([]);
  const [awayLineup, setAwayLineup] = useState<any[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newAwayPlayerName, setNewAwayPlayerName] = useState('');
  const [newAwayPlayerNumber, setNewAwayPlayerNumber] = useState('');
  const [selectedTeamIdForLineup, setSelectedTeamIdForLineup] = useState<string>('');

  const [uploadingHomeLogo, setUploadingHomeLogo] = useState(false);
  const [uploadingAwayLogo, setUploadingAwayLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  // Real-time minute display for the admin panel
  const [currentDisplayMinute, setCurrentDisplayMinute] = useState<string>('');

  
  useEffect(() => {
    if (isAdding && tournament && yarimadaLineup.length === 0) {
      const matchedTeam = teams.find(t => t.name.toLowerCase() === tournament.toLowerCase());
      if (matchedTeam) {
        setSelectedTeamIdForLineup(matchedTeam.id);
        // Auto fetch players
        supabase.from('players').select('*').eq('team_id', matchedTeam.id).then(({ data }) => {
          if (data && yarimadaLineup.length === 0) {
            setYarimadaLineup(data.map(p => ({
              id: p.id,
              name: p.name,
              number: p.jersey_number ?? '',
              position: p.position,
              is_starting: true, // Defaulting to starting
              played: true,
              goals: 0,
              assists: 0,
              events: []
            })));
          }
        });
      }
    }
  }, [tournament, isAdding, teams]);

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDisplayMinute(calculateLiveMinute(timerStatus, timerStartedAt, elapsedSec, h1, h2, ex1, ex2));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStatus, timerStartedAt, elapsedSec, h1, h2, ex1, ex2]);

  const fetchMatches = async () => {
    setLoading(true);
    const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
    if (data) setMatches(data);
    setLoading(false);
  };

  const fetchTeams = async () => {
    // '*' + client sort: the admin's team order (works before the sort_order column exists, too)
    const { data } = await supabase.from('teams').select('*');
    if (data) setTeams(sortTeams(data));
  };

  const syncLineup = async () => {
    if (!selectedTeamIdForLineup) return toast('error', 'Zəhmət olmasa komandanı seçin');
    if (confirm('Mövcud heyət silinəcək və komandanın oyunçuları bura kopyalanacaq. Davam edilsin?')) {
      const { data } = await supabase.from('players').select('*').eq('team_id', selectedTeamIdForLineup);
      if (data) {
        const mapped = data.map(p => ({
          id: p.id,
          name: p.name,
          number: p.jersey_number ?? '',
          position: p.position,
          is_starting: false,
          played: false,
          goals: 0,
          assists: 0,
          events: [] // e.g. ['yellow_card', 'red_card', 'injury']
        }));
        setYarimadaLineup(mapped);
      }
    }
  };

  const toggleEvent = (playerId: string, event: string) => {
    setYarimadaLineup(prev => prev.map(p => {
      if (p.id !== playerId) return p;
      const events = p.events || [];
      const hasEvent = events.includes(event);
      return { ...p, events: hasEvent ? events.filter((e: string) => e !== event) : [...events, event] };
    }));
  };

  // goals / assists / minutes per player — the source of the public player statistics
  const updatePlayer = (index: number, patch: Record<string, any>) => {
    setYarimadaLineup(prev => prev.map((p, i) => {
      if (i !== index) return p;
      const next = { ...p, ...patch };
      if ('goals' in patch) next.events = (next.events || []).filter((e: string) => e !== 'goal');
      // scoring or assisting means the player played
      if ((next.goals > 0 || next.assists > 0 || next.minutes > 0) && patch.played === undefined) next.played = true;
      return next;
    }));
  };
  const step = (index: number, field: 'goals' | 'assists', delta: number) => {
    const p = yarimadaLineup[index];
    const current = field === 'goals' ? entryGoals(p) : Number(p.assists) || 0;
    updatePlayer(index, { [field]: Math.max(0, current + delta) });
  };
  const lineupGoals = yarimadaLineup.reduce((sum, p) => sum + (entryPlayed(p) ? entryGoals(p) : 0), 0);
  const ourScore = isYarimada(homeTeam) ? homeScore : isYarimada(awayTeam) ? awayScore : '';

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHome: boolean) => {
    const setUploading = isHome ? setUploadingHomeLogo : setUploadingAwayLogo;
    setUploading(true);
    const url = await uploadFromInput(e);
    if (url) (isHome ? setHomeLogo : setAwayLogo)(url);
    setUploading(false);
  };

  const handleEdit = (m: any) => {
    setTournament(m.tournament || '');
    setHomeTeam(m.home_team);
    setAwayTeam(m.away_team);
    setMatchDate(m.match_date || '');
    setMatchTime(m.match_time || '');
    setVenue(m.stadium || '');
    setHomeLogo(m.home_logo || '');
    setAwayLogo(m.away_logo || '');
    setHomeScore(m.home_score ?? '');
    setAwayScore(m.away_score ?? '');
    setStatus(m.status || 'upcoming');
    setIsHero(m.is_hero || false);
    
    setTimerStatus(m.timer_status || 'stopped');
    setTimerStartedAt(m.timer_started_at || null);
    setElapsedSec(m.elapsed_seconds || 0);
    setH1(m.half_1_duration || 45);
    setHt(m.halftime_duration || 15);
    setH2(m.half_2_duration || 45);
    setEx1(m.extra_time_1 || 0);
    setEx2(m.extra_time_2 || 0);
    setYarimadaLineup(m.yarimada_lineup || []);
    setAwayLineup(m.away_lineup || []);

    setEditingId(m.id);
    setIsAdding(true);
    setActiveTab('info');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam) return toast('error', 'Komandaların adını qeyd edin.');

    const payload = {
      tournament: tournament || null,
      home_team: homeTeam,
      away_team: awayTeam,
      match_date: matchDate || null,
      match_time: matchTime || null,
      stadium: venue || null,
      home_logo: homeLogo,
      away_logo: awayLogo,
      home_score: homeScore === '' ? null : homeScore,
      away_score: awayScore === '' ? null : awayScore,
      status: status,
      is_hero: isHero,
      timer_status: timerStatus,
      timer_started_at: timerStartedAt,
      elapsed_seconds: elapsedSec,
      half_1_duration: h1,
      halftime_duration: ht,
      half_2_duration: h2,
      extra_time_1: ex1,
      extra_time_2: ex2,
      yarimada_lineup: yarimadaLineup,
      away_lineup: awayLineup
    };

    if (saving || uploadingHomeLogo || uploadingAwayLogo) return;
    setSaving(true);
    const { error } = editingId
      ? await adminDb.from('matches').update(payload).eq('id', editingId)
      : await adminDb.from('matches').insert([payload]);
    if (!error) {
      // remember each opponent's logo so it also shows in the standings and other fixtures
      const logos = [[homeTeam, homeLogo], [awayTeam, awayLogo]]
        .filter(([name, url]) => name && url && !isYarimada(name))
        .map(([name, url]) => ({ section_key: teamLogoKey(name), image_url: url }));
      if (logos.length) await adminDb.from('site_images').upsert(logos, { onConflict: 'section_key' }).silent();
    }
    setSaving(false);
    if (error) return;

    setIsAdding(false);
    resetForm();
    fetchMatches();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu oyunu silmək istədiyinizə əminsiniz?')) {
      await adminDb.from('matches').delete().eq('id', id);
      fetchMatches();
    }
  };

  const resetForm = () => {
    setTournament(''); setHomeTeam(''); setAwayTeam(''); setHomeLogo(''); setAwayLogo('');
    setMatchDate(''); setMatchTime(''); setVenue(''); setHomeScore(''); setAwayScore('');
    setStatus('upcoming'); setIsHero(false); 
    setTimerStatus('stopped'); setTimerStartedAt(null); setElapsedSec(0); setH1(45); setHt(15); setH2(45); setEx1(0); setEx2(0);
    setYarimadaLineup([]); setAwayLineup([]); setSelectedTeamIdForLineup('');
    setEditingId(null);
  };

  // Timer Actions — every action is saved to the database immediately so the site updates
  // without having to press "save" (previously the timer only changed local state).
  const persistTimer = async (patch: { timer_status: TimerStatus; timer_started_at: string | null; elapsed_seconds: number; status?: string }) => {
    setTimerStatus(patch.timer_status);
    setTimerStartedAt(patch.timer_started_at);
    setElapsedSec(patch.elapsed_seconds);
    if (patch.status) setStatus(patch.status as 'upcoming' | 'live' | 'finished');
    if (!editingId) return; // new match: values are saved together with the form
    const { error } = await adminDb.from('matches').update(patch).eq('id', editingId);
    if (!error) fetchMatches();
  };

  const startFirstHalf = () =>
    persistTimer({ timer_status: 'running_first', timer_started_at: new Date().toISOString(), elapsed_seconds: 0, status: 'live' });

  const startHalftime = () =>
    persistTimer({ timer_status: 'halftime', timer_started_at: null, elapsed_seconds: h1 * 60, status: 'live' });

  const startSecondHalf = () =>
    persistTimer({ timer_status: 'running_second', timer_started_at: new Date().toISOString(), elapsed_seconds: h1 * 60, status: 'live' });

  const finishMatch = () =>
    persistTimer({ timer_status: 'finished', timer_started_at: null, elapsed_seconds: elapsedSec, status: 'finished' });

  const pauseTimer = () => {
    const extra = timerStartedAt ? Math.floor((Date.now() - new Date(timerStartedAt).getTime()) / 1000) : 0;
    persistTimer({ timer_status: 'stopped', timer_started_at: null, elapsed_seconds: elapsedSec + extra, status: 'live' });
  };

  const resumeTimer = (currentHalf: 'running_first' | 'running_second') =>
    persistTimer({ timer_status: currentHalf, timer_started_at: new Date().toISOString(), elapsed_seconds: elapsedSec, status: 'live' });

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Oyunlar və Nəticələr</h2>
          <p className="text-gray-400 text-sm">Bütün oyunları, canlı nəticələri və ana səhifədə görünəcək əsas oyunu idarə edin.</p>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); resetForm(); }} className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2">
          {isAdding ? <span>Ləğv Et</span> : <><Plus className="w-4 h-4" /><span>Yeni Oyun</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8">
          
          <div className="flex space-x-2 mb-6 border-b border-gray-700 pb-4 overflow-x-auto">
            <button type="button" onClick={() => setActiveTab('info')} className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-widest whitespace-nowrap ${activeTab === 'info' ? 'bg-accent text-on-accent' : 'text-gray-400 hover:text-white'}`}>Əsas Məlumatlar</button>
            <button type="button" onClick={() => setActiveTab('timer')} className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-widest flex items-center space-x-2 whitespace-nowrap ${activeTab === 'timer' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-red-400'}`}><Clock className="w-4 h-4"/> <span>Canlı Taymer</span></button>
            <button type="button" onClick={() => setActiveTab('lineup')} className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-widest flex items-center space-x-2 whitespace-nowrap ${activeTab === 'lineup' ? 'bg-accent text-on-accent' : 'text-gray-400 hover:text-white'}`}><Users className="w-4 h-4"/> <span>Heyət & Hadisələr</span></button>
          </div>

          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="bg-black p-4 rounded-xl border border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-accent transition-colors">
                  <input type="checkbox" checked={isHero} onChange={(e) => setIsHero(e.target.checked)} className="w-5 h-5 accent-[#d7bf7b] rounded" />
                  <span className="text-white font-bold text-xs uppercase tracking-widest">Ana səhifənin ən üstündə göstər</span>
                </label>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Oyunun Vəziyyəti</label>
                  <select value={status} onChange={(e: any) => setStatus(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-accent">
                    <option value="upcoming">Gələcək Oyun (Upcoming)</option>
                    <option value="live">Canlı (Live)</option>
                    <option value="finished">Bitdi (Finished)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi (Home)</label>
                  <input type="text" value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Komanda (Away)</label>
                  <input type="text" value={awayTeam} onChange={e => setAwayTeam(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
                </div>

                <div className="bg-black p-3 rounded-lg border border-gray-700">
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi Loqosu</label>
                  <div className="flex items-center space-x-3">
                    {homeLogo && <img src={homeLogo} alt="Home" className="w-10 h-10 object-contain bg-white rounded-full p-1" />}
                    <label className="cursor-pointer bg-gray-800 border border-gray-700 hover:border-accent px-4 py-2 rounded text-xs font-bold text-white uppercase transition-colors">
                      {uploadingHomeLogo ? 'Yüklənir...' : 'Cihazdan Seç'}
                      <input type="file" accept="image/*" onChange={e => handleLogoUpload(e, true)} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="bg-black p-3 rounded-lg border border-gray-700">
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Loqosu</label>
                  <div className="flex items-center space-x-3">
                    {awayLogo && <img src={awayLogo} alt="Away" className="w-10 h-10 object-contain bg-white rounded-full p-1" />}
                    <label className="cursor-pointer bg-gray-800 border border-gray-700 hover:border-accent px-4 py-2 rounded text-xs font-bold text-white uppercase transition-colors">
                      {uploadingAwayLogo ? 'Yüklənir...' : 'Cihazdan Seç'}
                      <input type="file" accept="image/*" onChange={e => handleLogoUpload(e, false)} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Ev Sahibi Hesab</label>
                  <input type="number" value={homeScore} onChange={e => setHomeScore(e.target.value ? Number(e.target.value) : '')} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Qonaq Hesab</label>
                  <input type="number" value={awayScore} onChange={e => setAwayScore(e.target.value ? Number(e.target.value) : '')} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Tarix</label>
                  <input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Saat</label>
                  <input type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Komanda Kateqoriyası (Liqa)</label>
                  <select value={tournament} onChange={e => setTournament(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white">
                    <option value="">Seçin...</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Stadion</label>
                  <input type="text" value={venue} onChange={e => setVenue(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timer' && (
            <div className="space-y-6">
              <div className="bg-black p-6 rounded-2xl border border-gray-700 text-center">
                <div className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Canlı Dəqiqə</div>
                <div className="text-6xl font-black text-white mb-6 tabular-nums">{currentDisplayMinute}</div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  {timerStatus === 'stopped' && elapsedSec === 0 && !timerStartedAt && (
                     <button type="button" onClick={startFirstHalf} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2"><Play className="w-4 h-4"/><span>1-ci Hissəyə Başla</span></button>
                  )}
                  {timerStatus === 'running_first' && (
                     <button type="button" onClick={startHalftime} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2"><Pause className="w-4 h-4"/><span>Fasilə (HT)</span></button>
                  )}
                  {timerStatus === 'halftime' && (
                     <button type="button" onClick={startSecondHalf} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2"><Play className="w-4 h-4"/><span>2-ci Hissəyə Başla</span></button>
                  )}
                  {(timerStatus === 'running_first' || timerStatus === 'running_second') && (
                     <button type="button" onClick={pauseTimer} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2"><Pause className="w-4 h-4"/><span>Dayandır (Pauza)</span></button>
                  )}
                  {timerStatus === 'stopped' && timerStartedAt === null && elapsedSec > 0 && elapsedSec < h1 * 60 && (
                     <button type="button" onClick={() => resumeTimer('running_first')} className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2"><Play className="w-4 h-4"/><span>Davam Et (1-ci H)</span></button>
                  )}
                  {timerStatus === 'stopped' && timerStartedAt === null && elapsedSec >= h1 * 60 && (
                     <button type="button" onClick={() => resumeTimer('running_second')} className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2"><Play className="w-4 h-4"/><span>Davam Et (2-ci H)</span></button>
                  )}
                  {timerStatus !== 'finished' && (timerStatus !== 'stopped' || elapsedSec > 0) && (
                     <button type="button" onClick={finishMatch} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center space-x-2"><Square className="w-4 h-4"/><span>Oyunu Bitir</span></button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-900 p-4 rounded-xl border border-gray-700">
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">1-ci hissə (Dəq)</label>
                  <input type="number" value={h1} onChange={e => setH1(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">Fasilə (Dəq)</label>
                  <input type="number" value={ht} onChange={e => setHt(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">2-ci hissə (Dəq)</label>
                  <input type="number" value={h2} onChange={e => setH2(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">1-ci hissəyə əlavə</label>
                  <input type="number" value={ex1} onChange={e => setEx1(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-bold uppercase mb-2">2-ci hissəyə əlavə</label>
                  <input type="number" value={ex2} onChange={e => setEx2(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lineup' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4 bg-black p-4 rounded-xl border border-gray-700">
                <div className="flex-1 w-full">
                  <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Bazada olan komandadan oyunçuları çək</label>
                  <select value={selectedTeamIdForLineup} onChange={e => setSelectedTeamIdForLineup(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none">
                    <option value="">Komanda seçin...</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={syncLineup} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest w-full md:w-auto transition-colors">
                  Sinxronlaşdır
                </button>
              </div>

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 bg-black p-4 rounded-xl border border-gray-700 mb-6">
                <input type="text" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} placeholder="Oyunçu adı (Ev sahibi)..." className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none" />
                <input type="number" value={newPlayerNumber} onChange={e => setNewPlayerNumber(e.target.value)} placeholder="Nömrə..." className="w-full md:w-24 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none" />
                <button type="button" onClick={() => {
                  if(newPlayerName && newPlayerNumber) {
                    setYarimadaLineup([...yarimadaLineup, { id: 'manual_'+Date.now(), name: newPlayerName, number: newPlayerNumber, position: 'Oyunçu', is_starting: true, played: true, goals: 0, assists: 0, events: [] }]);
                    setNewPlayerName(''); setNewPlayerNumber('');
                  }
                }} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors whitespace-nowrap">
                  Əlavə et
                </button>
              </div>

              {yarimadaLineup.length > 0 && (
                <div className="bg-black rounded-xl border border-gray-700 overflow-hidden mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700 text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Oyunçu statistikası (saytdakı “Statistika” bölməsi buradan hesablanır)</span>
                    <span className={`font-bold ${ourScore !== '' && Number(ourScore) !== lineupGoals ? 'text-yellow-400' : 'text-green-400'}`}>
                      Qollar cəmi: {lineupGoals}{ourScore !== '' ? ` / Hesab: ${ourScore}` : ''}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm text-gray-400">
                    <thead className="text-[10px] text-gray-400 uppercase bg-gray-900">
                      <tr>
                        <th className="px-3 py-3">№</th>
                        <th className="px-3 py-3">Oyunçu</th>
                        <th className="px-3 py-3 text-center">Oynadı</th>
                        <th className="px-3 py-3 text-center">İlk 11</th>
                        <th className="px-3 py-3 text-center">Qol</th>
                        <th className="px-3 py-3 text-center">Assist</th>
                        <th className="px-3 py-3 text-center">Dəqiqə</th>
                        <th className="px-3 py-3 text-right">Hadisələr</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yarimadaLineup.map((p, index) => {
                        const played = entryPlayed(p);
                        const events: string[] = p.events || [];
                        const counter = (field: 'goals' | 'assists', value: number) => (
                          <div className="inline-flex items-center gap-1">
                            <button type="button" onClick={() => step(index, field, -1)} disabled={value === 0} className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-30 flex items-center justify-center" aria-label="Azalt"><Minus className="w-3 h-3" /></button>
                            <span className={`w-6 text-center font-black tabular-nums ${value > 0 ? 'text-white' : 'text-gray-600'}`}>{value}</span>
                            <button type="button" onClick={() => step(index, field, 1)} className="w-7 h-7 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center" aria-label="Artır"><Plus className="w-3 h-3" /></button>
                          </div>
                        );
                        return (
                          <tr key={p.id || index} className={`border-b border-gray-700/50 hover:bg-gray-800/50 ${played ? '' : 'opacity-50'}`}>
                            <td className="px-3 py-2 text-white font-bold">{p.number}</td>
                            <td className="px-3 py-2 font-medium text-white whitespace-nowrap">{p.name} <span className="text-gray-400 text-[10px] ml-1 uppercase">({p.position || 'Oyunçu'})</span></td>
                            <td className="px-3 py-2 text-center">
                              <input type="checkbox" checked={played} onChange={e => updatePlayer(index, { played: e.target.checked })} className="w-4 h-4 accent-green-500" />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <input type="checkbox" checked={!!p.is_starting} onChange={e => updatePlayer(index, { is_starting: e.target.checked, ...(e.target.checked ? { played: true } : {}) })} className="w-4 h-4 accent-[#d7bf7b]" />
                            </td>
                            <td className="px-3 py-2 text-center">{counter('goals', entryGoals(p))}</td>
                            <td className="px-3 py-2 text-center">{counter('assists', Number(p.assists) || 0)}</td>
                            <td className="px-3 py-2 text-center">
                              <input type="number" min={0} max={130} value={p.minutes ?? ''} onChange={e => updatePlayer(index, { minutes: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })} placeholder="—" className="w-16 bg-gray-900 border border-gray-700 rounded p-1.5 text-white text-center" />
                            </td>
                            <td className="px-3 py-2 text-right space-x-1 whitespace-nowrap">
                              <button type="button" onClick={() => toggleEvent(p.id, 'yellow_card')} className={`p-1.5 rounded-full ${events.includes('yellow_card') ? 'bg-yellow-500/20 border border-yellow-500' : 'bg-gray-800 hover:bg-gray-700'} transition-colors`} title="Sarı Vərəqə">🟨</button>
                              <button type="button" onClick={() => toggleEvent(p.id, 'red_card')} className={`p-1.5 rounded-full ${events.includes('red_card') ? 'bg-red-500/20 border border-red-500' : 'bg-gray-800 hover:bg-gray-700'} transition-colors`} title="Qırmızı Vərəqə">🟥</button>
                              <button type="button" onClick={() => toggleEvent(p.id, 'injury')} className={`p-1.5 rounded-full ${events.includes('injury') ? 'bg-blue-500/20 border border-blue-500' : 'bg-gray-800 hover:bg-gray-700'} transition-colors`} title="Zədə">🩹</button>
                              <button type="button" onClick={() => setYarimadaLineup(prev => prev.filter((_, i) => i !== index))} className="p-1.5 rounded-full bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white transition-colors" title="Heyətdən çıxar"><Trash2 className="w-3.5 h-3.5" /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-700">
            <button type="submit" disabled={saving || uploadingHomeLogo || uploadingAwayLogo} className="w-full bg-accent text-on-accent py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-text-main hover:text-bg-main transition-colors shadow-lg disabled:opacity-60">
              {saving ? 'Saxlanılır...' : uploadingHomeLogo || uploadingAwayLogo ? 'Loqo yüklənir...' : 'Dəyişiklikləri Yadda Saxla'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-accent text-center font-bold tracking-widest uppercase animate-pulse mt-10">Yüklənir...</div>
      ) : (
        <div className="space-y-4">
          {matches.map(m => (
            <div key={m.id} className={`bg-gray-800 border ${m.is_hero ? 'border-accent' : 'border-gray-700'} p-4 md:p-6 rounded-xl flex flex-col md:flex-row items-center justify-between`}>
              
              <div className="flex flex-col flex-1 w-full text-center md:text-left mb-4 md:mb-0">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  {m.is_hero && <span className="bg-accent text-on-accent text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Ana Səhifə</span>}
                  
                  {m.status === 'live' && <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded animate-pulse">Canlı: {calculateLiveMinute(m.timer_status, m.timer_started_at, m.elapsed_seconds, m.half_1_duration, m.half_2_duration, m.extra_time_1, m.extra_time_2)}</span>}
                  {m.status === 'finished' && <span className="bg-gray-700 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Bitdi</span>}
                  
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{m.tournament}</span>
                </div>
                
                <div className="text-white font-black text-lg flex items-center justify-center md:justify-start">
                  {m.home_team} {m.home_score !== null ? <span className="text-accent mx-2">({m.home_score})</span> : ''} 
                  <span className="mx-2 text-gray-600">-</span> 
                  {m.away_score !== null ? <span className="text-accent mx-2">({m.away_score})</span> : ''} {m.away_team}
                </div>
                
                <div className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest">
                  {m.match_date || 'Tarix Yoxdur'} • {m.match_time || 'Saat Yoxdur'} • {m.stadium || 'Stadion Yoxdur'}
                </div>
              </div>

              <div className="flex space-x-3 w-full md:w-auto justify-center">
                <button onClick={() => handleEdit(m)} className="bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-colors">İdarə Et</button>
                <button onClick={() => handleDelete(m.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-colors flex items-center space-x-1"><Trash2 className="w-3 h-3"/> <span>Sil</span></button>
              </div>

            </div>
          ))}
          {matches.length === 0 && <div className="text-center text-gray-400 py-10 uppercase tracking-widest text-xs font-bold">Heç bir oyun yoxdur.</div>}
        </div>
      )}
    </div>
  );
}
