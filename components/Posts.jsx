import Link from 'next/link';

/**
 * Latest posts — right column of the lower grid.
 * Hover slide animation via .post-link in globals.css (no 'use client' needed).
 * Date column instead of post numbers — scales to any post count.
 */

const POSTS = [
  {
    slug:    'ceph-rebalance-2am',
    tag:     'proxmox · ha',
    title:   'When my Ceph cluster decided 2am was a great time to rebalance',
    date:    'Mar 2026',
    readMin: 8,
  },
  {
    slug:    'dynamic-routing-hybrid',
    tag:     'traefik · networking',
    title:   'Dynamic routing across on-prem and cloud: my setup explained',
    date:    'Feb 2026',
    readMin: 12,
  },
  {
    slug:    'zabbix-hybrid-monitoring',
    tag:     'zabbix · monitoring',
    title:   'Building a unified monitoring layer for a hybrid homelab',
    date:    'Jan 2026',
    readMin: 6,
  },
];

export default function Posts() {
  return (
    <div style={{ padding: '40px 40px 48px' }}>
      <div
        className="flex items-center gap-2"
        style={{
          fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '28px',
        }}
      >
        latest posts
        <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
      </div>

      <div className="flex flex-col">
        {POSTS.map(({ slug, tag, title, date, readMin }, i) => (
          <Link
            key={slug}
            href={`/blog/${slug}`}
            className="post-link"
            style={{
              paddingTop:    i === 0 ? '0' : '14px',
              paddingBottom: '14px',
              borderBottom:  i < POSTS.length - 1 ? '1px solid var(--border-soft)' : 'none',
            }}
          >
            {/* Date column */}
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)',
              minWidth: '48px', paddingTop: '2px', lineHeight: '1.4', flexShrink: 0,
            }}>
              {date}
            </span>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '4px',
              }}>
                {tag}
              </p>
              <p className="post-link-title">{title}</p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)' }}>
                {readMin} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
