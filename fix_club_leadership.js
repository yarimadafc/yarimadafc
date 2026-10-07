const fs = require('fs');
let content = fs.readFileSync('src/app/club/page.tsx', 'utf-8');

content = content.replace(
  /\{leadership\.map\(\(person, i\) => \([\s\S]*?<\/motion\.div>\s*\)\)\}/,
  `{leadershipCoaches.map((person, i) => (
            <motion.div 
              key={person.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-[#152741] rounded-2xl overflow-hidden border border-gray-800 flex flex-col items-center text-center shadow-2xl group cursor-pointer"
              onClick={() => window.location.href = \`/coaches/\${person.id}\`}
            >
              <div className="w-full h-64 bg-[#0a1423] relative overflow-hidden border-b border-gray-800">
                {person.image_url ? (
                  <img src={person.image_url} alt={person.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-700 relative z-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  </div>
                )}
              </div>
              <div className="p-8 w-full">
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-1">{person.name}</h3>
                <p className="text-[#d7bf7b] font-bold text-xs uppercase tracking-widest">{person.role || 'Məşqçi'}</p>
              </div>
            </motion.div>
          ))}`
);

fs.writeFileSync('src/app/club/page.tsx', content);
