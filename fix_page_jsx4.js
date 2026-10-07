const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// I will replace `</div>\n          </div>\n        </section>` with `</div>\n          </div>\n        </div>\n        </section>`
content = content.replace(
  /<\/div>\n          <\/div>\n        <\/section>/,
  '</div>\n          </div>\n          </div>\n        </section>'
);

fs.writeFileSync('src/app/page.tsx', content);
