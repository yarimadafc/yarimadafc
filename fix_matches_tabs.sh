#!/bin/bash
sed -i '' 's/className="ks-instrument-strip is-paper mb-10"/className="flex items-center bg-gray-100 p-1.5 rounded-full mb-10 w-full max-w-sm"/g' src/components/MatchesTabs.tsx
sed -i '' 's/className="ks-instrument-key"/className={`flex-1 text-center py-2.5 px-4 rounded-full font-bold text-sm transition-colors ${activeTab === '"'next'"' ? '"'bg-white text-[var(--ks-ink)] shadow-sm'"' : '"'text-gray-500 hover:text-gray-700'"'}`}/g' src/components/MatchesTabs.tsx
