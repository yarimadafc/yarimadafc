import { supabase } from '@/lib/supabase'



export default async function TurnirCedveliPage() {
  let standings = [];

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
            <h2 className="text-2xl font-bold uppercase tracking-wider text-[#c9a84c]">Region Liqası 2026/27</h2>
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
                        isYarimada ? 'bg-[#c9a84c]/10 border-l-4 border-l-[#c9a84c]' : ''
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
