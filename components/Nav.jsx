'use client';

import Link                          from 'next/link';
import { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
  { href: '/',        label: './home'    },
  { href: '/blog',    label: './blog'    },
  { href: '/homelab', label: './homelab' },
];

const STATUS_URL      = 'https://status.singer.systems';
const CLIENT_INTERVAL = 2 * 60 * 1000;

export default function Nav() {
  const [allUp,   setAllUp]   = useState(true);
  const [checked, setChecked] = useState(false);
  const timerRef = useRef(null);

  function poll() {
    fetch('/api/status')
      .then(r => r.json())
      .then(d => { setAllUp(d.allUp); setChecked(true); })
      .catch(()  => setChecked(true));
  }

  useEffect(() => {
    poll();
    timerRef.current = setInterval(poll, CLIENT_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, []);

  const dotColour  = allUp ? 'bg-site-green' : 'bg-site-amber';
  const txtColour  = allUp ? 'text-site-green' : 'text-site-amber';
  const label      = !checked ? 'checking...' : allUp ? 'all systems operational' : 'service degraded';
  const labelShort = !checked ? 'checking...' : allUp ? 'operational'             : 'degraded';

  return (
    <nav className="relative z-10 flex items-center justify-between gap-x-4 px-5 sm:px-10 py-4 border-b border-white/[0.07] font-mono">

      <span className="hidden sm:block text-[13px] text-site-muted tracking-[0.05em] shrink-0">
        singer.systems
      </span>

      <ul className="flex list-none shrink-0">
        {NAV_LINKS.map(({ href, label: lnk }, i) => (
          <li key={href}>
            <Link
              href={href}
              className={`
                block text-[12px] text-site-muted tracking-[0.04em]
                px-3 sm:px-4 py-1
                border-r border-white/[0.07]
                no-underline transition-colors duration-150 hover:text-site-text
                ${i === 0 ? 'border-l border-white/[0.07]' : ''}
              `}
            >
              {lnk}
            </Link>
          </li>
        ))}
      </ul>

      <a
        href={STATUS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 text-[12px] no-underline shrink-0 transition-opacity hover:opacity-75 ${txtColour}`}
      >
        <span className={`block w-1.5 h-1.5 rounded-full shrink-0 ${dotColour} ${allUp ? 'pulse-dot' : ''}`} />
        <span className="hidden xs:inline sm:hidden">{labelShort}</span>
        <span className="hidden sm:inline">
          {label}
          {!allUp && checked && (
            <> — <span className="underline underline-offset-2">see here</span></>
          )}
        </span>
      </a>

    </nav>
  );
}
