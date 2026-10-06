'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/adminpanel/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        router.push('/adminpanel');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Giriş uğursuz oldu');
      }
    } catch (err) {
      setError('Sistem xətası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#152741] flex items-center justify-center px-4">
      <div className="bg-[#112240] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">İdarəetmə Paneli</h1>
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">E-poçt (İstifadəçi adı)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#152741] border border-gray-700 text-white rounded p-3 focus:border-[#d7bf7b] outline-none" 
              placeholder="nagialiyevbusiness@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Şifrə</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#152741] border border-gray-700 text-white rounded p-3 focus:border-[#d7bf7b] outline-none" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--ks-kinpaku)] hover:bg-white text-[#152741] font-bold py-3 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Daxil olunur...' : 'Daxil Ol'}
          </button>
        </form>
      </div>
    </div>
  );
}
