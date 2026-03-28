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
    <section className="w-full max-w-[1440px] mx-auto">



      <div className="grid grid-cols-1 xl:grid-cols-2 items-start gap-4 xl:gap-14 px-6 xl:px-10 pt-10 xl:pt-16 relative">

        {/* ── Left ──────────────────────────────────────── */}
        <div className="relative z-10 min-w-0 pb-2 xl:pb-18 flex flex-col items-center text-center xl:items-start xl:text-left">

          <div className="flex items-center gap-3 font-mono text-[13px] text-site-muted-hi tracking-[0.1em] mb-7 justify-center xl:justify-start">
            <span className="hidden xl:inline-block w-5 h-px bg-site-muted-hi" />
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

          <div className="flex flex-wrap gap-2 mb-2.5 justify-center xl:justify-start">
            {PRO_BADGES.map(({ label, style }) => (
              <Badge key={label} label={label} variant={style} />
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center xl:justify-start">
            {PERSONALITY_BADGES.map(({ label, icon }) =>
              icon ? <MotoBadge key={label} /> : <Badge key={label} label={label} />
            )}
          </div>

          <p className="text-[18px] text-site-muted-hi leading-[1.85] font-light max-w-[500px] mx-auto xl:mx-0 mb-9">
            Building and breaking things since before it was my job title.
            I run a{' '}
            <em className="text-site-text not-italic">highly-available private hybrid cloud</em>
            {' '}spanning 3 countries and 20+ servers.
            Here I write about the things I have done, and other thoughts.
          </p>

          <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3">
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
        <div className="relative z-10 min-w-0 pt-0 pb-10 xl:py-16">
          <TerminalCard />
        </div>

      </div>
    </section>
  );
}
