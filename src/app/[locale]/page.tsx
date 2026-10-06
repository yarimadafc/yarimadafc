export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
      <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(220,38,38,0.5)] border-4 border-red-500 relative">
          <div className="w-16 h-2 bg-white rounded-full"></div>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-widest mb-4">STOP</h1>
        <p className="text-gray-400 text-lg">Sistemə giriş məhdudlaşdırılıb.</p>
      </div>
    </div>
  );
}
