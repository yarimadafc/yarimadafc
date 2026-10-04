'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      const { error } = await supabase.from('contact_messages').insert([formData]);
      if (error) throw error;
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ first_name: '', last_name: '', phone: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      setStatus({ loading: false, success: false, error: error.message || 'Xəta baş verdi' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-center mb-12">Əlaqə</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-[#112240] p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-[#c9a84c]">Bizə Yazın</h2>
            {status.success && <div className="bg-green-500/20 text-green-400 p-4 rounded mb-6">Mesajınız uğurla göndərildi!</div>}
            {status.error && <div className="bg-red-500/20 text-red-400 p-4 rounded mb-6">{status.error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Ad" className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:outline-none focus:border-[#c9a84c] transition-colors" />
                <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Soyad" className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:outline-none focus:border-[#c9a84c] transition-colors" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:outline-none focus:border-[#c9a84c] transition-colors" />
              </div>
              <input required type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Mövzu" className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:outline-none focus:border-[#c9a84c] transition-colors" />
              <textarea required name="message" value={formData.message} onChange={handleChange} placeholder="Mesajınız" rows={5} className="w-full bg-[#0a1628] border border-gray-700 rounded p-3 focus:outline-none focus:border-[#c9a84c] transition-colors"></textarea>
              <button disabled={status.loading} type="submit" className="w-full bg-[#c9a84c] hover:bg-[#00c98b] text-[#0a1628] font-bold py-3 rounded transition-colors disabled:opacity-50">
                {status.loading ? 'Göndərilir...' : 'Göndər'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-[#112240] p-8 rounded-xl shadow-lg h-full">
              <h2 className="text-2xl font-bold mb-6 text-[#c9a84c]">Əlaqə Məlumatları</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="font-bold w-24">Ünvan:</span>
                  <span>Bakı, Azərbaycan</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold w-24">Telefon:</span>
                  <span>+994 50 000 00 00</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold w-24">WhatsApp:</span>
                  <span>+994 50 000 00 00</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold w-24">Email:</span>
                  <span>info@yarimadafk.az</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                  Google Maps Placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
