'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', resolvedParams.id).maybeSingle();
      if (data) setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#000000] pt-[140px] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#d7bf7b] border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#000000] pt-[140px] text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-4">Məhsul Tapılmadı</h1>
        <Link href="/shop" className="text-[#d7bf7b] hover:underline">Mağazaya Qayıt</Link>
      </main>
    );
  }

  const nextImage = () => setCurrentImgIdx(prev => (prev + 1) % (product.images?.length || 1));
  const prevImage = () => setCurrentImgIdx(prev => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1));

  return (
    <main className="min-h-screen bg-[#000000] flex flex-col text-white">
      <Navbar />
      
      <div className="flex-grow pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center text-xs font-bold uppercase tracking-widest text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Ana Səhifə</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Yarımada Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-[#d7bf7b] truncate max-w-[200px]">{product.title}</span>
          </div>

          <div className="bg-[#141414] rounded-3xl border border-gray-800 p-6 md:p-10 flex flex-col md:flex-row gap-10">
            {/* Sol Tərəf - Şəkil */}
            <div className="w-full md:w-1/2 flex flex-col space-y-4">
              <div className="relative aspect-square bg-[#0a0a0a] rounded-2xl overflow-hidden group">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img src={product.images[currentImgIdx]} alt={product.title} className="w-full h-full object-contain" />
                    {product.images.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d7bf7b] text-white p-2 rounded-full backdrop-blur-sm transition-all">
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#d7bf7b] text-white p-2 rounded-full backdrop-blur-sm transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">Şəkil yoxdur</div>
                )}
                
                {/* Zəmanət Badge */}
                <div className="absolute top-4 right-4 bg-green-500/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center shadow-lg backdrop-blur-sm border border-green-400">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Zəmanətli
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
                  {product.images.map((img: string, idx: number) => (
                    <button key={idx} onClick={() => setCurrentImgIdx(idx)} className={`flex-shrink-0 w-20 h-20 bg-[#0a0a0a] rounded-xl overflow-hidden border-2 transition-all ${currentImgIdx === idx ? 'border-[#d7bf7b] opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ Tərəf - Məlumatlar */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white">{product.title}</h1>
              
              <div className="text-4xl font-black text-[#d7bf7b] mb-6">
                {product.price} <span className="text-2xl">₼</span>
              </div>

              {product.description && (
                <div className="mb-8">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 border-b border-gray-800 pb-2">Məhsul haqqında</h3>
                  <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mb-8">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Rənglər</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c: string) => (
                        <div key={c} className="flex items-center space-x-1.5 bg-[#0a0a0a] border border-gray-700 px-3 py-1.5 rounded-lg">
                          <span className="text-xs font-bold text-gray-300">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Ölçülər</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s: string) => (
                        <span key={s} className="bg-[#0a0a0a] border border-gray-700 text-gray-300 text-xs font-black px-3 py-1.5 rounded-lg">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Xüsusiyyətlər (Static info for trust) */}
              <div className="flex flex-col space-y-3 mb-10 bg-[#0a0a0a] p-4 rounded-xl border border-gray-800">
                <div className="flex items-center text-sm font-medium text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Yüksək keyfiyyətli material
                </div>
                <div className="flex items-center text-sm font-medium text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Rəsmi Yarımada FK məhsulu
                </div>
                <div className="flex items-center text-sm font-medium text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Bütün ölkə üzrə çatdırılma imkanı
                </div>
              </div>

              <a 
                href={`https://wa.me/${product.whatsapp_number}?text=Salam, mən mağazadan bu məhsulu sifariş vermək istəyirəm: ${encodeURIComponent(product.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebd5c] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center transition-all shadow-lg hover:shadow-[#25D366]/20"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp ilə Sifariş Et
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
