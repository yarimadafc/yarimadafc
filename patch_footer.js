const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const oldBlock = `<Link href="/teams" className="text-text-main font-bold text-xs md:text-sm hover:text-accent transition-colors">Komandalar</Link>
            <Link href="/academy" className="text-text-main font-bold text-xs md:text-sm hover:text-accent transition-colors">Akademiya</Link>
            <Link href="/transfers" className="text-text-main font-bold text-xs md:text-sm hover:text-accent transition-colors">Məşqçi Kursu</Link>
            <Link href="/sponsors" className="text-text-main font-bold text-xs md:text-sm hover:text-accent transition-colors">Sponsorlar</Link>`;

const newBlock = `<Link href="/teams" className="text-text-main font-bold text-xs md:text-sm hover:text-accent transition-colors">Komandalar</Link>
            <Link href="/academy" className="text-text-main font-bold text-xs md:text-sm hover:text-accent transition-colors">Akademiya</Link>
            <Link href="/courses" className="text-text-main font-bold text-xs md:text-sm hover:text-accent transition-colors">Məşqçi Kursu</Link>
            <Link href="/transfers" className="text-text-main font-bold text-xs md:text-sm hover:text-accent transition-colors">Transferlər</Link>
            <Link href="/sponsors" className="text-text-main font-bold text-xs md:text-sm hover:text-accent transition-colors">Sponsorlar</Link>`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync('src/components/Footer.tsx', content, 'utf8');
