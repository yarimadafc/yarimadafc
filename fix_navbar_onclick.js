const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

content = content.replace(
  /<Link\s*href=\{item\.href\} onClick=\{\(e\) => \{ if\(item\.href === '\/' && window\.location\.pathname === '\/'\) \{ window\.scrollTo\(\{top: 0, behavior: 'smooth'\}\) \} \} \}\s*className="block py-3\.5 font-bold text-sm tracking-widest text-white hover:text-\[#d7bf7b\] border-b border-gray-800\/50 transition-colors"\s*onClick=\{\(\) => setIsOpen\(false\)\}\s*>/g,
  `<Link
                      href={item.href}
                      className="block py-3.5 font-bold text-sm tracking-widest text-white hover:text-[#d7bf7b] border-b border-gray-800/50 transition-colors"
                      onClick={(e) => { 
                        setIsOpen(false);
                        if(item.href === '/' && window.location.pathname === '/') { 
                          window.scrollTo({top: 0, behavior: 'smooth'}); 
                        } 
                      }}
                    >`
);

fs.writeFileSync('src/components/Navbar.tsx', content);
