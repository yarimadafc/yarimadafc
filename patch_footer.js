const fs = require('fs');

let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const toReplace = `<div className="flex flex-col">
                 <span className="text-[#d7bf7b] font-black text-2xl md:text-3xl tracking-tighter uppercase">
                   Yarımada
                 </span>
                 <span className="text-white text-[10px] md:text-xs tracking-[0.3em] font-light mt-1 uppercase">
                   Futbol Klubu
                 </span>
               </div>`;

content = content.replace(toReplace, "");

fs.writeFileSync('src/components/Footer.tsx', content, 'utf8');
