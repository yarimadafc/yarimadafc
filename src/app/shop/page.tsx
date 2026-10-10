'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSyncVersion } from '@/lib/siteSync';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // For image carousels per product
  const [activeImages, setActiveImages] = useState<Record<string, number>>({});

  const sync = useSyncVersion();
  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) {
        setProducts(data);
        const initialImages: Record<string, number> = {};
        data.forEach(p => initialImages[p.id] = 0);
        setActiveImages(initialImages);
      }
      setLoading(false);
    }
    loadProducts();
  }, [sync]);

  const nextImage = (e: React.MouseEvent, pId: string, max: number) => {
    e.preventDefault();
    setActiveImages(prev => ({ ...prev, [pId]: (prev[pId] + 1) % max }));
  };

  const prevImage = (e: React.MouseEvent, pId: string, max: number) => {
    e.preventDefault();
    setActiveImages(prev => ({ ...prev, [pId]: (prev[pId] - 1 + max) % max }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen bg-bg-deep pt-header pb-20">
      <PageHero title="Onlayn mağaza" subtitle="Komandamızın rəsmi formalarını, geyimlərini və müxtəlif aksesuarlarını birbaşa WhatsApp vasitəsilə sifariş verə bilərsiniz." />

      <div className="container mt-12">
        {loading ? (
          <div className="text-center py-20 text-accent font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p, i) => {
              const currentImgIdx = activeImages[p.id] || 0;
              const hasMultipleImages = p.images && p.images.length > 1;

              return (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="led-border led-hover card-fx bg-bg-sec rounded-3xl overflow-hidden border border-bg-border shadow-xl group flex flex-col h-full"
                >
                  <div className="h-72 bg-bg-main relative flex items-center justify-center overflow-hidden">
                    {p.images && p.images.length > 0 ? (
                      <>
                        <Link href={`/shop/${p.id}`} className="w-full h-full block">
                          <img src={p.images[currentImgIdx]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </Link>
                        {hasMultipleImages && (
                          <>
                            <button onClick={(e) => prevImage(e, p.id, p.images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-text-main p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={(e) => nextImage(e, p.id, p.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-text-main p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-2 left-0 w-full flex justify-center space-x-1">
                              {p.images.map((_: any, idx: number) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentImgIdx ? 'bg-accent' : 'bg-white/50'}`}></div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <span className="text-text-sec font-bold uppercase tracking-widest text-xs">ŞƏKİL YOXDUR</span>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 bg-bg-sec">
                    <Link href={`/shop/${p.id}`} className="hover:text-accent transition-colors"><h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-2 line-clamp-2">{p.title}</h3></Link>
                    {p.description && <p className="text-text-sec text-sm mb-4 line-clamp-3">{p.description}</p>}
                    
                    <div className="mt-auto space-y-4">
                      {/* Attributes */}
                      <div className="flex flex-col space-y-2">
                        {p.colors && p.colors.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-xs text-text-sec font-bold uppercase mr-2">Rəng:</span>
                            {p.colors.map((c: string) => <span key={c} className="text-[10px] text-text-sec bg-bg-deep px-2 py-1 rounded border border-bg-border">{c}</span>)}
                          </div>
                        )}
                        {p.sizes && p.sizes.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="text-xs text-text-sec font-bold uppercase mr-2">Ölçü:</span>
                            {p.sizes.map((s: string) => <span key={s} className="text-[10px] text-text-sec bg-bg-deep px-2 py-1 rounded border border-bg-border">{s}</span>)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-bg-border">
                        <span className="text-2xl font-black text-accent">{p.price} ₼</span>
                        <a 
                          href={`https://wa.me/${p.whatsapp_number}?text=Salam, mən mağazadan bu məhsulu sifariş vermək istəyirəm: ${encodeURIComponent(p.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-fx bg-[#25D366] text-text-main py-2 px-4 rounded-xl hover:bg-[#128C7E] transition-colors shadow-lg shadow-[#25D366]/20 flex items-center space-x-2 font-bold text-xs uppercase tracking-widest"
                          title="WhatsApp-la Sifariş Ver"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          <span>Sifariş</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-text-sec font-bold tracking-widest uppercase">
            Tezliklə yeni məhsullar əlavə olunacaq!
          </div>
        )}
      </div>
      </div>
    </motion.div>
  );
}
