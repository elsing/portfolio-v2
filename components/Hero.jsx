import Link from 'next/link';

// Professional badges
const PRO_BADGES = [
  { label: '2nd line engineer',        style: 'green' },
  { label: 'junior devops ↗ incoming', style: 'amber' },
];

// Personality badges — light, fun, fills the row naturally
const PERSONALITY_BADGES = [
  { label: 'motorbiker', icon: true  },
  { label: 'air-breather'            },
  { label: 'global retriever energy' },
  { label: 'night owl'               },
];

const STYLES = {
  green: { color: 'var(--green)', borderColor: 'rgba(61,219,114,0.28)',  bg: 'rgba(61,219,114,0.06)'  },
  amber: { color: 'var(--amber)', borderColor: 'rgba(212,168,75,0.25)', bg: 'rgba(212,168,75,0.05)'  },
  dim:   { color: 'var(--muted-hi)', borderColor: 'var(--border-mid)',  bg: 'transparent'             },
};

const GHOST_LINKS = [
  { href: '/blog',                                label: './blog'    },
  { href: 'https://github.com/elsing',            label: 'github',   external: true },
  { href: 'https://linkedin.com/in/elliotsinger', label: 'linkedin', external: true },
];

const BADGE_BASE = {
  fontFamily:    'var(--mono)',
  fontSize:      '12px',
  letterSpacing: '0.04em',
  padding:       '5px 12px',
  borderRadius:  '4px',
  border:        '1px solid',
  display:       'inline-flex',
  alignItems:    'center',
  gap:           '6px',
};

function MotoBadge() {
  return (
    <span style={{ ...BADGE_BASE, borderColor: 'var(--border-mid)', color: 'var(--muted-hi)' }}>
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
     * Width is intentionally uncapped on the right — the section expands
     * to fill the viewport with padding rather than a hard maxWidth cutoff.
     * The bio text has its own maxWidth so it doesn't become a wall of text.
     */
    <section className="relative" style={{ zIndex: 2, padding: '68px 6vw 0 40px' }}>

      {/* Eyebrow */}
      <div className="flex items-center gap-3" style={{
        fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted-hi)',
        letterSpacing: '0.1em', marginBottom: '28px',
      }}>
        <span style={{ width: '20px', height: '1px', background: 'var(--muted-hi)', display: 'inline-block' }} />
        it engineer &amp; self-hoster
      </div>

      {/* Name */}
      <h1 style={{
        fontFamily:    'var(--mono)',
        fontSize:      '72px',
        fontWeight:    '500',
        color:         '#fff',
        letterSpacing: '-0.025em',
        lineHeight:    '1.05',
        marginBottom:  '28px',
      }}>
        Elliot Singer
        <span className="cursor-blink inline-block" style={{
          width: '4px', height: '66px', background: 'var(--green)',
          marginLeft: '5px', verticalAlign: 'bottom',
        }} />
      </h1>

      {/* Pro badges row */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: '10px' }}>
        {PRO_BADGES.map(({ label, style }) => (
          <span key={label} style={{
            ...BADGE_BASE,
            color:       STYLES[style].color,
            borderColor: STYLES[style].borderColor,
            background:  STYLES[style].bg,
          }}>
            {label}
          </span>
        ))}
      </div>

      {/* Personality badges row */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: '32px' }}>
        {PERSONALITY_BADGES.map(({ label, icon }) =>
          icon ? (
            <MotoBadge key={label} />
          ) : (
            <span key={label} style={{
              ...BADGE_BASE,
              color:       'var(--muted-hi)',
              borderColor: 'var(--border-mid)',
              background:  'transparent',
            }}>
              {label}
            </span>
          )
        )}
      </div>

      {/* Bio — wider, larger text */}
      <p style={{
        fontSize:     '17px',
        color:        'var(--muted-hi)',
        lineHeight:   '1.85',
        maxWidth:     '660px',
        marginBottom: '40px',
        fontWeight:   '300',
      }}>
        Building and breaking things since before it was a job title.
        I run a{' '}
        <em style={{ color: 'var(--text)', fontStyle: 'normal' }}>private cloud at home</em>
        {' '}— 3 Proxmox nodes, 3 VPS, 20+ servers, hyper-converged and highly available.
        Here I write about the things that{' '}
        <em style={{ color: 'var(--text)', fontStyle: 'normal' }}>broke at 2am</em>
        , and how I fixed them.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: '80px' }}>
        <Link href="/homelab" style={{
          fontFamily: 'var(--mono)', fontSize: '13px', padding: '11px 24px',
          background: 'var(--green)', color: '#111',
          border: '1px solid transparent', borderRadius: '5px',
          fontWeight: '500', letterSpacing: '0.04em',
          textDecoration: 'none', transition: 'opacity 0.15s', display: 'inline-block',
        }}>
          ./homelab →
        </Link>

        {GHOST_LINKS.map(({ href, label, external }) => (
          <Link key={label} href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="btn-ghost"
            style={{
              fontFamily: 'var(--mono)', fontSize: '13px', padding: '10px 20px',
              background: 'transparent', color: 'var(--muted-hi)',
              border: '1px solid var(--border-mid)', borderRadius: '5px',
              letterSpacing: '0.04em', textDecoration: 'none',
              transition: 'color 0.15s, border-color 0.15s', display: 'inline-block',
            }}>
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
