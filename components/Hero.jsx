'use client';

import Link            from 'next/link';
import TerminalCard    from '@/components/TerminalCard';
import { useTerminal } from '@/components/TerminalContext';

const BADGES = [
  { label: 'devops / infra engineer',  icon: 'server',   colour: '#3ddb72' },
  { label: 'linux lover',              icon: 'terminal', colour: '#38bdf8' },
  { label: 'proxmox connoisseur',      icon: 'monitor',  colour: '#a78bfa' },
  { label: 'troubleshooter',           icon: 'wrench',   colour: '#4ade80' },
  { label: 'docker evangelist',        icon: 'package',  colour: '#5b9fd4' },
  { label: 'uptime obsessive',         icon: 'activity', colour: '#fbbf24' },
  { label: 'ceph enjoyer',             icon: 'database', colour: '#e05050' },
  { label: 'motorbiker',               icon: 'moto',     colour: '#f472b6' },
  { label: 'high energy',              icon: 'zap',      colour: '#facc15' },
];

const GHOST_LINKS = [
  { href: '/blog',                                label: './blog'    },
  { href: 'https://github.com/elsing',            label: 'github',   external: true },
  { href: 'https://linkedin.com/in/elliotsinger', label: 'linkedin', external: true },
];

function BadgeIcon({ icon, colour }) {
  if (icon === 'moto') {
    return (
      <svg width="18" height="11" viewBox="0 0 32 18" fill="none" aria-hidden="true">
        <circle cx="5.5"  cy="13.5" r="3.5" stroke={colour} strokeWidth="1.4" />
        <circle cx="26.5" cy="13.5" r="3.5" stroke={colour} strokeWidth="1.4" />
        <path d="M9 13.5 L13 7 L20 7 L24 5 L23 9 L26.5 10" stroke={colour} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 7 L12 10 L22 10 L23 9"               stroke={colour} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 7 L19 4 L22 4 L21 7"                 stroke={colour} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  const common = { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: colour, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

  switch (icon) {
    case 'terminal':
      return (
        <svg {...common}>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'server':
      return (
        <svg {...common}>
          <rect x="2" y="3" width="20" height="7" rx="1.5" />
          <rect x="2" y="14" width="20" height="7" rx="1.5" />
          <line x1="6" y1="6.5" x2="6.01" y2="6.5" />
          <line x1="6" y1="17.5" x2="6.01" y2="17.5" />
        </svg>
      );
    case 'wrench':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
        </svg>
      );
    case 'monitor':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="13" rx="1.5" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'package':
      return (
        <svg {...common}>
          <path d="M12 2L2 7v10l10 5 10-5V7z" />
          <path d="M2 7l10 5 10-5" />
          <path d="M12 22V12" />
        </svg>
      );
    case 'activity':
      return (
        <svg {...common}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case 'database':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'zap':
      return (
        <svg {...common} fill={colour} stroke="none">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    default:
      return null;
  }
}

function Badge({ label, icon, colour }) {
  const style = {
    color:       colour,
    borderColor: `${colour}40`,
    background:  `${colour}0d`,
  };
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[13px] tracking-[0.04em] px-3 py-[5px] rounded border" style={style}>
      <BadgeIcon icon={icon} colour={colour} />
      {label}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="w-full max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 items-start gap-4 xl:gap-14 px-6 xl:px-10 pt-10 xl:pt-16 relative">

        {/* ── Left ──────────────────────────────────────── */}
        <div className="relative z-10 min-w-0 pb-2 xl:pb-18 flex flex-col items-center text-center xl:items-start xl:text-left">

          <div className="flex items-center gap-3 font-mono text-[13px] text-site-muted-hi tracking-[0.1em] mb-7 justify-center xl:justify-start">
            <span className="hidden xl:inline-block w-5 h-px bg-site-muted-hi" />
            IT engineer &amp; self-hosting enthusiast
          </div>

          <h1
            className="font-mono font-medium text-white leading-[1.05] tracking-[-0.025em] mb-7"
            style={{ fontSize: 'clamp(28px, 3.4vw, 42px)' }}
          >
            Elliot Singer
            <span
              className="cursor-blink inline-block bg-site-green ml-1 align-bottom"
              style={{ width: '3px', height: 'clamp(24px, 3.2vw, 38px)' }}
            />
          </h1>

          <div className="flex flex-wrap gap-2 mb-8 justify-center xl:justify-start max-w-[560px]">
            {BADGES.map(({ label, icon, colour }) => (
              <Badge key={label} label={label} icon={icon} colour={colour} />
            ))}
          </div>

          <p className="text-[18px] text-site-muted-hi leading-[1.85] font-light max-w-[560px] mx-auto xl:mx-0 mb-9">
            Building and breaking things since before it was my job title.
            {' '}
            <em className="text-site-text not-italic">Passionate, curious, and someone who genuinely enjoys the people side as much as the technical</em>
            {' '}— I care about doing good work and working well with others.
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
