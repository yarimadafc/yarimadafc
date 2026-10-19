'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut, BarChart3, Image as ImageIcon, FileText, Video, HandCoins, LayoutDashboard, ShoppingCart, Users,
  GraduationCap, Ticket, Newspaper, CalendarDays, Shirt, ListOrdered, ArrowLeftRight, Building2, UserCog, Award, Activity, UserCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { adminDb, OPEN_TAB_EVENT } from '@/lib/adminDb';
import ImageField from './components/ImageField';
import NewsAdmin from './components/NewsAdmin';
import VideosAdmin from './components/VideosAdmin';
import HeroAdmin from './components/HeroAdmin';
import TransfersAdmin from './components/TransfersAdmin';
import StandingsAdmin from './components/StandingsAdmin';
import TextsAdmin from './components/TextsAdmin';
import ClubAdmin from './components/ClubAdmin';
import CoachesAdmin from './components/CoachesAdmin';
import TeamsAdmin from './components/TeamsAdmin';
import MatchesAdmin from './components/MatchesAdmin';
import AchievementsAdmin from './components/AchievementsAdmin';
import SponsorsAdmin from './components/SponsorsAdmin';
import ShopAdmin from './components/ShopAdmin';
import LeadershipAdmin from './components/LeadershipAdmin';
import CoachCoursesAdmin from './components/CoachCoursesAdmin';
import MembersAdmin from './components/MembersAdmin';
import AnalyticsAdmin from './components/AnalyticsAdmin';
import TicketsAdmin from './components/TicketsAdmin';
import PlayerStatsAdmin from './components/PlayerStatsAdmin';

type Tab = { id: string; label: string; Icon: typeof BarChart3 };

// The menu is grouped the same way as the public site, so every section is easy to find.
// Sidebar (desktop) and the dropdown (phones) are both built from this one list.
const GROUPS: { title: string; tabs: Tab[] }[] = [
  { title: 'Ümumi', tabs: [
    { id: 'analytics', label: 'Sayt statistikası', Icon: Activity },
    { id: 'members', label: 'Üzvlər', Icon: UserCheck },
  ] },
  { title: 'Ana səhifə', tabs: [
    { id: 'hero', label: 'Slayder', Icon: LayoutDashboard },
    { id: 'images', label: 'Sayt şəkilləri', Icon: ImageIcon },
    { id: 'texts', label: 'Sayt yazıları', Icon: FileText },
  ] },
  { title: 'Xəbərlər və media', tabs: [
    { id: 'news', label: 'Xəbərlər', Icon: Newspaper },
    { id: 'videos', label: 'Videolar', Icon: Video },
  ] },
  { title: 'Oyunlar', tabs: [
    { id: 'matches', label: 'Oyunlar və nəticələr', Icon: CalendarDays },
    { id: 'standings', label: 'Turnir cədvəli', Icon: ListOrdered },
    { id: 'tickets', label: 'Biletlər', Icon: Ticket },
  ] },
  { title: 'Komandalar', tabs: [
    { id: 'teams', label: 'Komandalar və oyunçular', Icon: Shirt },
    { id: 'playerstats', label: 'Futbolçu statistikası', Icon: BarChart3 },
    { id: 'transfers', label: 'Transferlər', Icon: ArrowLeftRight },
  ] },
  { title: 'Klub', tabs: [
    { id: 'club', label: 'Klub haqqında', Icon: Building2 },
    { id: 'leadership', label: 'Rəhbərlik', Icon: UserCog },
    { id: 'staff', label: 'Klub heyəti', Icon: Users },
    { id: 'achievements', label: 'Nailiyyətlər', Icon: Award },
    { id: 'sponsors', label: 'Sponsorlar', Icon: HandCoins },
  ] },
  { title: 'Akademiya', tabs: [
    { id: 'coaches', label: 'Məşqçilər', Icon: Users },
    { id: 'courses', label: 'Məşqçi kursu', Icon: GraduationCap },
  ] },
  { title: 'Mağaza', tabs: [
    { id: 'shop', label: 'Məhsullar', Icon: ShoppingCart },
  ] },
];
const TABS = GROUPS.flatMap(g => g.tabs);
const STORAGE_KEY = 'admin.tab';

const IMAGE_SECTIONS = [
  { id: 'hero_bg', title: 'Ana səhifə arxa fonu', desc: 'Ana səhifənin ən yuxarısındakı böyük arxa fon şəkli.' },
  { id: 'about_bg', title: 'Klub haqqında', desc: 'Klub haqqında səhifəsinin yuxarı fon şəkli.' },
  { id: 'quick_shop', title: 'Sürətli keçid: Mağaza', desc: 'Ana səhifədəki Mağaza keçidinin şəkli.' },
  { id: 'quick_academy', title: 'Sürətli keçid: Akademiya', desc: 'Ana səhifədəki Akademiya keçidinin şəkli.' },
];

