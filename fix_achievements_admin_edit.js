const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/AchievementsAdmin.tsx', 'utf-8');

content = content.replace(
  /<button onClick=\{.*?handleDelete\(a\.id\).*?>[\s\S]*?<\/button>/,
  `<div className="mt-4 flex space-x-4 w-full justify-center">
                <button onClick={() => handleEdit(a)} className="text-blue-400 text-xs font-bold uppercase flex items-center justify-center hover:text-blue-300">
                  Düzəliş
                </button>
                <button onClick={() => handleDelete(a.id)} className="text-red-500 text-xs font-bold uppercase flex items-center justify-center space-x-1 hover:text-red-400">
                  <Trash2 className="w-3 h-3" /> <span>Sil</span>
                </button>
              </div>`
);

fs.writeFileSync('src/app/admin/components/AchievementsAdmin.tsx', content);
