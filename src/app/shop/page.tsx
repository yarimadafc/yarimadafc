'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Hamısı');

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const categories = ['Hamısı', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = activeCategory === 'Hamısı' ? products : products.filter(p => p.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto">
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Komandamızın rəsmi formalarını, geyimlərini və müxtəlif aksesuarlarını birbaşa WhatsApp vasitəsilə sifariş verə bilərsiniz.
        </p>

        {/* Categories */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(c => (
              <button 
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-colors ${activeCategory === c ? 'bg-[#d7bf7b] text-[#152741]' : 'bg-[#152741] text-gray-400 hover:text-white border border-gray-800'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        {loading ? (
          <div className="text-center py-20 text-[#d7bf7b] font-bold tracking-widest uppercase animate-pulse">Yüklənir...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p, i) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#152741] rounded-3xl overflow-hidden border border-gray-800 shadow-xl group flex flex-col"
              >
                <div className="h-64 bg-[#0d1a2d] relative p-6 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152741] to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <svg className="w-20 h-20 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  )}
                  <div className="absolute top-4 right-4 bg-[#d7bf7b] text-[#152741] font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-widest z-20">
                    {p.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1 relative z-20 bg-[#152741]">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 line-clamp-2">{p.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3">{p.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-3xl font-black text-[#d7bf7b]">{p.price ? `${p.price} ₼` : 'Q/Y'}</span>
                    <a 
                      href={`https://wa.me/994504671321?text=Salam, mən mağazadan bu məhsulu sifariş vermək istəyirəm: ${encodeURIComponent(p.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white p-3 rounded-full hover:bg-[#128C7E] transition-colors shadow-lg shadow-[#25D366]/20 flex items-center justify-center"
                      title="WhatsApp-la Sifariş Ver"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-bold tracking-widest uppercase">
            Tezliklə yeni məhsullar əlavə olunacaq!
          </div>
        )}
      </div>
    </motion.div>
  );
}
