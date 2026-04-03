'use client';

import { useEffect, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
const TARGET = 'singer.systems';
const DURATION = 1200; // ms total animation
const HOLD = 200;      // ms to hold completed text before fading

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function DecryptLoader() {
  // Start empty — avoids SSR/client mismatch from Math.random()
  const [display, setDisplay]   = useState('');
  const [visible, setVisible]   = useState(true);
  const [opacity, setOpacity]   = useState(1);

  useEffect(() => {
    const total    = TARGET.length;
    const interval = DURATION / (total * 8); // iterations per character slot
    let   frame    = 0;
    const maxFrames = total * 8;

    const timer = setInterval(() => {
      frame++;

      const revealed = Math.floor((frame / maxFrames) * total);

      setDisplay(
        TARGET.split('').map((char, i) => {
          if (i < revealed) return char;
          if (char === ' ') return ' ';
          return randomChar();
        }).join('')
      );

      if (frame >= maxFrames) {
        clearInterval(timer);
        setDisplay(TARGET);

        // Hold briefly then fade out
        setTimeout(() => {
          setOpacity(0);
          setTimeout(() => setVisible(false), 400);
        }, HOLD);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9999,
        background:      '#161a18',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        transition:      'opacity 0.4s ease',
        opacity,
        pointerEvents:   opacity === 0 ? 'none' : 'auto',
      }}
    >
      <span
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      'clamp(18px, 4vw, 32px)',
          color:         '#3ddb72',
          letterSpacing: '0.08em',
          userSelect:    'none',
        }}
      >
        {display}
      </span>
    </div>
  );
}