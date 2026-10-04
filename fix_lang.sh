#!/bin/bash
sed -i '' 's/import { motion, AnimatePresence } from '"'framer-motion'"';/import { motion, AnimatePresence } from '"'framer-motion'"';\nimport { useRouter } from '"'next\/navigation'"';/g' src/components/LangSwitcher.tsx

sed -i '' 's/const ref = useRef<HTMLDivElement>(null);/const ref = useRef<HTMLDivElement>(null);\n  const router = useRouter();/g' src/components/LangSwitcher.tsx

sed -i '' 's/document.cookie = `NEXT_LOCALE=${l.code}; path=\/`;/document.cookie = `NEXT_LOCALE=${l.code}; path=\/`;\n                  router.refresh();/g' src/components/LangSwitcher.tsx
