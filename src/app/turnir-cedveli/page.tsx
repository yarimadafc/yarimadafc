import { supabase } from '@/lib/supabase'

const MOCK_STANDINGS = [
  { id: 1, team: 'Neftçi IK', played: 10, won: 8, drawn: 1, lost: 1, goals_for: 25, goals_against: 8, points: 25 },
  { id: 2, team: 'Yarımada FK', played: 10, won: 7, drawn: 2, lost: 1, goals_for: 22, goals_against: 10, points: 23 },
  { id: 3, team: 'Qarabağ-2', played: 10, won: 6, drawn: 3, lost: 1, goals_for: 18, goals_against: 9, points: 21 },
  { id: 4, team: 'Turan-2', played: 10, won: 4, drawn: 2, lost: 4, goals_for: 15, goals_against: 15, points: 14 },
  { id: 5, team: 'Kəpəz-2', played: 10, won: 2, drawn: 2, lost: 6, goals_for: 10, goals_against: 20, points: 8 },
  { id: 6, team: 'Zirə-2', played: 10, won: 1, drawn: 1, lost: 8, goals_for: 7, goals_against: 24, points: 4 },
];

export default async function TurnirCedveliPage() {
  let standings = MOCK_STANDINGS;

  try {
    const { data, error } = await supabase
      .from('standings')
      .select('*')
      .order('points', { ascending: false })
      .order('goal_diff', { ascending: false });
      
    if (data && !error && data.length > 0) standings = data;
  } catch (error) {
    console.error("Error fetching standings:", error);
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#0a1628] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-center mb-12">
          Turnir Cədvəli
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#0a1628] text-white p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-[#00e5a0]">Region Liqası 2026/27</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4">Komanda</th>
                  <th className="p-4 text-center w-12" title="Oyun">O</th>
                  <th className="p-4 text-center w-12 hidden md:table-cell" title="Qələbə">Q</th>
                  <th className="p-4 text-center w-12 hidden md:table-cell" title="Heç-heçə">H</th>
                  <th className="p-4 text-center w-12 hidden md:table-cell" title="Məğlubiyyət">M</th>
                  <th className="p-4 text-center w-12 hidden lg:table-cell" title="Vurulan Qollar">VQ</th>
                  <th className="p-4 text-center w-12 hidden lg:table-cell" title="Buraxılan Qollar">BQ</th>
                  <th className="p-4 text-center w-16" title="Qol Fərqi">+/-</th>
                  <th className="p-4 text-center w-16 font-bold text-[#0a1628]">X</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, index) => {
                  const isYarimada = row.team === 'Yarımada FK';
                  const goalDiff = row.goals_for - row.goals_against;
                  
                  return (
                    <tr 
                      key={row.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        isYarimada ? 'bg-[#00e5a0]/10 border-l-4 border-l-[#00e5a0]' : ''
                      }`}
                    >
                      <td className="p-4 text-center font-bold text-gray-500">{index + 1}</td>
                      <td className={`p-4 font-bold ${isYarimada ? 'text-[#0a1628]' : 'text-gray-700'}`}>
                        {row.team}
                      </td>
                      <td className="p-4 text-center">{row.played}</td>
                      <td className="p-4 text-center hidden md:table-cell">{row.won}</td>
                      <td className="p-4 text-center hidden md:table-cell">{row.drawn}</td>
                      <td className="p-4 text-center hidden md:table-cell">{row.lost}</td>
                      <td className="p-4 text-center hidden lg:table-cell text-green-600">{row.goals_for}</td>
                      <td className="p-4 text-center hidden lg:table-cell text-red-600">{row.goals_against}</td>
                      <td className="p-4 text-center">{goalDiff > 0 ? `+${goalDiff}` : goalDiff}</td>
                      <td className="p-4 text-center font-bold text-xl text-[#0a1628]">{row.points}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
