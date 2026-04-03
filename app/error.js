'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="rounded-lg overflow-hidden bg-bg2 border border-white/[0.12]">

          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-bg3 border-b border-white/[0.07] select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-site-red" />
            <span className="w-2.5 h-2.5 rounded-full bg-site-amber" />
            <span className="w-2.5 h-2.5 rounded-full bg-site-green" />
            <span className="font-mono text-[11px] text-site-muted ml-1.5 tracking-[0.04em]">
              bash — portfolio@prod-ai-01
            </span>
          </div>

          {/* Output */}
          <div className="px-[18px] py-4 space-y-0">
            <div className="font-mono text-xs leading-7 text-site-muted-hi">
              folio-ai — singer.systems
            </div>
            <div className="font-mono text-xs leading-7 pl-4 text-site-red">
              500 — internal server error
            </div>
            <div className="h-1" />
            <div className="font-mono text-xs leading-7 pl-4 text-site-muted">
              something went wrong on this host.
            </div>
            {error?.message && (
              <div className="font-mono text-xs leading-7 pl-4 text-site-amber opacity-70">
                {error.message}
              </div>
            )}
            <div className="h-1" />
            <div className="flex gap-2 font-mono text-xs leading-7">
              <span className="text-site-green shrink-0">portfolio@prod-ai-01 ~</span>
              <span className="text-site-text">$ tail -f /var/log/syslog</span>
            </div>
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-2 px-[18px] py-2.5 pb-3.5 border-t border-white/[0.07]">
            <span className="font-mono text-xs text-site-green shrink-0">portfolio@prod-ai-01 ~</span>
            <span className="font-mono text-xs text-site-text shrink-0">$</span>
            <div className="flex gap-4">
              <button
                onClick={reset}
                className="font-mono text-xs text-site-text hover:text-white transition-colors"
              >
                retry<span className="term-blink inline-block w-1.5 h-3 bg-current align-middle ml-px opacity-70" />
              </button>
              <Link
                href="/"
                className="font-mono text-xs text-site-muted hover:text-site-muted-hi transition-colors"
              >
                or return home
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}