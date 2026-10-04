#!/bin/bash
sed -i '' 's/onClick={() => setLang(l)}/onClick={() => { setLang(l); document.cookie = `NEXT_LOCALE=${l}; path=\/`; router.refresh(); }}/g' src/components/Navbar.tsx
