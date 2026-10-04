import Link from "next/link";

export default function NewsPage() {
  const newsList = [
    { id: 1, title: "Yeni Transferimiz İmzalanıb!", date: "12 Oktyabr 2026", excerpt: "Klubumuz heyətini yeni hücumçu ilə gücləndirdi. O, komandamıza böyük güc qatacaq." },
    { id: 2, title: "Çempionatın İlk Oyunu Uğurla Qələbə ilə Bitdi", date: "02 Oktyabr 2026", excerpt: "Mövsümün ilk oyununda Dəniz FK-nı 3-0 hesabı ilə məğlub edərək liderliyə yüksəldik." },
    { id: 3, title: "Gənclər Komandamız Turnirin Qalibi Oldu", date: "28 Sentyabr 2026", excerpt: "U-19 komandamız yerli turnirdə bütün rəqiblərini üstələyərək kuboku qazandı." },
    { id: 4, title: "Yeni Mövsüm Forması Təqdim Edildi", date: "20 Sentyabr 2026", excerpt: "Azarkeşlərimizin səbirsizliklə gözlədiyi yeni mövsüm formalarımız artıq satışdadır." },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Xəbərlər</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {newsList.map((news) => (
          <div key={news.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-1/3 bg-gray-300 min-h-[150px]"></div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-sm text-green-600 font-semibold block mb-2">{news.date}</span>
                <h3 className="text-xl font-bold mb-3 hover:text-green-700 cursor-pointer">{news.title}</h3>
                <p className="text-gray-600 mb-4">{news.excerpt}</p>
              </div>
              <Link href="#" className="text-green-700 font-medium hover:underline w-max">
                Daha çox oxu &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
