#!/bin/bash
sed -i '' 's/min-w-\[600px\]/min-w-full/g' src/app/page.tsx
sed -i '' 's/<th className="py-4 px-2 text-center font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">O<\/th>/<th className="hidden sm:table-cell py-4 px-2 text-center font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">O<\/th>/g' src/app/page.tsx
sed -i '' 's/<th className="py-4 px-2 text-center font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">Q<\/th>/<th className="hidden md:table-cell py-4 px-2 text-center font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">Q<\/th>/g' src/app/page.tsx
sed -i '' 's/<th className="py-4 px-2 text-center font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">H<\/th>/<th className="hidden md:table-cell py-4 px-2 text-center font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">H<\/th>/g' src/app/page.tsx
sed -i '' 's/<th className="py-4 px-2 text-center font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">M<\/th>/<th className="hidden md:table-cell py-4 px-2 text-center font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">M<\/th>/g' src/app/page.tsx

sed -i '' 's/<td className="py-4 px-2 text-center text-sm font-mono text-gray-500">-<\/td>/<td className="hidden md:table-cell py-4 px-2 text-center text-sm font-mono text-gray-500">-<\/td>/g' src/app/page.tsx
# Need to make sure the first one (O) is hidden sm:table-cell
