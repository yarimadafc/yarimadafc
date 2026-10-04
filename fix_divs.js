const fs = require('fs');
let file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will remove one </div> from the block:
//             </div>
//             </div>
//             </div>
//           </FadeIn>
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/FadeIn>/,
  `</div>
            </div>
          </FadeIn>`
);

fs.writeFileSync(file, content, 'utf8');
