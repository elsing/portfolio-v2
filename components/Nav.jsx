import Link from 'next/link';

const NAV_LINKS = [
  { href: '/',        label: './home'    },
  { href: '/blog',    label: './blog'    },
  { href: '/homelab', label: './homelab' },
];

export default function Nav() {
  return (
    <nav className="relative z-10 flex flex-wrap items-center justify-between gap-y-2 px-5 sm:px-10 py-4 border-b border-white/[0.07] font-mono">
      <span className="hidden sm:block text-[13px] text-site-muted tracking-[0.05em]">
        singer.systems
      </span>

      <ul className="flex list-none">
        {NAV_LINKS.map(({ href, label }, i) => (
          <li key={href}>
            <Link
              href={href}
              className="block text-[12px] text-site-muted tracking-[0.04em] px-3 sm:px-4 py-1 border-r border-white/[0.07] no-underline transition-colors duration-150 hover:text-site-text"
              style={{ borderLeft: i === 0 ? '1px solid rgba(255,255,255,0.07)' : undefined }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden sm:flex items-center gap-2 text-[12px] text-site-green font-mono">
        <span className="pulse-dot block w-1.5 h-1.5 rounded-full bg-site-green" />
        all systems operational
      </div>
    </nav>
  );
}
