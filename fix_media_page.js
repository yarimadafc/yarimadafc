const fs = require('fs');
let content = fs.readFileSync('src/app/media/page.tsx', 'utf-8');

const headerStr = `<div className="w-full bg-[#152741] py-12 md:py-16 border-b border-gray-800 relative overflow-hidden mb-10 mt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1423] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg"
          >
            KLUB <span className="text-[#d7bf7b]">MEDİASI</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#d7bf7b] mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Yarımada FK-nın ən maraqlı oyun anları, məşqlər və klub daxili videoları.
          </p>
        </div>
      </div>`;

content = content.replace(
  /<div className="container mx-auto px-4 lg:px-8 py-10 min-h-screen">/,
  `<div className="min-h-screen bg-[#0a1423] pb-20">
      ${headerStr}
      <div className="container mx-auto px-4 lg:px-8">`
);

// Remove the outer motion.div padding if any, it's fine.
fs.writeFileSync('src/app/media/page.tsx', content);
