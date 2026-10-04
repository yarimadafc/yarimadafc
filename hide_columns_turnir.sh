#!/bin/bash
sed -i '' 's/<th className="p-6 font-bold text-center w-16" title="Vurulan Qol">VQ<\/th>/<th className="hidden sm:table-cell p-6 font-bold text-center w-16" title="Vurulan Qol">VQ<\/th>/g' src/app/turnir-cedveli/page.tsx
sed -i '' 's/<th className="p-6 font-bold text-center w-16" title="Buraxılan Qol">BQ<\/th>/<th className="hidden md:table-cell p-6 font-bold text-center w-16" title="Buraxılan Qol">BQ<\/th>/g' src/app/turnir-cedveli/page.tsx
sed -i '' 's/<th className="p-6 font-bold text-center w-16" title="Top Fərqi">+\/-<\/th>/<th className="hidden md:table-cell p-6 font-bold text-center w-16" title="Top Fərqi">+\/-<\/th>/g' src/app/turnir-cedveli/page.tsx
