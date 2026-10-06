import Link from 'next/link';
import { Play } from 'lucide-react';

export default function VideoSection() {
  const smallVideos = [
    { id: 2, title: 'TARİXİ STADİONUMUZUN YUBİLEYİ İLƏ ƏLAQƏDAR YOLDAŞLIQ...', date: '4 oktyabr 2026' },
    { id: 3, title: 'SABAH 0:3 YARIMADA | GƏNCLƏR LİQASI | İCMAL', date: '3 oktyabr 2026' },
    { id: 4, title: 'YARIMADA 2:0 QƏBƏLƏ | U-17 LİQASI | İCMAL', date: '3 oktyabr 2026' },
  ];

  return (
    <section className="bg-[#06101e] py-20 border-b border-gray-800/50">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-start mb-12">
          <div className="w-8 h-[2px] bg-[#d7bf7b] mb-4"></div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Yarımada TV</h2>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Main Video */}
          <Link href="/preview/video/1" className="group flex-grow xl:w-2/3 relative rounded-2xl overflow-hidden block">
            <div className="w-full aspect-video bg-gray-800 relative">
               <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700 bg-gray-900 flex items-center justify-center text-gray-700 font-bold text-2xl">
                 Əsas Video Şəkli
               </div>
               
               {/* Play Button Overlay */}
               <div className="absolute bottom-6 lg:bottom-12 left-6 lg:left-12 flex flex-col items-start z-10">
                 <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#d7bf7b] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-black/50 group-hover:bg-white transition-colors">
                   <Play className="w-6 h-6 lg:w-8 lg:h-8 text-[#0a1628] fill-current ml-1" />
                 </div>
                 <h3 className="text-white font-black text-2xl lg:text-4xl uppercase tracking-tight leading-tight max-w-2xl group-hover:text-[#d7bf7b] transition-colors drop-shadow-md">
                   BİR GÜNÜ: CHALLENGE, MÜSAHİBƏ, MİLLİ KOMANDA
                 </h3>
                 <span className="text-gray-300 font-medium text-sm mt-4 drop-shadow-md">5 oktyabr 2026</span>
               </div>
               
               {/* Gradient for text readability */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            </div>
          </Link>

          {/* Video List & Button */}
          <div className="xl:w-1/3 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              {smallVideos.map((video) => (
                <Link href={`/preview/video/${video.id}`} key={video.id} className="group flex space-x-4 pb-6 border-b border-gray-800/50 hover:bg-gray-800/10 rounded-lg transition-colors">
                  {/* Thumb */}
                  <div className="w-40 sm:w-48 aspect-video bg-gray-800 rounded-xl relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 bg-[#d7bf7b] rounded-lg flex items-center justify-center shadow-md group-hover:bg-white transition-colors z-10">
                      <Play className="w-4 h-4 text-[#0a1628] fill-current ml-0.5" />
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col justify-center">
                    <h4 className="text-white font-bold text-sm lg:text-base leading-tight mb-2 group-hover:text-[#d7bf7b] transition-colors uppercase">
                      {video.title}
                    </h4>
                    <span className="text-gray-500 font-medium text-xs">{video.date}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bütün Videolar button */}
            <div className="mt-8 flex justify-end">
              <Link href="/preview/media" className="text-white font-bold text-sm tracking-widest border-b-2 border-[#d7bf7b] pb-1 hover:text-[#d7bf7b] transition-colors uppercase">
                Bütün videolar
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
