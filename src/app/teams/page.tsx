import Image from "next/image";

export default function TeamsPage() {
  const players = [
    { name: "Əli Məmmədov", position: "Qapıçı", number: 1 },
    { name: "Vüqar Əliyev", position: "Müdafiəçi", number: 4 },
    { name: "Rüstəm Həsənov", position: "Müdafiəçi", number: 5 },
    { name: "Elvin Quliyev", position: "Yarımmüdafiəçi", number: 8 },
    { name: "Samir Hüseynov", position: "Yarımmüdafiəçi", number: 10 },
    { name: "Cavid Rəhimov", position: "Hücumçu", number: 9 },
    { name: "Orxan Qarayev", position: "Hücumçu", number: 11 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Komandamız</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {players.map((player, index) => (
          <div key={index} className="bg-[var(--surface)] rounded-xl shadow-lg overflow-hidden border border-[var(--border)] flex flex-col items-center text-center p-6">
            <div className="w-24 h-24 bg-[var(--border)] rounded-full mb-4 flex items-center justify-center text-[var(--text-muted)] text-3xl font-bold">
              {player.number}
            </div>
            <h3 className="text-xl font-bold mb-1">{player.name}</h3>
            <p className="text-green-700 font-medium">{player.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
