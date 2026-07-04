'use client';

import { useEffect } from 'react';

/**
 * Fires a single Umami "blog-read" event when the visitor has plausibly
 * read the post: scroll depth past 75% OR 30s dwell time, whichever first.
 * Scroll positions never leave the browser — only the one event is sent.
 * No-ops silently if Umami's script isn't loaded (analytics disabled).
 */
export default function BlogReadTracker({ slug }) {
  useEffect(() => {
    let fired = false;

    function fire() {
      if (fired) return;
      fired = true;
      try {
        window.umami?.track('blog-read', { slug });
      } catch {}
      window.removeEventListener('scroll', onScroll);
    }

    function onScroll() {
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth > 0.75) fire();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    const dwellTimer = setTimeout(fire, 30000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(dwellTimer);
    };
  }, [slug]);

  return null;
}
