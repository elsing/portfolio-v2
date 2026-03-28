'use client';

import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 12;
const DOT_SIZE     = 3;

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const trail     = useRef([]);
  const mouse     = useRef({ x: -999, y: -999 });
  const rafRef    = useRef(null);

  useEffect(() => {
    // Desktop only
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function onMove(e) {
      mouse.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', onMove);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add current position to trail
      trail.current.push({ ...mouse.current });
      if (trail.current.length > TRAIL_LENGTH) trail.current.shift();

      // Draw dots, fading out towards the tail
      trail.current.forEach((pt, i) => {
        const alpha = (i / TRAIL_LENGTH) * 0.5;
        const size  = DOT_SIZE * (i / TRAIL_LENGTH);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61, 219, 114, ${alpha})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
      aria-hidden="true"
    />
  );
}
