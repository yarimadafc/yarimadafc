'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{ title: string; desc: string; link: string; type: string }[]>([]);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    async function doSearch() {
      setLoading(true);
      const searchTerm = `%${query.toLowerCase()}%`;
      const allResults: { title: string; desc: string; link: string; type: string }[] = [];

      const { data: news } = await supabase.from('news').select('id, title, content').ilike('title', searchTerm);
      if (news) news.forEach(n => allResults.push({ title: n.title, desc: n.content?.substring(0, 100) + '...', link: `/news/${n.id}`, type: 'Xəbər' }));

      const { data: teams } = await supabase.from('teams').select('id, name, age_group').ilike('name', searchTerm);
      if (teams) teams.forEach(t => allResults.push({ title: t.name, desc: `Yaş Qrupu: ${t.age_group}`, link: `/teams/${t.id}`, type: 'Komanda' }));

      const { data: coaches } = await supabase.from('coaches').select('id, name, role, bio').ilike('name', searchTerm);
      if (coaches) coaches.forEach(c => allResults.push({ title: c.name, desc: c.role || 'Məşqçi', link: `/coaches/${c.id}`, type: 'Məşqçi' }));
      
      const { data: courses } = await supabase.from('coach_courses').select('id, title, description').ilike('title', searchTerm);
      if (courses) courses.forEach(c => allResults.push({ title: c.title, desc: c.description?.substring(0, 100) || '', link: `/courses/${c.id}`, type: 'Kurs' }));

      const { data: leaders } = await supabase.from('leadership').select('id, name, position').ilike('name', searchTerm);
      if (leaders) leaders.forEach(l => allResults.push({ title: l.name, desc: l.position || 'Klub Rəhbərliyi', link: '/club', type: 'Rəhbərlik' }));

      const pages = [
        { title: 'Ana Səhifə', link: '/', terms: ['ana', 'home', 'əsas'] },
        { title: 'Klub (Haqqımızda)', link: '/club', terms: ['klub', 'haqqımızda', 'about'] },
        { title: 'Komandalar', link: '/teams', terms: ['komanda', 'komandalar', 'teams', 'yaş', 'qrup'] },
        { title: 'Oyunlar', link: '/matches', terms: ['oyun', 'oyunlar', 'matç', 'matches'] },
        { title: 'Turnir Cədvəli', link: '/standings', terms: ['turnir', 'cədvəl', 'standings', 'xal'] },
        { title: 'Media (Qalereya & Video)', link: '/media', terms: ['media', 'qalereya', 'şəkil', 'video', 'foto'] },
        { title: 'Məşqçilər', link: '/coaches', terms: ['məşqçi', 'coaches', 'heyət'] },
        { title: 'Məşqçi Kursu', link: '/courses', terms: ['kurs', 'praktiki', 'məşqçi kursu'] },
        { title: 'Əlaqə', link: '/contact', terms: ['əlaqə', 'contact', 'nömrə', 'telefon', 'ünvan'] },
        { title: 'Onlayn Mağaza', link: '/shop', terms: ['mağaza', 'shop', 'forma', 'satış', 'almaq'] }
      ];

      const qLow = query.toLowerCase();
      pages.forEach(p => {
        if (p.title.toLowerCase().includes(qLow) || p.terms.some(t => t.includes(qLow))) {
          allResults.push({ title: p.title, desc: 'Səhifə keçidi', link: p.link, type: 'Səhifə' });
        }
      });

      setResults(allResults);
      setLoading(false);
    }
    doSearch();
  }, [query]);

  return (
    <>
      <h1 className="text-3xl font-black text-text-main uppercase tracking-tighter mb-2">
        Axtarış <span className="text-accent">Nəticələri</span>
      </h1>
      <p className="text-text-sec font-bold tracking-widest text-xs uppercase mb-8">
        Sorğu: "{query}"
      </p>

      {loading ? (
        <div className="text-accent font-bold text-lg animate-pulse">Axtarılır...</div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((r, i) => (
            <Link href={r.link} key={i}>
              <div className="bg-bg-sec p-6 rounded-xl border border-bg-border hover:border-accent/50 transition-colors cursor-pointer group mb-4 block">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-text-main group-hover:text-accent transition-colors">{r.title}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-bg-deep text-accent px-3 py-1 rounded-lg border border-accent/20">
                    {r.type}
                  </span>
                </div>
                <p className="text-text-sec text-sm line-clamp-2">{r.desc.replace(/(<([^>]+)>)/gi, "")}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-bg-sec p-12 rounded-2xl border border-bg-border text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-text-main font-bold text-xl mb-2">Heç nə tapılmadı</h3>
          <p className="text-text-sec">"{query}" sorğunuza uyğun nəticə yoxdur. Başqa sözlərlə yoxlayın.</p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="min-h-screen bg-bg-deep pt-[180px] pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Suspense fallback={<div className="text-text-main">Yüklənir...</div>}>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
}
