const fs = require('fs');

function syncFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('supabase.from')) {
    content = content.replace(/import \{ useTranslations, useLocale \} from "next-intl";/, 'import { useTranslations, useLocale } from "next-intl";\nimport { supabase } from "@/lib/supabase";');
    
    const oldEffect = `  useEffect(() => {
    
  }, []);`;
    
    const newEffect = `
  const [settings, setSettings] = useState<any>(null);
  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);
`;
    content = content.replace(oldEffect, newEffect);
    
    // Fallbacks
    if (file.includes('Footer.tsx')) {
      content = content.replace(/"\+994 55 447 74 67"/g, "{settings?.phone || '+994 55 447 74 67'}");
      content = content.replace(/"info@yarimadafc.com"/g, "{settings?.email || 'info@yarimadafc.com'}");
      
      content = content.replace(/href="https:\/\/www.facebook.com\/profile.php\?id=61590640762611"/, 'href={settings?.facebook || "https://www.facebook.com/profile.php?id=61590640762611"}');
      content = content.replace(/href="https:\/\/www.instagram.com\/yarimadafk\/"/, 'href={settings?.instagram || "https://www.instagram.com/yarimadafk/"}');
      content = content.replace(/href="https:\/\/www.youtube.com\/@Yar%C4%B1madaFK"/, 'href={settings?.youtube || "https://www.youtube.com/@YarımadaFK"}');
      content = content.replace(/href="https:\/\/www.tiktok.com\/@yarimada.fk"/, 'href={settings?.tiktok || "https://www.tiktok.com/@yarimada.fk"}');
      
      // Add telegram to footer too since it's asked to add 5 socials
      const ytLine = `<a href={settings?.youtube || "https://www.youtube.com/@YarımadaFK"} target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all duration-300 shadow-lg" title="YouTube"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>`;
      const tgLine = `\n                <a href={settings?.telegram || "#"} target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9] transition-all duration-300 shadow-lg" title="Telegram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.304-.346-.108l-6.4 4.024-2.76-.86c-.6-.185-.61-.6.125-.89l10.736-4.136c.498-.195.938.118.775.82z"/></svg></a>`;
      content = content.replace(ytLine, ytLine + tgLine);
    }
  }

  fs.writeFileSync(file, content, 'utf8');
}

syncFile('src/components/Footer.tsx');
syncFile('src/components/Navbar.tsx');
