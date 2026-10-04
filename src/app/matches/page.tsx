export default function MatchesPage() {
  const matches = [
    { date: "15 Oktyabr 2026, 18:00", home: "Yarımada FK", away: "Rəqib FK", result: "- : -", status: "Növbəti Oyun" },
    { date: "08 Oktyabr 2026, 17:00", home: "Qartallar", away: "Yarımada FK", result: "1 : 2", status: "Tamamlanıb" },
    { date: "01 Oktyabr 2026, 19:00", home: "Yarımada FK", away: "Dəniz FK", result: "3 : 0", status: "Tamamlanıb" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Oyunlar və Nəticələr</h1>
      
      <div className="bg-[var(--surface)] shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-700 text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tarix</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Ev Sahibi</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Nəticə</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Qonaq</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--surface)] divide-y divide-gray-200">
            {matches.map((match, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-2)]'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">{match.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text)] text-right">{match.home}</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-center">
                  <span className={match.status === 'Növbəti Oyun' ? 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full' : 'bg-green-100 text-green-800 px-3 py-1 rounded-full'}>
                    {match.result}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text)]">{match.away}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-[var(--text-muted)]">{match.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
