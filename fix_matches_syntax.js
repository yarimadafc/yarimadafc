const fs = require('fs');
let file = 'src/components/MatchesTabs.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will clean it up cleanly
const oldStr = `import { useState } from 'react';
import Link from 'next/link';

import { useTranslations, useLocale } from 'next-intl';
export default function MatchesTabs({ nextMatch, lastMatch }: { nextMatch: any, lastMatch: any }) {
  const t = useTranslations();
  const lang = useLocale().toUpperCase(); nextMatch, lastMatch, lang = 'AZ' }: { nextMatch: any, lastMatch: any, lang?: 'AZ' | 'EN' | 'RU' }) {`;

const newStr = `import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function MatchesTabs({ nextMatch, lastMatch }: { nextMatch: any, lastMatch: any }) {
  const t = useTranslations();
  const lang = useLocale().toUpperCase();`;

content = content.replace(oldStr, newStr);

fs.writeFileSync(file, content, 'utf8');
