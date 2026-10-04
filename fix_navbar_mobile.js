const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Find the QEYDIYYAT block
const qeydiyyatMatch = code.indexOf('QEYDİYYAT\n              </a>');
if (qeydiyyatMatch !== -1) {
  // Find the closing </nav> after it
  const navEnd = code.indexOf('</nav>', qeydiyyatMatch);
  
  // Cut out everything between QEYDIYYAT block end and </nav>
  code = code.slice(0, qeydiyyatMatch + 29) + '\n            </nav>';
  
  // Also clean out whatever is left between that </nav> and </motion.div> since it used to have another block of socials
  const nextDivEnd = code.indexOf('</motion.div>', navEnd);
  
  // Wait, let's just do a clean regex replacement
}
