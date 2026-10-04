'use client';

import { useEffect } from 'react';

// Copying the logic from instrument-strip.js
export default function InstrumentStripInit() {
  useEffect(() => {
    const ACTIVE = '.is-active, [aria-selected="true"], [aria-pressed="true"]';

    function place(strip: any) {
        const key = strip.querySelector(`.ks-instrument-key:is(${ACTIVE})`);
        if (!key) {
            if (strip.classList.contains('has-thumb')) strip.classList.remove('has-thumb');
            return;
        }
        const s = strip.getBoundingClientRect();
        const k = key.getBoundingClientRect();
        const styles = getComputedStyle(strip);
        const scale = s.width / parseFloat(styles.width) || 1;
        const border = parseFloat(styles.borderLeftWidth) || 0;
        const x = Math.round(((k.left - s.left) / scale - border + strip.scrollLeft) * 100) / 100;
        const w = Math.round(k.width / scale * 100) / 100;
        let thumb = strip.querySelector(':scope > .ks-thumb');
        if (!thumb) {
            thumb = document.createElement('span');
            thumb.className = 'ks-thumb';
            thumb.setAttribute('aria-hidden', 'true');
            strip.appendChild(thumb);
        }
        if (thumb.style.width !== `${w}px`) thumb.style.width = `${w}px`;
        const t = `translateX(${x}px)`;
        if (thumb.style.transform !== t) thumb.style.transform = t;
        if (!strip.classList.contains('has-thumb')) strip.classList.add('has-thumb');
    }

    function attach(strip: any) {
        if (strip.dataset.thumb) return;
        strip.dataset.thumb = '1';
        place(strip);
        const mo = new MutationObserver((records) => {
            if (records.some((r) => r.target !== strip && !(r.target as Element).classList?.contains('ks-thumb'))) place(strip);
        });
        mo.observe(strip, { subtree: true, attributes: true, attributeFilter: ['class', 'aria-selected', 'aria-pressed'], childList: true });
        if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => place(strip)).observe(strip);
    }

    function initInstrumentStrips(root = document) {
        root.querySelectorAll('.ks-instrument-strip').forEach(attach);
        const mo = new MutationObserver((records) => {
            for (const r of records) {
                for (const n of r.addedNodes) {
                    if (!(n instanceof Element)) continue;
                    if (n.matches('.ks-instrument-strip')) attach(n);
                    n.querySelectorAll?.('.ks-instrument-strip').forEach(attach);
                }
            }
        });
        mo.observe(root.body || root, { childList: true, subtree: true });
        window.addEventListener('resize', () => root.querySelectorAll('.ks-instrument-strip').forEach(place));
        if (document.fonts?.ready) document.fonts.ready.then(() => root.querySelectorAll('.ks-instrument-strip').forEach(place));
    }

    initInstrumentStrips();
  }, []);

  return null;
}
