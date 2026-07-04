'use client';

import { useEffect } from 'react';

/**
 * Captures click positions for the admin heatmap. Sends a single beacon per
 * click — coordinates as fractions (resolution-independent), y measured
 * against the full document height so scrolled clicks map correctly.
 * Nothing is stored client-side; the whole handler is wrapped so a tracking
 * bug can never break the site for a visitor.
 */
export default function ClickTracker() {
  useEffect(() => {
    function onClick(e) {
      try {
        const docH = document.documentElement.scrollHeight;
        if (!window.innerWidth || !docH) return;

        const payload = JSON.stringify({
          path:      window.location.pathname,
          x:         e.clientX / window.innerWidth,
          y:         (e.clientY + window.scrollY) / docH,
          viewportW: window.innerWidth,
          viewportH: window.innerHeight,
          pageH:     docH,
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/track/click', new Blob([payload], { type: 'application/json' }));
        } else {
          fetch('/api/track/click', {
            method:    'POST',
            headers:   { 'Content-Type': 'application/json' },
            body:      payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    }

    document.addEventListener('click', onClick, { passive: true });
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
