import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mb-16 bg-green-800 text-white rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row">
        <div className="p-10 md:p-16 flex flex-col justify-center w-full md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Yarımada FK - Yeni Mövsümə Hazır!
          </h1>
          <p className="text-lg mb-8 text-green-100">
            Komandamız qarşıdan gələn çempionat üçün məşqlərini tam sürətlə davam etdirir. Əsas məqsədimiz çempionluqdur!
          </p>
          <Link href="/news" className="bg-white text-green-800 font-bold py-3 px-6 rounded-lg w-max hover:bg-gray-100 transition duration-300">
            Ətraflı Oxu
          </Link>
        </div>
        <div className="w-full md:w-1/2 min-h-[300px] bg-green-900 flex items-center justify-center text-green-700">
          {/* Placeholder for an image */}
          <span className="text-2xl font-bold">Klub Şəkli</span>
        </div>
      </section>

      {/* Next Match Section */}
      <section className="w-full max-w-7xl mb-16">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-green-700 pb-2 inline-block">Növbəti Oyun</h2>
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center mb-4 md:mb-0 w-1/3">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 flex items-center justify-center font-bold">YFK</div>
            <span className="font-semibold text-lg">Yarımada FK</span>
          </div>
          
          <div className="flex flex-col items-center w-1/3">
            <span className="text-sm text-gray-500 mb-1">15 Oktyabr, 18:00</span>
            <span className="text-xl font-bold bg-gray-100 px-4 py-2 rounded-lg">VS</span>
            <span className="text-sm text-gray-500 mt-1">Şəhər Stadionu</span>
          </div>

          <div className="flex flex-col items-center mt-4 md:mt-0 w-1/3">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 flex items-center justify-center font-bold">RQ</div>
            <span className="font-semibold text-lg">Rəqib FK</span>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold border-b-2 border-green-700 pb-2 inline-block">Son Xəbərlər</h2>
          <Link href="/news" className="text-green-700 font-semibold hover:underline">
            Bütün xəbərlər &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-5">
                <span className="text-sm text-green-600 font-semibold">12 Oktyabr 2026</span>
                <h3 className="text-xl font-bold mt-2 mb-3">Yeni Transferimiz İmzalanıb!</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">Klubumuz heyətini yeni hücumçu ilə gücləndirdi. O, komandamıza böyük güc qatacaq.</p>
                <Link href="/news" className="text-green-700 font-medium hover:underline">Daha çox</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
