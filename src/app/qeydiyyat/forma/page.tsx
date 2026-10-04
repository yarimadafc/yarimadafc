'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function QeydiyyatFormPage() {
  const [formData, setFormData] = useState({
    child_name: '',
    child_surname: '',
    birth_date: '',
    parent_name: '',
    phone: '',
    whatsapp: '',
    age_group: 'U-9',
    branch: 'Mərkəz',
    note: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('registrations')
        .insert([formData]);

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({
        child_name: '', child_surname: '', birth_date: '',
        parent_name: '', phone: '', whatsapp: '',
        age_group: 'U-9', branch: 'Mərkəz', note: ''
      });
    } catch (err: any) {
      setError(err.message || 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="flex-grow pt-24 pb-20 bg-[#f8fafc]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-gray-500 font-mono text-sm">
            <Link href="/" className="hover:text-black transition-colors">Ana səhifə</Link> /{' '}
            <Link href="/qeydiyyat" className="hover:text-black transition-colors">Akademiyaya Qoşul</Link> /{' '}
            <span className="text-black">Forma</span>
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-black text-[#0a1628] uppercase tracking-tight mb-2">
            Müraciət Forması
          </h1>
          <p className="text-gray-500 mb-8">Məlumatları düzgün və tam doldurduğunuzdan əmin olun. Nümayəndələrimiz sizinlə tezliklə əlaqə saxlayacaq.</p>

          {success ? (
            <div className="bg-[#dcfce7] text-[#166534] p-8 rounded-2xl text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold mb-2">Müraciətiniz qəbul edildi!</h3>
              <p>Ən qısa zamanda qeyd etdiyiniz nömrə ilə əlaqə saxlayacağıq.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-6 px-6 py-2 bg-[#166534] text-white rounded-full font-medium"
              >
                Yeni müraciət
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0a1628] mb-2 uppercase tracking-wide">Uşağın adı *</label>
                  <input required type="text" name="child_name" value={formData.child_name} onChange={handleChange} className="w-full bg-[#f8fafc] border-transparent focus:border-[#00e5a0] focus:bg-white focus:ring-0 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0a1628] mb-2 uppercase tracking-wide">Uşağın soyadı *</label>
                  <input required type="text" name="child_surname" value={formData.child_surname} onChange={handleChange} className="w-full bg-[#f8fafc] border-transparent focus:border-[#00e5a0] focus:bg-white focus:ring-0 rounded-xl px-4 py-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0a1628] mb-2 uppercase tracking-wide">Doğum tarixi</label>
                  <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="w-full bg-[#f8fafc] border-transparent focus:border-[#00e5a0] focus:bg-white focus:ring-0 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0a1628] mb-2 uppercase tracking-wide">Yaş qrupu *</label>
                  <select required name="age_group" value={formData.age_group} onChange={handleChange} className="w-full bg-[#f8fafc] border-transparent focus:border-[#00e5a0] focus:bg-white focus:ring-0 rounded-xl px-4 py-3">
                    <option value="U-9">U-9 (8-9 yaş)</option>
                    <option value="U-10">U-10 (9-10 yaş)</option>
                    <option value="U-11">U-11 (10-11 yaş)</option>
                    <option value="U-12">U-12 (11-12 yaş)</option>
                    <option value="Digər">Digər</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0a1628] mb-2 uppercase tracking-wide">Valideynin adı və soyadı *</label>
                <input required type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} className="w-full bg-[#f8fafc] border-transparent focus:border-[#00e5a0] focus:bg-white focus:ring-0 rounded-xl px-4 py-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0a1628] mb-2 uppercase tracking-wide">Əlaqə nömrəsi *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#f8fafc] border-transparent focus:border-[#00e5a0] focus:bg-white focus:ring-0 rounded-xl px-4 py-3" placeholder="(050) 123-45-67" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0a1628] mb-2 uppercase tracking-wide">WhatsApp nömrəsi</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-[#f8fafc] border-transparent focus:border-[#00e5a0] focus:bg-white focus:ring-0 rounded-xl px-4 py-3" placeholder="(050) 123-45-67" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0a1628] mb-2 uppercase tracking-wide">Əlavə qeydlər</label>
                <textarea name="note" value={formData.note} onChange={handleChange} rows={4} className="w-full bg-[#f8fafc] border-transparent focus:border-[#00e5a0] focus:bg-white focus:ring-0 rounded-xl px-4 py-3" placeholder="Övladınızın əvvəlki futbol təcrübəsi və ya sağlamlıq vəziyyəti haqqında məlumat..."></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00e5a0] hover:bg-[#00c98c] text-[#0a1628] font-black uppercase tracking-widest py-4 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? 'Göndərilir...' : 'Müraciəti Göndər'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
