#!/bin/bash
sed -i '' '/{false && <div className="hidden">/,/<\/div>/d' src/components/Navbar.tsx
