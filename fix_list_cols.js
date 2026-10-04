const fs = require('fs');
const path = require('path');

const map = {
  'komandalar': ['name', 'age_group'],
  'mesqciler': ['first_name', 'last_name', 'role'],
  'futbolcular': ['first_name', 'last_name', 'position'],
  'turnir': ['name', 'season'],
  'oyunlar': ['home_team', 'away_team', 'date', 'status'],
  'sponsorlar': ['name', 'type'],
  'bannerler': ['title', 'active']
};

for (const [folder, cols] of Object.entries(map)) {
  const file = path.join('src/app/[locale]/adminpanel', folder, 'page.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace {item.name} with {item.name_az || item.name}
    // and {item.role} with {item.role_az || item.role}
    // and {item.position} with {item.position_az || item.position}
    // and {item.title} with {item.title_az || item.title}
    
    content = content.replace(/\{item\.name\}/g, '{item.name_az || item.name}');
    content = content.replace(/\{item\.role\}/g, '{item.role_az || item.role}');
    content = content.replace(/\{item\.position\}/g, '{item.position_az || item.position}');
    content = content.replace(/\{item\.title\}/g, '{item.title_az || item.title}');
    
    fs.writeFileSync(file, content, 'utf8');
  }
}
