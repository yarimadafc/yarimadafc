const fs = require('fs');
let content = fs.readFileSync('src/components/home/Achievements.tsx', 'utf-8');

if (!content.includes("lucide-react")) {
  content = content.replace("import { supabase } from '@/lib/supabase';", "import { supabase } from '@/lib/supabase';\nimport { Trophy, Medal, Star } from 'lucide-react';");
}

content = content.replace(
  /className="bg-\[#0a1423\] border border-gray-800 p-8 rounded-2xl text-center shadow-xl hover:border-\[#d7bf7b\]\/30 transition-colors"\s*>\s*<div className="text-4xl md:text-5xl font-black text-\[#d7bf7b\] mb-3">\{item.count\}<\/div>\s*<div className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed">\{item.title\}<\/div>\s*<\/motion\.div>/g,
  `className="bg-[#0a1423] border border-gray-800 p-8 rounded-2xl text-center shadow-xl hover:-translate-y-2 hover:border-[#d7bf7b]/30 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Trophy Background Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 bg-[#d7bf7b]"></div>
                
                <div className="flex justify-center mb-6 relative z-10">
                  {item.order_num === 1 && <Trophy className="w-12 h-12 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />}
                  {item.order_num === 2 && <Medal className="w-12 h-12 text-gray-300 drop-shadow-[0_0_15px_rgba(209,213,219,0.5)]" />}
                  {item.order_num === 3 && <Medal className="w-12 h-12 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />}
                  {(item.order_num === 0 || item.order_num === null) && <Star className="w-12 h-12 text-[#d7bf7b] drop-shadow-[0_0_15px_rgba(215,191,123,0.5)]" />}
                </div>

                <div className="text-4xl md:text-5xl font-black text-white mb-3 relative z-10">{item.count}</div>
                <div className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed relative z-10">{item.title}</div>
              </motion.div>`
);

fs.writeFileSync('src/components/home/Achievements.tsx', content);
