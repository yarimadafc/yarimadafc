import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Mock Data


export default async function OyunlarPage({
  searchParams
}: {
  searchParams: { tab?: string }
}) {
  const currentTab = searchParams.tab || 'upcoming';

  let matches = [];
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: currentTab === 'upcoming' });
      
    if (data && !error) {
      matches = data;
    }
  } catch (error) {
    console.error("Error fetching matches:", error);
  }

  const upcomingMatches = matches.filter(m => m.status === 'upcoming' || m.home_score === null);
  const completedMatches = matches.filter(m => m.status === 'completed' || m.home_score !== null);
  
  const displayMatches = currentTab === 'upcoming' ? upcomingMatches : completedMatches;

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#0a1628] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-center mb-12">
          Oyunlar
        </h1>
        
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1">
            <Link 
              href="?tab=upcoming" 
              className={`px-6 py-3 rounded-md font-bold uppercase tracking-wide transition-colors ${
                currentTab === 'upcoming' 
                  ? 'bg-[#0a1628] text-[#c9a84c]' 
                  : 'text-gray-500 hover:text-[#0a1628]'
              }`}
            >
              Qarşıdakı Oyunlar
            </Link>
            <Link 
              href="?tab=completed" 
              className={`px-6 py-3 rounded-md font-bold uppercase tracking-wide transition-colors ${
                currentTab === 'completed' 
                  ? 'bg-[#0a1628] text-[#c9a84c]' 
                  : 'text-gray-500 hover:text-[#0a1628]'
              }`}
            >
              Keçmiş Oyunlar
            </Link>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="space-y-6">
          {displayMatches.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">Bu bölmədə oyun tapılmadı.</p>
          ) : (
            displayMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-1">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/4 bg-[#0a1628] text-white p-6 flex flex-col justify-center items-center h-full">
                    <span className="text-[#c9a84c] text-sm font-bold tracking-wider mb-2">{match.tournament}</span>
                    <span className="text-lg">{match.date}</span>
                    <span className="text-xl font-bold">{match.time}</span>
                  </div>
                  
                  <div className="w-full md:w-2/4 p-6 flex justify-between items-center">
                    <div className="w-2/5 text-right">
                      <span className="font-bold text-xl md:text-2xl">{match.home_team}</span>
                    </div>
                    
                    <div className="w-1/5 flex justify-center">
                      {currentTab === 'completed' ? (
                        <div className="bg-[#f5f5f5] px-4 py-2 rounded-lg font-bold text-2xl flex items-center gap-2 shadow-inner">
                          <span>{match.home_score}</span>
                          <span className="text-gray-400">-</span>
                          <span>{match.away_score}</span>
                        </div>
                      ) : (
                        <div className="bg-[#f5f5f5] px-4 py-2 rounded-lg font-bold text-xl text-gray-400">
                          VS
                        </div>
                      )}
                    </div>
                    
                    <div className="w-2/5 text-left">
                      <span className="font-bold text-xl md:text-2xl">{match.away_team}</span>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/4 p-6 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-gray-100">
                    <div className="flex items-center text-gray-500 mb-4">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {match.stadium}
                    </div>
                    {currentTab === 'completed' && (
                      <Link 
                        href={`/oyunlar/${match.id}`}
                        className="bg-[#c9a84c] text-[#0a1628] px-6 py-2 rounded-md font-bold uppercase tracking-wider hover:bg-[#00c98b] transition-colors w-full text-center"
                      >
                        Ətraflı
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
