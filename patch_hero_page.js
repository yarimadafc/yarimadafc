const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Import Chevron for carousel
if (!content.includes('import { ChevronLeft, ChevronRight }')) {
  content = content.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport { ChevronLeft, ChevronRight } from 'lucide-react';");
}

// Add state for hero slides
const stateAdd = `
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    async function loadSlides() {
      const { data } = await supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
      if (data && data.length > 0) {
        setHeroSlides(data);
      } else {
        // Default slide if empty
        setHeroSlides([{ id: 'default', image_url: '/background2.jpeg', title: heroTexts.hero_title_1, subtitle: heroTexts.hero_subtitle }]);
      }
    }
    loadSlides();
  }, [heroTexts]);

  useEffect(() => {
    if (heroSlides.length > 1) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroSlides]);
`;

content = content.replace("const [mounted, setMounted] = useState(false);", "const [mounted, setMounted] = useState(false);\n" + stateAdd);

// Replace the Hero Section rendering
const heroStart = '<section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">';
const heroEnd = '</section>';

const newHero = `
        <section className="relative min-h-[90vh] md:min-h-[100vh] flex flex-col justify-end overflow-hidden">
          <AnimatePresence mode="wait">
            {heroSlides.length > 0 && (
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-0"
              >
                <img 
                  src={heroSlides[activeSlide].image_url} 
                  alt="Hero" 
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Qradiyent - Daha qatı görünüş üçün */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/60 to-black/40 z-0"></div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full mb-32 flex flex-col justify-end h-full mt-auto">
            <div className="flex flex-col lg:flex-row items-end w-full max-w-7xl mx-auto justify-between pb-12">
              
              {/* Sol Tərəf (Mətnlər) */}
              <div className="w-full lg:w-1/2 flex flex-col justify-end text-left z-10">
                 <motion.h1 
                   key={\`title-\${activeSlide}\`}
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8 }}
                   className="text-4xl md:text-5xl lg:text-7xl font-black text-text-main leading-[1.1] tracking-tight mb-4 drop-shadow-2xl"
                 >
                   {heroSlides[activeSlide]?.title || heroTexts.hero_title_1} <br />
                   <span className="text-accent relative">
                     {heroTexts.hero_title_2}
                   </span>
                 </motion.h1>
                 <motion.p 
                   key={\`subtitle-\${activeSlide}\`}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.8, delay: 0.2 }}
                   className="text-base lg:text-xl text-gray-300 mb-8 max-w-xl font-medium drop-shadow-md"
                 >
                   {heroSlides[activeSlide]?.subtitle || heroTexts.hero_subtitle}
                 </motion.p>
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8, delay: 0.4 }}
                   className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-10 lg:mb-0"
                 >
                   {heroSlides[activeSlide]?.link_url ? (
                     <Link href={heroSlides[activeSlide].link_url} className="w-full sm:w-auto bg-accent text-bg-main px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-80 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                       Daha Ətraflı
                     </Link>
                   ) : (
                     <Link href="/academy" className="w-full sm:w-auto bg-accent text-bg-main px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-80 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                       Akademiyaya Qoşul
                     </Link>
                   )}
                 </motion.div>
              </div>

              {/* Sağ Tərəf - Match Widget (Optional if needed) */}
              <div className="hidden lg:flex w-full lg:w-1/3 items-end justify-end z-10 relative">
               
              </div>
            </div>

            {/* Balaca şəkillər (Thumbnails) */}
            <div className="absolute bottom-8 right-4 lg:right-8 flex space-x-3 z-20">
               {heroSlides.map((slide, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => setActiveSlide(idx)}
                   className={\`w-16 h-12 md:w-24 md:h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 \${activeSlide === idx ? 'border-accent scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}\`}
                 >
                   <img src={slide.image_url} alt="thumb" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>
        </section>
`;

const startIndex = content.indexOf(heroStart);
const endIndex = content.indexOf(heroEnd, startIndex) + heroEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  content = content.slice(0, startIndex) + newHero + content.slice(endIndex);
  fs.writeFileSync('src/app/page.tsx', content, 'utf8');
}
