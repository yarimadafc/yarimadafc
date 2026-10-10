'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminDb, toast } from '@/lib/adminDb';
import { uploadFromInput } from '@/lib/uploadImage';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function TransfersAdmin() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [playerName, setPlayerName] = useState('');
  const [fromTeam, setFromTeam] = useState('');
  const [toTeam, setToTeam] = useState('');
  const [transferType, setTransferType] = useState('Gələn Transfer');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    setLoading(true);
    const { data } = await supabase.from('transfers').select('*').order('date', { ascending: false });
    if (data) setTransfers(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const url = await uploadFromInput(e);
    if (url) setImageUrl(url);
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName) return toast('error', 'Oyunçu adı mütləqdir!');
    const payload = { player_name: playerName, from_team: fromTeam, to_team: toTeam, transfer_type: transferType, date, image_url: imageUrl };
    if (editingId) {
      await adminDb.from('transfers').update(payload).eq('id', editingId);
    } else {
      await adminDb.from('transfers').insert([payload]);
    }
    setIsAdding(false);
    resetForm();
    fetchTransfers();
  };

  const handleEdit = (t: any) => {
    setPlayerName(t.player_name || '');
    setFromTeam(t.from_team || '');
    setToTeam(t.to_team || '');
    setTransferType(t.transfer_type || 'Gələn Transfer');
    setDate(t.date || '');
    setImageUrl(t.image_url || '');
    setEditingId(t.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      await adminDb.from('transfers').delete().eq('id', id);
      fetchTransfers();
    }
  };

  const resetForm = () => {
    setPlayerName(''); setFromTeam(''); setToTeam(''); setTransferType('Gələn Transfer'); setDate(''); setImageUrl(''); setEditingId(null);
  };

  if (loading) return <div className="text-white p-6">Yüklənir...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Transferlər</h2>
        <button 
          onClick={() => { resetForm(); setIsAdding(!isAdding); }}
          className="bg-accent text-on-accent px-4 py-2 rounded-lg font-bold flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" /> <span>{isAdding ? 'Ləğv et' : 'Yeni Transfer'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Oyunçu Adı</label>
              <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Tarix</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Tip</label>
              <select value={transferType} onChange={e => setTransferType(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white">
                <option value="Gələn Transfer">Gələn Transfer</option>
                <option value="Gedən Transfer">Gedən Transfer</option>
                <option value="İcarə">İcarə</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Haradan</label>
              <input type="text" value={fromTeam} onChange={e => setFromTeam(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Haraya</label>
              <input type="text" value={toTeam} onChange={e => setToTeam(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Oyunçu Şəkli</label>
              <div className="flex items-center space-x-3">
                {imageUrl && <img src={imageUrl} alt="img" className="w-16 h-16 object-cover rounded" />}
                <label className="cursor-pointer bg-black border border-gray-700 px-4 py-2 rounded text-xs font-bold text-white uppercase">
                  {uploading ? 'Yüklənir...' : 'Şəkil Seç'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold">Yadda Saxla</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transfers.map(t => (
          <div key={t.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
            <div className="flex p-4 items-center space-x-4 border-b border-gray-700">
               {t.image_url ? (
                 <img src={t.image_url} alt="img" className="w-16 h-16 rounded-full object-cover border border-gray-700" />
               ) : (
                 <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-gray-500">?</div>
               )}
               <div>
                 <h3 className="text-white font-bold">{t.player_name}</h3>
                 <p className="text-accent text-xs font-bold uppercase">{t.transfer_type}</p>
                 <p className="text-gray-400 text-xs">{t.date}</p>
               </div>
            </div>
            <div className="p-4 flex-1 flex justify-between items-center text-sm">
               <div className="text-gray-400 text-center w-5/12 truncate">{t.from_team || 'Məlum deyil'}</div>
               <div className="text-gray-600 w-2/12 text-center">→</div>
               <div className="text-white font-bold text-center w-5/12 truncate">{t.to_team || 'Yarımada FK'}</div>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end space-x-2">
              <button onClick={() => handleEdit(t)} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(t.id)} className="p-2 bg-red-600/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {transfers.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-12 text-gray-500">Transfer tapılmadı.</div>
        )}
      </div>
    </div>
  );
}