function SiteImages() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('site_images').select('section_key, image_url').then(({ data }) => {
      const map: Record<string, string> = {};
      (data || []).forEach(img => { map[img.section_key] = img.image_url; });
      setImages(map);
      setLoading(false);
    });
  }, []);

  const save = async (key: string, url: string) => {
    const { error } = url
      ? await adminDb.from('site_images').upsert({ section_key: key, image_url: url }, { onConflict: 'section_key' })
      : await adminDb.from('site_images').delete().eq('section_key', key);
    if (!error) setImages(prev => ({ ...prev, [key]: url }));
  };

  return (
    <div>
      <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Sayt şəkilləri</h2>
      <p className="text-gray-400 text-sm mb-8">Saytın müxtəlif yerlərində görünən əsas şəkillər. «Redaktə et» ilə şəkli kəsə və ya vacib hissəni seçə bilərsiniz.</p>
      {loading ? (
        <div className="text-accent text-center mt-10 font-bold uppercase tracking-widest animate-pulse">Yüklənir...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {IMAGE_SECTIONS.map(sec => (
            <div key={sec.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wide">{sec.title}</h3>
              <p className="text-gray-400 text-xs mb-4">{sec.desc}</p>
              <ImageField value={images[sec.id]} onChange={url => save(sec.id, url)} options={{ quality: sec.id.endsWith('_bg') ? 'high' : 'normal' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ id }: { id: string }) {
  switch (id) {
    case 'analytics': return <AnalyticsAdmin />;
    case 'members': return <MembersAdmin />;
    case 'hero': return <HeroAdmin />;
    case 'images': return <SiteImages />;
    case 'texts': return <TextsAdmin />;
    case 'news': return <NewsAdmin />;
    case 'videos': return <VideosAdmin />;
    case 'matches': return <MatchesAdmin />;
    case 'standings': return <StandingsAdmin />;
    case 'tickets': return <TicketsAdmin />;
    case 'teams': return <TeamsAdmin />;
    case 'playerstats': return <PlayerStatsAdmin />;
    case 'transfers': return <TransfersAdmin />;
    case 'club': return <ClubAdmin />;
    case 'leadership': return <LeadershipAdmin group="leadership" />;
    case 'staff': return <LeadershipAdmin group="staff" />;
    case 'achievements': return <AchievementsAdmin />;
    case 'sponsors': return <SponsorsAdmin />;
    case 'coaches': return <CoachesAdmin />;
    case 'courses': return <CoachCoursesAdmin />;
    case 'shop': return <ShopAdmin />;
    default: return null;
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('analytics');

  // reopen the section that was open before a reload
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only value, read once after mount
      if (saved && TABS.some(t => t.id === saved)) setActiveTab(saved);
    } catch { /* ignore */ }
  }, []);

  const open = (id: string) => {
    setActiveTab(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* ignore */ }
    window.scrollTo({ top: 0 });
  };

  // sections can send the admin to another section (e.g. Komandalar -> Futbolçu statistikası)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!TABS.some(t => t.id === id)) return;
      setActiveTab(id);
      try { localStorage.setItem(STORAGE_KEY, id); } catch { /* ignore */ }
      window.scrollTo({ top: 0 });
    };
    window.addEventListener(OPEN_TAB_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_TAB_EVENT, onOpen);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div className="flex flex-col min-h-0">
          <div className="p-6 border-b border-gray-700 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full border-2 border-accent overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-black tracking-widest text-xs uppercase text-accent">Yarımada FK</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">İdarəetmə</p>
            </div>
          </div>

          <nav className="p-3 overflow-y-auto min-h-0 space-y-4" aria-label="Admin bölmələri">
            {GROUPS.map(group => (
              <div key={group.title}>
                <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{group.title}</p>
                {group.tabs.map(({ id, label, Icon }) => (
                  <button key={id} onClick={() => open(id)} aria-current={activeTab === id ? 'page' : undefined} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-[13px] text-left transition-colors ${activeTab === id ? 'bg-accent text-on-accent' : 'text-gray-300 hover:text-white hover:bg-gray-900'}`}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest px-4 py-3 bg-gray-900 rounded-lg">
            <LogOut className="w-4 h-4" />
            <span>Çıxış et</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 md:p-8">
        {/* Phones: header + one clear section picker instead of a long scrolling row */}
        <div className="md:hidden mb-6 pb-4 border-b border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full border border-accent overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Logo.JPG.jpeg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-black tracking-widest text-[10px] uppercase text-accent">Admin</h1>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase" aria-label="Çıxış et">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <label className="block">
            <span className="sr-only">Bölmə</span>
            <select value={activeTab} onChange={e => open(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-semibold">
              {GROUPS.map(group => (
                <optgroup key={group.title} label={group.title}>
                  {group.tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </optgroup>
              ))}
            </select>
          </label>
        </div>

        <Section id={activeTab} />
      </main>
    </div>
  );
}
