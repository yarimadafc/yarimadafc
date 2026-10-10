'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLang, type Lang } from '@/lib/i18n';
import { dictionary } from '@/lib/dictionary';

// Translates static Azerbaijani UI text anywhere in the page (also text inside pages that do not call t()).
// Only changes the `nodeValue` of existing text nodes, so React keeps working normally.

type Rec = { orig: string; shown: string };
const textRecs = new WeakMap<Text, Rec>();
const attrRecs = new WeakMap<Element, Record<string, Rec>>();
const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'CODE', 'IFRAME']);

// ---- remote translation of database content (news titles, descriptions...) ----
const memo = new Map<string, string>(); // `${lang}\0${text}` -> translation ('' = failed)
const waiting = new Map<string, Set<Text>>();
let timer: ReturnType<typeof setTimeout> | null = null;
let currentLang: Lang = 'az';
const stored = new Map<string, string>(); // admin content translated on save: `${lang}\0${source}`
const storedLoaded = new Set<string>();

async function loadStored(lang: Lang): Promise<boolean> {
  if (lang === 'az' || storedLoaded.has(lang)) return false;
  storedLoaded.add(lang);
  try {
    const res = await fetch(`/api/translate-public?lang=${lang}`);
    if (!res.ok) return false;
    const json = await res.json();
    Object.entries(json.translations || {}).forEach(([k, v]) => stored.set(`${lang}\0${k}`, v as string));
    return true;
  } catch { return false; }
}
const STORE_KEY = 'trcache.v1';

try {
  if (typeof window !== 'undefined') {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    Object.entries(saved).forEach(([k, v]) => memo.set(k, v as string));
  }
} catch { /* ignore */ }

function persist() {
  try {
    const entries = [...memo.entries()].filter(([, v]) => v).slice(-300);
    localStorage.setItem(STORE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch { /* ignore */ }
}

// Only longer sentences go to the translation service, so names and short labels are never "translated".
function worthTranslating(text: string): boolean {
  const t = text.trim();
  if (t.length < 24 || t.split(/\s+/).length < 4) return false;
  if (/^[\d\s.,:;\-–/+()%]+$/.test(t) || /https?:|@\w+\.\w+/.test(t)) return false;
  return true;
}

function flush() {
  timer = null;
  const batch = [...waiting.entries()].slice(0, 25);
  if (!batch.length) return;
  const byLang = new Map<string, string[]>();
  batch.forEach(([k]) => { const [l, text] = k.split('\0'); byLang.set(l, [...(byLang.get(l) || []), text]); });
  Promise.all([...byLang].map(async ([l, texts]) => {
    try {
      const res = await fetch('/api/translate-public', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texts, to: l }) });
      const json = res.ok ? await res.json() : { translations: {} };
      texts.forEach(text => memo.set(`${l}\0${text}`, json.translations?.[text] || ''));
    } catch {
      texts.forEach(text => memo.set(`${l}\0${text}`, ''));
    }
  })).then(() => {
    persist();
    batch.forEach(([k, nodes]) => { waiting.delete(k); nodes.forEach(n => { if (n.isConnected) processText(n, currentLang); }); });
    if (waiting.size && !timer) timer = setTimeout(flush, 50);
  });
}

function schedule(text: string, node: Text, lang: Lang) {
  const key = `${lang}\0${text.trim()}`;
  if (memo.has(key)) return;
  const set = waiting.get(key) || new Set<Text>();
  set.add(node);
  waiting.set(key, set);
  if (!timer) timer = setTimeout(flush, 150);
}

function translate(value: string, lang: Lang, node?: Text): string | null {
  const key = value.trim();
  if (!key) return null;
  const hit = dictionary[key]?.[lang as 'en' | 'ru'];
  if (hit) return value.replace(key, hit);
  const saved = stored.get(`${lang}\0${key}`);
  if (saved) return value.replace(key, saved);
  if (lang === 'az' || !worthTranslating(key)) return null;
  const remote = memo.get(`${lang}\0${key}`);
  if (remote) return value.replace(key, remote);
  if (remote === undefined && node) schedule(key, node, lang);
  return null;
}

function processText(node: Text, lang: Lang) {
  const parent = node.parentElement;
  if (!parent || SKIP.has(parent.tagName) || parent.closest('[data-no-translate]')) return;
  const cur = node.nodeValue ?? '';
  const rec = textRecs.get(node);
  const orig = rec && cur === rec.shown ? rec.orig : cur; // our own change vs. a fresh value written by React
  const target = lang === 'az' ? orig : translate(orig, lang, node) ?? orig;
  if (target !== cur) node.nodeValue = target;
  if (target !== orig) textRecs.set(node, { orig, shown: target });
  else textRecs.delete(node);
}

function processAttrs(el: Element, lang: Lang) {
  for (const attr of ATTRS) {
    const cur = el.getAttribute(attr);
    if (cur == null) continue;
    const recs = attrRecs.get(el) || {};
    const rec = recs[attr];
    const orig = rec && cur === rec.shown ? rec.orig : cur;
    const target = lang === 'az' ? orig : translate(orig, lang) ?? orig;
    if (target !== cur) el.setAttribute(attr, target);
    if (target !== orig) { recs[attr] = { orig, shown: target }; attrRecs.set(el, recs); }
    else if (recs[attr]) { delete recs[attr]; }
  }
}

function walk(root: Node, lang: Lang) {
  if (root.nodeType === Node.TEXT_NODE) { processText(root as Text, lang); return; }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  if (SKIP.has(el.tagName) || el.closest('[data-no-translate]')) return;
  processAttrs(el, lang);
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n: Node | null = walker.nextNode();
  while (n) {
    if (n.nodeType === Node.TEXT_NODE) processText(n as Text, lang);
    else processAttrs(n as Element, lang);
    n = walker.nextNode();
  }
}

export default function DomTranslator() {
  const { lang } = useLang();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    currentLang = lang;
    walk(document.body, lang);
    loadStored(lang).then(changed => { if (changed && currentLang === lang) walk(document.body, lang); });
    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'characterData') processText(m.target as Text, lang);
        else if (m.type === 'attributes') processAttrs(m.target as Element, lang);
        else m.addedNodes.forEach(node => walk(node, lang));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    return () => observer.disconnect();
  }, [lang, pathname]);

  return null;
}
