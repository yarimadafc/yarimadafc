#!/bin/bash
sed -i '' 's/flex items-center justify-between w-full/grid grid-cols-3 items-center w-full/g' src/components/Navbar.tsx
sed -i '' 's/className="flex items-center justify-center gap-3 shrink min-w-0 group absolute left-1\/2 -translate-x-1\/2 xl:static xl:translate-x-0"/className="flex items-center justify-center gap-3 min-w-0 group col-start-2 justify-self-center"/g' src/components/Navbar.tsx
sed -i '' 's/className="flex items-center gap-2 md:gap-5 shrink-0"/className="flex items-center justify-end gap-2 md:gap-5 col-start-3"/g' src/components/Navbar.tsx
