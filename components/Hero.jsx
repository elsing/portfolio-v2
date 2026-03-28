import Link        from 'next/link';
import TerminalCard from '@/components/TerminalCard';

const PRO_BADGES = [
  { label: '2nd line engineer',        style: 'green' },
  { label: 'junior devops ↗ incoming', style: 'amber' },
];

const PERSONALITY_BADGES = [
  { label: 'motorbiker',              icon: true },
  { label: 'golden retriever energy'             },
  { label: 'troubleshooter'                      },
];

const GHOST_LINKS = [
  { href: '/blog',                                label: './blog'    },
  { href: 'https://github.com/elsing',            label: 'github',   external: true },
  { href: 'https://linkedin.com/in/elliotsinger', label: 'linkedin', external: true },
];

const BADGE_VARIANTS = {
  green: 'text-site-green border-site-green/30 bg-site-green/5',
  amber: 'text-site-amber border-site-amber/25 bg-site-amber/5',
  dim:   'text-site-muted-hi border-white/10 bg-transparent',
};

function Badge({ label, variant = 'dim' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[13px] tracking-[0.04em] px-3 py-[5px] rounded border ${BADGE_VARIANTS[variant]}`}>
      {label}
    </span>
  );
}

function MotoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[13px] tracking-[0.04em] px-3 py-[5px] rounded border border-white/10 text-site-muted-hi">
      <svg width="18" height="11" viewBox="0 0 32 18" fill="none" aria-hidden="true">
        <circle cx="5.5"  cy="13.5" r="3.5" stroke="#7d9a88" strokeWidth="1.4" />
        <circle cx="26.5" cy="13.5" r="3.5" stroke="#7d9a88" strokeWidth="1.4" />
        <path d="M9 13.5 L13 7 L20 7 L24 5 L23 9 L26.5 10" stroke="#7d9a88" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 7 L12 10 L22 10 L23 9"               stroke="#7d9a88" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 7 L19 4 L22 4 L21 7"                 stroke="#7d9a88" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      motorbiker
    </span>
  );
}

export default function Hero() {
  return (
    /*
     * overflow-hidden on the section clips the vertical stripes
     * exactly to the hero height. They cannot bleed downward.
     */
    <section className="w-full max-w-[1440px] mx-auto overflow-hidden relative">

      {/*
        Vertical stripe texture — replaces the grid.
        Simple repeating linear-gradient of alternating transparent/subtle
        bands. Much cleaner than the grid intersection Moire effect,
        and clips cleanly to the section.
        Right half only, fades out toward the left via a mask.
      */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 h-full pointer-events-none"
        style={{
          width: '55%',
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 60px,
            rgba(255,255,255,0.018) 60px,
            rgba(255,255,255,0.018) 61px
          )`,
          maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
        }}
      />

      {/* Concentric rings — purely decorative */}
      {[
        { size: 520, top: -80,  right: -100 },
        { size: 300, top:  40,  right: 120  },
        { size: 120, top: 180,  right: 270, opacity: 0.5 },
      ].map(({ size, top, right, opacity = 1 }) => (
        <div key={size} aria-hidden="true" className="absolute rounded-full pointer-events-none"
          style={{ width: size, height: size, top, right, opacity, border: '1px solid rgba(61,219,114,0.055)' }}
        />
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-14 px-6 lg:px-10 pt-16 relative">

        {/* ── Left ──────────────────────────────────────── */}
        <div className="relative z-10 min-w-0 pb-16 lg:pb-18 flex flex-col items-center text-center lg:items-start lg:text-left">

          <div className="flex items-center gap-3 font-mono text-[13px] text-site-muted-hi tracking-[0.1em] mb-7 justify-center lg:justify-start">
            <span className="hidden lg:inline-block w-5 h-px bg-site-muted-hi" />
            it engineer &amp; self-hoster
          </div>

          <h1
            className="font-mono font-medium text-white leading-[1.05] tracking-[-0.025em] mb-7"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            Elliot Singer
            <span
              className="cursor-blink inline-block bg-site-green ml-1 align-bottom"
              style={{ width: '4px', height: 'clamp(36px, 5.5vw, 66px)' }}
            />
          </h1>

          <div className="flex flex-wrap gap-2 mb-2.5">
            {PRO_BADGES.map(({ label, style }) => (
              <Badge key={label} label={label} variant={style} />
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {PERSONALITY_BADGES.map(({ label, icon }) =>
              icon ? <MotoBadge key={label} /> : <Badge key={label} label={label} />
            )}
          </div>

          <p className="text-[18px] text-site-muted-hi leading-[1.85] font-light w-full max-w-[500px] mb-9">
            Building and breaking things since before it was a job title.
            I run a{' '}
            <em className="text-site-text not-italic">private cloud at home</em>
            {' '}— 3 Proxmox nodes, 3 VPS, 20+ servers, hyper-converged and highly available.
            Here I write about the things that{' '}
            <em className="text-site-text not-italic">broke at 2am</em>
            , and how I fixed them.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/homelab"
              className="font-mono text-[14px] font-medium tracking-[0.04em] px-6 py-[11px] rounded-[5px] bg-site-green text-bg no-underline transition-opacity hover:opacity-85"
            >
              ./homelab →
            </Link>
            {GHOST_LINKS.map(({ href, label, external }) => (
              <Link key={label} href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="btn-ghost font-mono text-[14px] tracking-[0.04em] px-5 py-[10px] rounded-[5px] border border-white/10 text-site-muted-hi no-underline transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Right: terminal ───────────────────────────── */}
        <div className="relative z-10 min-w-0 py-10 lg:py-16">
          <TerminalCard />
        </div>

      </div>
    </section>
  );
}
