'use client';

/**
 * Blog listing page — app/blog/page.js
 *
 * 'use client' here because search + tag filtering is interactive.
 * Posts are passed in from a parent Server Component wrapper — see
 * the note at the bottom of this file about the recommended pattern
 * once you have real content.
 *
 * For now, the POSTS array is hardcoded. Replace with getAllPosts()
 * from lib/posts.js once you have content/blog/*.md files set up.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';

const ALL_TAGS = ['proxmox', 'traefik', 'docker', 'networking', 'zabbix', 'devops', 'incident'];

const TAG_COLOURS = {
  proxmox:    { color: '#e8822a', bg: 'rgba(232,130,42,0.1)',   border: 'rgba(232,130,42,0.25)'  },
  traefik:    { color: '#5b9fd4', bg: 'rgba(91,159,212,0.1)',   border: 'rgba(91,159,212,0.25)'  },
  docker:     { color: '#5b9fd4', bg: 'rgba(91,159,212,0.1)',   border: 'rgba(91,159,212,0.25)'  },
  networking: { color: '#9d7fea', bg: 'rgba(157,127,234,0.1)',  border: 'rgba(157,127,234,0.25)' },
  zabbix:     { color: '#d4a84b', bg: 'rgba(212,168,75,0.1)',   border: 'rgba(212,168,75,0.25)'  },
  devops:     { color: '#3ddb72', bg: 'rgba(61,219,114,0.08)',  border: 'rgba(61,219,114,0.25)'  },
  incident:   { color: '#e05050', bg: 'rgba(224,80,80,0.1)',    border: 'rgba(224,80,80,0.25)'   },
};

// Replace with getAllPosts() from lib/posts.js once content is set up
const POSTS = [
  {
    slug:    'ceph-rebalance-2am',
    title:   'When my Ceph cluster decided 2am was a great time to rebalance',
    date:    'Mar 2026',
    tags:    ['proxmox', 'incident'],
    excerpt: 'A deep dive into what happens when Ceph decides your storage cluster needs an emergency rebalance at the worst possible time — and how I stopped the bleeding without losing data or sleep (well, much sleep).',
    readMin: 8,
    pinned:  true,
  },
  {
    slug:    'dynamic-routing-hybrid',
    title:   'Dynamic routing across on-prem and cloud: my setup explained',
    date:    'Feb 2026',
    tags:    ['traefik', 'networking'],
    excerpt: 'OSPF over WireGuard, Traefik dynamic config, and why I ended up with three VPS nodes talking to each other across two continents.',
    readMin: 12,
    pinned:  false,
  },
  {
    slug:    'zabbix-hybrid-monitoring',
    title:   'Building a unified monitoring layer for a hybrid homelab',
    date:    'Jan 2026',
    tags:    ['zabbix', 'devops'],
    excerpt: 'How I wired Zabbix across 20+ servers spanning on-prem and cloud without losing my mind — or my alerting config.',
    readMin: 6,
    pinned:  false,
  },
  {
    slug:    'github-actions-self-hosted',
    title:   'GitHub Actions + self-hosted runners: deploying to my own infra',
    date:    'Dec 2025',
    tags:    ['docker', 'devops'],
    excerpt: 'Running CI/CD pipelines that build Docker images and push them to production — all on runners hosted on my own Proxmox cluster.',
    readMin: 9,
    pinned:  false,
  },
  {
    slug:    'opnsense-ha-failover',
    title:   'OPNsense HA failover: the day my primary router silently died',
    date:    'Nov 2025',
    tags:    ['networking', 'incident'],
    excerpt: 'CARP worked. The failover happened. Nobody noticed. Here\'s how I set it up — and what I found when I investigated the corpse of OPS-01.',
    readMin: 11,
    pinned:  false,
  },
];

function TagPill({ tag, small }) {
  const c = TAG_COLOURS[tag] ?? { color: 'var(--muted-hi)', bg: 'transparent', border: 'var(--border-mid)' };
  return (
    <span style={{
      fontFamily: 'var(--mono)',
      fontSize: small ? '9px' : '10px',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: small ? '2px 7px' : '3px 9px',
      borderRadius: '3px',
      color: c.color,
      background: c.bg,
      border: `1px solid ${c.border}`,
    }}>
      {tag}
    </span>
  );
}

export default function BlogPage() {
  const [query,     setQuery]     = useState('');
  const [activeTag, setActiveTag] = useState('all');

  const pinned  = POSTS.find(p => p.pinned);
  const regular = POSTS.filter(p => !p.pinned);

  const filtered = useMemo(() => {
    return regular.filter(p => {
      const tagMatch    = activeTag === 'all' || p.tags.includes(activeTag);
      const searchMatch = !query || p.title.toLowerCase().includes(query.toLowerCase()) ||
                          p.excerpt.toLowerCase().includes(query.toLowerCase());
      return tagMatch && searchMatch;
    });
  }, [query, activeTag]);

  const totalMinutes = POSTS.reduce((acc, p) => acc + p.readMin, 0);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />

      {/* Page header */}
      <div style={{ padding: '48px 40px 36px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted-hi)', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '18px', height: '1px', background: 'var(--muted-hi)', display: 'inline-block' }} />
          write-ups &amp; incident reports
        </div>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: '32px', fontWeight: '500', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          ./blog
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-hi)', fontWeight: '300' }}>
          Things that broke, things I built, and things I probably shouldn&apos;t have done at 2am.
        </p>
      </div>

      {/* Controls */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '13px', height: '13px', opacity: 0.4, pointerEvents: 'none' }} viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
            <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="search posts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg2)',
              border: '1px solid var(--border-mid)', borderRadius: '5px',
              padding: '8px 12px 8px 34px',
              fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text)', outline: 'none',
            }}
          />
        </div>

        {/* Tag filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', ...ALL_TAGS].map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.04em',
                padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
                border: activeTag === tag
                  ? `1px solid rgba(61,219,114,0.35)`
                  : '1px solid var(--border-mid)',
                color: activeTag === tag ? 'var(--green)' : 'var(--muted)',
                background: activeTag === tag ? 'rgba(61,219,114,0.07)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main content + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px' }}>

        {/* Post list */}
        <div style={{ borderRight: '1px solid var(--border)' }}>

          {/* Featured / pinned */}
          {pinned && (activeTag === 'all' || pinned.tags.includes(activeTag)) && (
            <Link href={`/blog/${pinned.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                padding: '32px 40px',
                borderBottom: '1px solid var(--border)',
                borderLeft: '3px solid var(--green)',
                background: 'rgba(61,219,114,0.025)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(61,219,114,0.045)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(61,219,114,0.025)'; }}
              >
                <p style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '10px' }}>
                  pinned
                </p>
                <h2 style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: '500', color: 'var(--text)', lineHeight: '1.3', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                  {pinned.title}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--muted-hi)', lineHeight: '1.75', fontWeight: '300', marginBottom: '16px', maxWidth: '540px' }}>
                  {pinned.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {pinned.tags.map(t => <TagPill key={t} tag={t} />)}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>{pinned.date}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>{pinned.readMin} min read</span>
                </div>
              </div>
            </Link>
          )}

          {/* Regular posts */}
          {filtered.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div
                className="blog-row"
                style={{ padding: '22px 40px', borderBottom: '1px solid var(--border)' }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)', minWidth: '52px', paddingTop: '3px', flexShrink: 0 }}>
                    {post.date}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p className="blog-row-title" style={{ fontSize: '15px', fontWeight: '500', lineHeight: '1.4', marginBottom: '6px' }}>
                      {post.title}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--muted-hi)', lineHeight: '1.6', fontWeight: '300', marginBottom: '10px' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {post.tags.map(t => <TagPill key={t} tag={t} small />)}
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)' }}>{post.readMin} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: '48px 40px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>
              no posts match that filter.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ padding: '28px 24px' }}>
          {/* Stats */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              stats <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { val: POSTS.length,        lbl: 'posts'    },
                { val: `${totalMinutes}m`,  lbl: 'reading'  },
                { val: ALL_TAGS.length,     lbl: 'tags'     },
                { val: POSTS.filter(p => p.tags.includes('incident')).length, lbl: 'incidents' },
              ].map(({ val, lbl }) => (
                <div key={lbl} style={{ background: 'var(--bg2)', borderRadius: '5px', padding: '12px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: '500', color: 'var(--text)', lineHeight: 1, marginBottom: '4px' }}>{val}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              tags <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ALL_TAGS.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag === activeTag ? 'all' : tag)}
                  style={{
                    fontFamily: 'var(--mono)', fontSize: '10px', padding: '4px 9px', borderRadius: '3px',
                    border: '1px solid var(--border-mid)', color: 'var(--muted)',
                    background: 'transparent', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              recent <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
            </div>
            {POSTS.slice(0, 4).map((p, i) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block', paddingBottom: '10px', marginBottom: '10px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <p style={{ fontSize: '12px', color: 'var(--muted-hi)', lineHeight: '1.4', marginBottom: '3px' }}>{p.title}</p>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)' }}>{p.date} · {p.readMin} min</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>© {new Date().getFullYear()} elliot singer · singer.systems</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[{ href: '/', label: './home' }, { href: '/homelab', label: './homelab' }, { href: 'https://github.com/elsing', label: 'github' }].map(({ href, label }) => (
            <a key={label} href={href} className="footer-link" style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.15s' }}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
