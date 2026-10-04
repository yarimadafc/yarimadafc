const fs = require('fs');

function cleanFile(filePath, arrayName) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  const regex = new RegExp(`\\/\\/ Fallback data\\s*if \\(${arrayName}\\.length === 0\\) \\{[\\s\\S]*?\\} else \\{([\\s\\S]*?)\\}`);
  
  content = content.replace(regex, (match, elseBody) => {
    return elseBody; // just keep the else body
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
}

cleanFile('src/app/mesqciler/page.tsx', 'coaches');
cleanFile('src/app/komandalar/page.tsx', 'teams');
cleanFile('src/app/oyunlar/page.tsx', 'matches');
cleanFile('src/app/teqvim/page.tsx', 'matches');
cleanFile('src/app/turnir-cedveli/page.tsx', 'teams');
cleanFile('src/app/xeberler/page.tsx', 'news');
cleanFile('src/app/media/page.tsx', 'videos');
cleanFile('src/app/media/page.tsx', 'photos'); // might need separate handling if it has two

console.log('Mocks cleaned');
