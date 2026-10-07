const fs = require('fs');

let content = fs.readFileSync('src/app/coaches/page.tsx', 'utf8');

// Add User icon import if needed
if (!content.includes('import { User } from "lucide-react"')) {
  content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { User } from 'lucide-react';");
}

// Replace image rendering
const oldImage = `<img 
                      src={coach.image_url || '/placeholder-user.jpg'} 
                      alt={coach.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                    />`;
                    
const newImage = `{coach.image_url ? (
                      <img 
                        src={coach.image_url} 
                        alt={coach.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-deep)]">
                        <User className="w-20 h-20 text-[var(--bg-border)]" />
                      </div>
                    )}`;
content = content.replace(oldImage, newImage);

// Fix banner button
const oldButton = `<Link href="/courses" className="bg-[var(--accent)] text-[var(--bg-main)] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity text-center w-full md:w-auto">
               Kurslara Keçid
             </Link>`;
const newButton = `<Link href="/courses" className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors text-center w-full md:w-auto shadow-lg">
               Kurslara Keçid
             </Link>`;
content = content.replace(oldButton, newButton);

fs.writeFileSync('src/app/coaches/page.tsx', content, 'utf8');
