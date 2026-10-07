'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Giriş uğursuz oldu.');
      }
    } catch (err) {
      setError('Xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-sec p-8 rounded-2xl border border-bg-border shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-text-main uppercase tracking-widest mb-2">Admin Panel</h1>
          <p className="text-text-sec text-sm">İdarəetmə panelinə daxil olun</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-text-sec text-xs font-bold uppercase tracking-widest mb-2">E-poçt</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-deep border border-bg-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-accent transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-text-sec text-xs font-bold uppercase tracking-widest mb-2">Şifrə</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-deep border border-bg-border rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-accent transition-colors"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-[#141414] font-black uppercase tracking-widest py-3 rounded-lg hover:bg-text-main hover:text-bg-main transition-colors disabled:opacity-50"
          >
            {loading ? 'Daxil olunur...' : 'Daxil Ol'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
