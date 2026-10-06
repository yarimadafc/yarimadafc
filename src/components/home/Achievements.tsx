export default function Achievements() {
  const achievements = [
    { num: 9, text: 'Azərbaycan\nçempionatının qalibi', icon: '🏆' },
    { num: 6, text: 'Azərbaycan\nKubokunun qalibi', icon: '🏆' },
    { num: 2, text: 'Azərbaycan\nSuperkubokunun qalibi', icon: '🏆' },
    { num: 1, text: 'Birlik Kubokunun\nqalibi', icon: '🏆' },
  ];

  return (
    <section className="bg-[#0a1628] py-24 border-b border-gray-800/50">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Nailiyyətlər</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-800/50">
          {achievements.map((item, i) => (
            <div key={i} className="flex flex-col items-center pt-8 md:pt-0">
              {/* Trophy icon placeholder */}
              <div className="w-24 h-32 flex justify-center items-end text-6xl mb-6 grayscale brightness-150">
                 {item.icon}
              </div>
              
              <div className="flex items-start space-x-4">
                <span className="text-5xl md:text-6xl font-black text-white">{item.num}</span>
                <p className="text-gray-300 font-bold text-sm tracking-wide leading-snug whitespace-pre-line mt-2">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
