import Link from 'next/link';

const NAV_LINKS = [
  { href: '/',        label: './home'    },
  { href: '/blog',    label: './blog'    },
  { href: '/homelab', label: './homelab' },
];

export default function Nav() {
  return (
    <nav
      style={{ borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)', position: 'relative', zIndex: 10 }}
      className="flex items-center justify-between px-10 py-5"
    >
      <span style={{ color: 'var(--muted)', fontSize: '13px', letterSpacing: '0.05em' }}>
        singer.systems
      </span>

      <ul className="flex list-none">
        {NAV_LINKS.map(({ href, label }, i) => (
          <li key={href}>
            <Link href={href} className="nav-link" style={{
              color: 'var(--muted)', fontSize: '12px', letterSpacing: '0.04em',
              padding: '4px 16px',
              borderRight: '1px solid var(--border)',
              borderLeft: i === 0 ? '1px solid var(--border)' : undefined,
              transition: 'color 0.15s', display: 'block', textDecoration: 'none',
            }}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2" style={{ color: 'var(--green)', fontSize: '12px' }}>
        <span className="pulse-dot block rounded-full"
          style={{ width: '6px', height: '6px', background: 'var(--green)' }} />
        all systems operational
      </div>
    </nav>
  );
}
