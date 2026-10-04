#!/bin/bash
sed -i '' 's/<section className="py-12 border-t border-\[var(--ks-ink)\]\/10 overflow-hidden bg-\[var(--ks-kinpaku)\]">/<section className="py-4 md:py-6 border-t border-\[var(--ks-ink)\]\/10 overflow-hidden bg-\[var(--ks-kinpaku)\]">/g' src/app/page.tsx
sed -i '' 's/className="text-3xl md:text-4xl font-black font-condensed tracking-widest uppercase flex items-center gap-4"/className="text-base md:text-lg font-bold tracking-widest uppercase flex items-center gap-4"/g' src/app/page.tsx
