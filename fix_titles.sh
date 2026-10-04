#!/bin/bash
# For "MEYDANDA OYUNLAR" / "QARŞIDAKİ QARŞILAŞMA"
sed -i '' 's/<div>\n              <p className="font-mono text-sm uppercase tracking-\[0.2em\] text-\[#0a1628\]\/60 mb-2 font-bold">MEYDANDA OYUNLAR<\/p>/<div className="text-center md:text-left w-full md:w-auto">\n              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]\/60 mb-2 font-bold">MEYDANDA OYUNLAR<\/p>/g' src/app/page.tsx

# For "STATİSTİKA" / "TURNİR CƏDVƏLİ"
sed -i '' 's/<div>\n              <p className="font-mono text-sm uppercase tracking-\[0.2em\] text-\[#0a1628\]\/60 mb-2 font-bold">STATİSTİKA<\/p>/<div className="text-center md:text-left w-full md:w-auto">\n              <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#0a1628]\/60 mb-2 font-bold">STATİSTİKA<\/p>/g' src/app/page.tsx
