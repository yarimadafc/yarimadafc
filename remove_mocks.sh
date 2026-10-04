#!/bin/bash

# Remove mock blocks from specific files
sed -i '' '/Mock data if not found/,/^  }$/c\
  // Mock data removed\
' src/app/futbolcular/[id]/page.tsx

sed -i '' '/Mock data if no team found/,/^  }$/c\
  // Mock data removed\
' src/app/komandalar/[id]/page.tsx

sed -i '' '/Mock data if empty/,/^  }$/c\
  // Mock data removed\
' src/app/media/page.tsx

sed -i '' '/Mock data if not found/,/^  }$/c\
  // Mock data removed\
' src/app/mesqciler/[id]/page.tsx

sed -i '' '/Mock data if empty/,/^  }$/c\
  // Mock data removed\
' src/app/oyunlar/page.tsx

sed -i '' '/Mock data if empty/,/^  }$/c\
  // Mock data removed\
' src/app/turnir-cedveli/page.tsx

sed -i '' '/Mock data if not found/,/^  }$/c\
  // Mock data removed\
' src/app/xeberler/[slug]/page.tsx

sed -i '' '/Mock data if empty/,/^  }$/c\
  // Mock data removed\
' src/app/xeberler/page.tsx

