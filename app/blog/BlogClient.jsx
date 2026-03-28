'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import TagPill from '@/components/TagPill';
import Footer  from '@/components/Footer';

export default function BlogClient({ posts }) {
  const [query,     setQuery]     = useState('');
  const [activeTag, setActiveTag] = useState('all');

  const pinned  = posts.find(p => p.priority === 1);
  const { ALL_TAGS, TOP_TAGS } = useMemo(() => {
    const counts = {};
    posts.flatMap(p => p.tags).forEach(t => { counts[t] = (counts[t] ?? 0) + 1; });
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
    return { ALL_TAGS: sorted, TOP_TAGS: sorted.slice(0, 4) };
  }, [posts]);

  const regular = posts.filter(p => p.priority !== 1);

  const filtered = useMemo(() => regular.filter(p => {
    const tagMatch    = activeTag === 'all' || p.tags.includes(activeTag);
    const searchMatch = !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase());
    return tagMatch && searchMatch;
  }), [query, activeTag, regular]);

  const totalMin = posts.reduce((a, p) => a + p.readMin, 0);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ padding: '48px 40px 36px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted-hi)', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '18px', height: '1px', background: 'var(--muted-hi)', display: 'inline-block' }} />
            write-ups &amp; incident reports
          </div>
          <h1 style={{ fontFamily: 'var(--mono)', fontSize: '38px', fontWeight: '500', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            ./blog
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--muted-hi)', fontWeight: '300' }}>
            Things that broke, things I built, and things I probably shouldn&apos;t have done at 2am.
          </p>
        </div>

        {/* Controls */}
        <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', opacity: 0.4, pointerEvents: 'none', color: 'var(--text)' }} viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
              <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="search posts..." value={query} onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border-mid)', borderRadius: '5px', padding: '9px 12px 9px 36px', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', ...TOP_TAGS].map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={{
                fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.04em',
                padding: '5px 12px', borderRadius: '4px', cursor: 'pointer',
                border: activeTag === tag ? '1px solid rgba(61,219,114,0.35)' : '1px solid var(--border-mid)',
                color:  activeTag === tag ? 'var(--green)' : 'var(--muted)',
                background: activeTag === tag ? 'rgba(61,219,114,0.07)' : 'transparent',
                transition: 'all 0.15s',
              }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px]">
          <div style={{ borderRight: '1px solid var(--border)' }}>

            {/* Pinned */}
            {pinned && (activeTag === 'all' || pinned.tags.includes(activeTag)) && (
              <Link href={`/blog/${pinned.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)', borderLeft: '3px solid var(--green)', background: 'rgba(61,219,114,0.025)', transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(61,219,114,0.045)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(61,219,114,0.025)'; }}>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '10px' }}>
                    priority · pinned
                  </p>
                  <h2 style={{ fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: '500', color: 'var(--text)', lineHeight: '1.3', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                    {pinned.title}
                  </h2>
                  <p style={{ fontSize: '16px', color: 'var(--muted-hi)', lineHeight: '1.75', fontWeight: '300', marginBottom: '16px', maxWidth: '560px' }}>
                    {pinned.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {pinned.tags.map(t => <TagPill key={t} tag={t} />)}
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>{pinned.date}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>{pinned.readMin} min read</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Regular posts */}
            {filtered.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="blog-row" style={{ padding: '26px 40px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', minWidth: '58px', paddingTop: '3px', flexShrink: 0 }}>
                      {post.date}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p className="blog-row-title" style={{ fontSize: '17px', fontWeight: '500', lineHeight: '1.4', marginBottom: '6px' }}>
                        {post.title}
                      </p>
                      <p style={{ fontSize: '15px', color: 'var(--muted-hi)', lineHeight: '1.65', fontWeight: '300', marginBottom: '10px' }}>
                        {post.excerpt}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {post.tags.map(t => <TagPill key={t} tag={t} small />)}
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{post.readMin} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {filtered.length === 0 && !pinned && (
              <div style={{ padding: '48px 40px', fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--muted)' }}>
                no posts match that filter.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="order-first lg:order-none border-b lg:border-b-0 border-white/[0.07]" style={{ padding: '20px 24px 24px' }}>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                stats <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
              </div>
              <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
                {[
                  { val: posts.length,    lbl: 'posts'    },
                  { val: `${totalMin}m`,  lbl: 'reading'  },
                  { val: ALL_TAGS.length, lbl: 'tags'     },
                  { val: posts.filter(p => p.tags.includes('incident')).length, lbl: 'incidents' },
                ].map(({ val, lbl }) => (
                  <div key={lbl} style={{ background: 'var(--bg2)', borderRadius: '5px', padding: '12px' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: '500', color: 'var(--text)', lineHeight: 1, marginBottom: '5px' }}>{val}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                tags <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ALL_TAGS.map(tag => (
                  <button key={tag} onClick={() => setActiveTag(tag === activeTag ? 'all' : tag)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <TagPill tag={tag} small />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                recent <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
              </div>
              {posts.slice(0, 4).map((p, i) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block', paddingBottom: '10px', marginBottom: '10px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <p style={{ fontSize: '14px', color: 'var(--muted-hi)', lineHeight: '1.4', marginBottom: '3px' }}>{p.title}</p>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{p.date} · {p.readMin} min</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <Footer />

      </div>
    </div>
  );
}
