#!/bin/bash
sed -i '' 's/border shadow-2xl shadow-\[var(--ks-ink)\]\/5//g' src/components/MatchesTabs.tsx
sed -i '' 's/p-10/p-5 sm:p-8/g' src/components/MatchesTabs.tsx
sed -i '' 's/${isNext ? '\''border-\[var(--ks-kinpaku)\]\/30'\'' : '\''border-gray-100'\''}//g' src/components/MatchesTabs.tsx
