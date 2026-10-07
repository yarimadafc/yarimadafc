const fs = require('fs');
let content = fs.readFileSync('src/app/coaches/page.tsx', 'utf-8');

content = content.replace(")}</Link>\n                </div>\n              </div>", ")}\n                </div>\n              </Link>");

fs.writeFileSync('src/app/coaches/page.tsx', content);
