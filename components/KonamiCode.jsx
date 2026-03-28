'use client';

import { useEffect, useState } from 'react';

const SEQUENCE = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
];

export default function KonamiCode() {
  const [active, setActive] = useState(false);
  const [pos,    setPos]    = useState(0);

  useEffect(() => {
    function onKey(e) {
      if (e.key === SEQUENCE[pos]) {
        const next = pos + 1;
        if (next === SEQUENCE.length) {
          setActive(true);
          setPos(0);
          setTimeout(() => setActive(false), 4000);
        } else {
          setPos(next);
        }
      } else {
        setPos(e.key === SEQUENCE[0] ? 1 : 0);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pos]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="bg-bg2 border border-site-green/30 rounded-lg px-10 py-8 text-center animate-[term-fadein_0.3s_ease_forwards]">
        <div className="font-mono text-site-green text-[13px] tracking-[0.12em] uppercase mb-3">
          access granted
        </div>
        <div className="font-mono text-site-muted text-[11px] leading-6">
          you found it.<br />
          there is nothing here though.<br />
          impressive dedication.
        </div>
      </div>
    </div>
  );
}
