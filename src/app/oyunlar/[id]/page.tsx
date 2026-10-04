import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const MOCK_MATCH = {
  id: '2',
  home_team: 'Neftçi IK',
  away_team: 'Yarımada FK',
  date: '2026-10-01',
  time: '16:00',
  stadium: 'İsmət Qayıbov',
  tournament: 'Region Liqası',
  home_score: 1,
  away_score: 2,
  head_coach: 'Emin Quliyev',
  report: 'Yarımada FK çətin səfər oyunundan qalibiyyətlə ayrıldı. Komandamız oyunun əvvəlindən təşəbbüsü ələ alaraq ardıcıl hücumlar təşkil etdi.',
  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
};

const MOCK_EVENTS = [
  { id: 1, minute: 15, type: 'goal', player: 'Əli Məmmədov', team: 'Yarımada FK', assist: 'Vüqar Həsənov' },
  { id: 2, minute: 32, type: 'yellow_card', player: 'Rəşad Sadiqov', team: 'Neftçi IK' },
  { id: 3, minute: 67, type: 'goal', player: 'Samir Əliyev', team: 'Neftçi IK' },
  { id: 4, minute: 82, type: 'goal', player: 'Orxan Əliyev', team: 'Yarımada FK', assist: null }
];

const MOCK_LINEUP = [
  { id: 1, number: 1, name: 'Tərlan Əhmədov', position: 'GK', is_starter: true },
  { id: 2, number: 4, name: 'Vüqar Həsənov', position: 'DF', is_starter: true },
  { id: 3, number: 5, name: 'Ramin Məmmədov', position: 'DF', is_starter: true },
  { id: 4, number: 8, name: 'Elvin Bədəlov', position: 'MF', is_starter: true },
  { id: 5, number: 10, name: 'Əli Məmmədov', position: 'FW', is_starter: true },
  { id: 6, number: 11, name: 'Orxan Əliyev', position: 'FW', is_starter: true },
  { id: 7, number: 12, name: 'Nadir Quliyev', position: 'GK', is_starter: false },
  { id: 8, number: 17, name: 'Fərid Rzayev', position: 'MF', is_starter: false }
];

export default async function OyunDetaliPage({ params }: { params: { id: string } }) {
  let match = MOCK_MATCH;
  let events = MOCK_EVENTS;
  let lineup = MOCK_LINEUP;

  try {
    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', params.id)
      .single();
    if (matchData && !matchError) match = matchData;

    const { data: eventsData, error: eventsError } = await supabase
      .from('match_events')
      .select('*, players(name)')
      .eq('match_id', params.id)
      .order('minute', { ascending: true });
    if (eventsData && !eventsError) events = eventsData;

    const { data: lineupData, error: lineupError } = await supabase
      .from('match_lineups')
      .select('*, players(name, number, position)')
      .eq('match_id', params.id);
    if (lineupData && !lineupError) lineup = lineupData;

  } catch (error) {
    console.error("Error fetching match details:", error);
  }

  const starters = lineup.filter(p => p.is_starter);
  const subs = lineup.filter(p => !p.is_starter);

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#0a1628] pt-24 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0a1628] text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-6">
            <span className="text-[#c9a84c] font-bold tracking-widest uppercase text-sm">{match.tournament}</span>
            <p className="text-gray-400 mt-2">{match.date} • {match.time}</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="text-2xl md:text-4xl font-bold uppercase tracking-wider text-center flex-1">
              {match.home_team}
            </div>
            
            <div className="bg-white/10 px-8 py-4 rounded-xl flex items-center gap-4 text-4xl md:text-6xl font-bold">
              <span>{match.home_score}</span>
              <span className="text-[#c9a84c]">-</span>
              <span>{match.away_score}</span>
            </div>
            
            <div className="text-2xl md:text-4xl font-bold uppercase tracking-wider text-center flex-1">
              {match.away_team}
            </div>
          </div>
          
          <div className="text-center mt-8 text-gray-400 flex items-center justify-center gap-6 text-sm">
            <span>🏟️ {match.stadium}</span>
            {match.head_coach && <span>👔 Baş Məşqçi: {match.head_coach}</span>}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Events & Report */}
        <div className="lg:col-span-2 space-y-8">
          {/* Events */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b pb-4">Hadisələr</h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {events.map((event, i) => (
                <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#0a1628] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-sm font-bold">
                    {event.minute}'
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#f5f5f5] p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      {event.type === 'goal' && <span className="text-xl">⚽</span>}
                      {event.type === 'yellow_card' && <span className="w-4 h-5 bg-yellow-400 rounded-sm inline-block"></span>}
                      {event.type === 'red_card' && <span className="w-4 h-5 bg-red-600 rounded-sm inline-block"></span>}
                      <div>
                        <p className="font-bold text-lg">{event.player}</p>
                        <p className="text-sm text-gray-500">{event.team}</p>
                        {event.assist && <p className="text-xs text-gray-400 mt-1">Asist: {event.assist}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b pb-4">Hesabat</h2>
            <div className="prose max-w-none text-gray-700">
              <p>{match.report}</p>
            </div>
          </div>
          
          {/* Media (Video) */}
          {match.video_url && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b pb-4">İcmal Videosu</h2>
              <div className="aspect-w-16 aspect-h-9 w-full bg-gray-200 rounded-lg overflow-hidden">
                {/* Embedded Video Placeholder */}
                <iframe src={match.video_url} className="w-full h-96" frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Lineups */}
        <div className="space-y-8">
          <div className="bg-[#0a1628] text-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 border-b border-white/20 pb-4 text-[#c9a84c]">Heyət</h2>
            
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-gray-300">Əsas Heyət</h3>
              <ul className="space-y-3">
                {starters.map((player) => (
                  <li key={player.id} className="flex items-center gap-3 bg-white/5 p-2 rounded">
                    <span className="w-8 h-8 flex items-center justify-center bg-white/10 font-bold rounded">{player.number}</span>
                    <span className="font-medium">{player.name}</span>
                    <span className="ml-auto text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">{player.position}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-300">Ehtiyat Oyunçular</h3>
              <ul className="space-y-3">
                {subs.map((player) => (
                  <li key={player.id} className="flex items-center gap-3 bg-white/5 p-2 rounded">
                    <span className="w-8 h-8 flex items-center justify-center bg-white/10 font-bold rounded">{player.number}</span>
                    <span className="text-gray-300">{player.name}</span>
                    <span className="ml-auto text-xs text-gray-500">{player.position}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
