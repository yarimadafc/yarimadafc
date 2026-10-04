const fs = require('fs');

// Add to page.tsx of Admin Panel
let paramFile = 'src/app/[locale]/adminpanel/parametrler/page.tsx';
let paramContent = fs.readFileSync(paramFile, 'utf8');

if (!paramContent.includes('map_iframe_url')) {
  const mapInput = `
            <label className="block mt-4 mb-2 font-bold text-gray-700">Xəritə (Google Maps Embed URL)</label>
            <input type="text" value={data?.map_iframe_url || ''} onChange={(e) => handleChange('map_iframe_url', e.target.value)} className="w-full p-2 border rounded" placeholder="https://www.google.com/maps/embed?pb=..." />
  `;
  paramContent = paramContent.replace(/<label className="block mt-4 mb-2 font-bold text-gray-700">TikTok<\/label>[\s\S]*?<\/div>/, match => match + mapInput);
  fs.writeFileSync(paramFile, paramContent, 'utf8');
}

// Add to elaqe/page.tsx
let elaqeFile = 'src/app/[locale]/elaqe/page.tsx';
let elaqeContent = fs.readFileSync(elaqeFile, 'utf8');

const oldIframe = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.786520330835!2d49.73164121540113!3d40.45521417936166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403085bd9f9e5c9b%3A0x6b446a6f1d141e17!2sKristal%20Abseron%201!5e0!3m2!1sen!2s!4v1684784949282!5m2!1sen!2s" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>`;
const newIframe = `<iframe src={contact?.map_iframe_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.786520330835!2d49.73164121540113!3d40.45521417936166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403085bd9f9e5c9b%3A0x6b446a6f1d141e17!2sKristal%20Abseron%201!5e0!3m2!1sen!2s!4v1684784949282!5m2!1sen!2s"} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>`;

elaqeContent = elaqeContent.replace(oldIframe, newIframe);
fs.writeFileSync(elaqeFile, elaqeContent, 'utf8');

