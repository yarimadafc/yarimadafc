'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    child_name: '',
    child_surname: '',
    birth_date: '',
    parent_name: '',
    phone: '',
    whatsapp: '',
    age_group: 'U-9',
    branch: '',
    note: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      const { error } = await supabase.from('registrations').insert([formData]);
      if (error) throw error;
      setStatus({ loading: false, success: true, error: '' });
      setFormData({
        child_name: '', child_surname: '', birth_date: '', parent_name: '',
        phone: '', whatsapp: '', age_group: 'U-9', branch: '', note: ''
      });
    } catch (error: any) {
      setStatus({ loading: false, success: false, error: error.message || 'Xəta baş verdi' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-[#112240] p-8 md:p-12 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wider text-center mb-4">Akademiyaya Qoşul</h1>
        <p className="text-gray-400 text-center mb-10">Övladınızı Yarımada FK akademiyasına qeydiyyatdan keçirin.</p>
        
        {status.success && <div className="bg-green-500/20 text-green-400 p-4 rounded mb-6">Qeydiyyat uğurla tamamlandı! Sizinlə tezliklə əlaqə saxlayacağıq.</div>}
        {status.error && <div className="bg-red-500/20 text-red-400 p-4 rounded mb-6">{status.error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Uşağın Adı</label>
              <input required type="text" name="child_name" value={formData.child_name} onChange={handleChange} className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:border-[#00e5a0] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Uşağın Soyadı</label>
              <input required type="text" name="child_surname" value={formData.child_surname} onChange={handleChange} className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:border-[#00e5a0] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Təvəllüd</label>
              <input required type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:border-[#00e5a0] outline-none text-white [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Valideynin Adı və Soyadı</label>
              <input required type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:border-[#00e5a0] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Telefon</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:border-[#00e5a0] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">WhatsApp</label>
              <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:border-[#00e5a0] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Yaş Qrupu</label>
              <select required name="age_group" value={formData.age_group} onChange={handleChange} className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:border-[#00e5a0] outline-none">
                <option value="U-9">U-9</option>
                <option value="U-10">U-10</option>
                <option value="U-11">U-11</option>
                <option value="U-12">U-12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Filial</label>
              <input required type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="Məs: Mərkəz filialı" className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:border-[#00e5a0] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Əlavə Qeyd</label>
            <textarea name="note" value={formData.note} onChange={handleChange} rows={4} className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:border-[#00e5a0] outline-none"></textarea>
          </div>
          <button disabled={status.loading} type="submit" className="w-full bg-[#00e5a0] hover:bg-[#00c98b] text-[#0a1628] font-bold py-4 rounded text-lg transition-colors disabled:opacity-50 mt-4">
            {status.loading ? 'Göndərilir...' : 'Qeydiyyatdan Keç'}
          </button>
        </form>
      </div>
    </div>
  );
}
