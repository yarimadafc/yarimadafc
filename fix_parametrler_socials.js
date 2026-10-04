const fs = require('fs');
let file = 'src/app/[locale]/adminpanel/parametrler/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('handleChange(\'telegram\'')) {
  const yt = `<input type="text" value={data?.youtube || ''} onChange={(e) => handleChange('youtube', e.target.value)} className="w-full p-2 border rounded" placeholder="https://youtube.com/..." />`;
  const extra = `
            <label className="block mt-4 mb-2 font-bold text-gray-700">Telegram</label>
            <input type="text" value={data?.telegram || ''} onChange={(e) => handleChange('telegram', e.target.value)} className="w-full p-2 border rounded" placeholder="https://t.me/..." />
            
            <label className="block mt-4 mb-2 font-bold text-gray-700">TikTok</label>
            <input type="text" value={data?.tiktok || ''} onChange={(e) => handleChange('tiktok', e.target.value)} className="w-full p-2 border rounded" placeholder="https://tiktok.com/..." />
  `;
  content = content.replace(yt, yt + extra);
}

fs.writeFileSync(file, content, 'utf8');
