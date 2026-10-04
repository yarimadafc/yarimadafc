'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    teams: 0,
    players: 0,
    news: 0,
    registrations: 0,
    messages: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teams, players, news, regs, msgs] = await Promise.all([
          supabase.from('teams').select('*', { count: 'exact', head: true }),
          supabase.from('players').select('*', { count: 'exact', head: true }),
          supabase.from('news').select('*', { count: 'exact', head: true }),
          supabase.from('registrations').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          teams: teams.count || 0,
          players: players.count || 0,
          news: news.count || 0,
          registrations: regs.count || 0,
          messages: msgs.count || 0
        });
      } catch (e) {
        console.error('Error fetching stats:', e);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Komandalar', count: stats.teams, color: 'bg-blue-500' },
    { label: 'Futbolçular', count: stats.players, color: 'bg-green-500' },
    { label: 'Xəbərlər', count: stats.news, color: 'bg-purple-500' },
    { label: 'Qeydiyyatlar', count: stats.registrations, color: 'bg-orange-500' },
    { label: 'Mesajlar', count: stats.messages, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ümumi Statistika</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.count}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.color} bg-opacity-20 flex items-center justify-center`}>
              <div className={`w-4 h-4 rounded-full ${stat.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Son Qeydiyyatlar</h3>
            <Link href="/adminpanel/qeydiyyatlar" className="text-sm text-blue-600 hover:underline">Hamısına bax</Link>
          </div>
          <div className="p-6 text-gray-500 text-center">
            Məlumat yüklənir və ya hələ qeydiyyat yoxdur.
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Son Mesajlar</h3>
            <Link href="/adminpanel/elaqe" className="text-sm text-blue-600 hover:underline">Hamısına bax</Link>
          </div>
          <div className="p-6 text-gray-500 text-center">
            Məlumat yüklənir və ya hələ mesaj yoxdur.
          </div>
        </div>
      </div>
    </div>
  );
}
