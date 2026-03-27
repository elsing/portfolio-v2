import Nav        from '@/components/Nav';
import Hero       from '@/components/Hero';
import Experience from '@/components/Experience';
import Posts      from '@/components/Posts';

export const metadata = {
  title:       'Elliot Singer — IT Engineer & Self-Hoster',
  description: 'Portfolio and blog of Elliot Singer — 2nd line engineer, junior DevOps incoming, homelab enthusiast.',
};

export default function HomePage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* Background texture */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0,
        width: '48%', height: '100%',
        pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.028,
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
        }} />
        {[
          { size: 500, top: 40,  right: -140 },
          { size: 280, top: 150, right: 60   },
          { size: 110, top: 295, right: 215, opacity: 0.55 },
        ].map(({ size, top, right, opacity = 1 }) => (
          <div key={size} style={{
            position: 'absolute', borderRadius: '50%',
            width: `${size}px`, height: `${size}px`,
            top: `${top}px`, right: `${right}px`,
            border: '1px solid rgba(61,219,114,0.06)', opacity,
          }} />
        ))}
      </div>

      <Nav />
      <Hero />

      {/* Lower grid — 7/5 split */}
      <div style={{
        position: 'relative', zIndex: 2,
        borderTop: '1px solid var(--border)',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        <div style={{ borderRight: '1px solid var(--border)' }}>
          <Experience />
        </div>
        <Posts />
      </div>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 2,
        borderTop: '1px solid var(--border)',
        padding: '14px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
          © {new Date().getFullYear()} elliot singer · singer.systems
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { href: 'https://status.singer.systems',        label: 'status'   },
            { href: 'https://github.com/elsing',            label: 'github'   },
            { href: 'https://linkedin.com/in/elliotsinger', label: 'linkedin' },
            { href: 'mailto:elliot@singer.systems',         label: 'email'    },
          ].map(({ href, label }) => (
            <a key={label} href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="footer-link"
              style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.15s' }}>
              {label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
