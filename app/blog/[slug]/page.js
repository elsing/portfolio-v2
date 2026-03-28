import { notFound }       from 'next/navigation';
import { getPostBySlug, getAllPosts, formatDate } from '@/lib/posts';
import { markdownToHtml }  from '@/lib/markdownToHtml';
import Nav                 from '@/components/Nav';
import Link                from 'next/link';

const TAG_COLOURS = {
  proxmox:    { color: '#e8822a', bg: 'rgba(232,130,42,0.1)',  border: 'rgba(232,130,42,0.25)'  },
  traefik:    { color: '#5b9fd4', bg: 'rgba(91,159,212,0.1)',  border: 'rgba(91,159,212,0.25)'  },
  docker:     { color: '#5b9fd4', bg: 'rgba(91,159,212,0.1)',  border: 'rgba(91,159,212,0.25)'  },
  networking: { color: '#9d7fea', bg: 'rgba(157,127,234,0.1)', border: 'rgba(157,127,234,0.25)' },
  zabbix:     { color: '#d4a84b', bg: 'rgba(212,168,75,0.1)',  border: 'rgba(212,168,75,0.25)'  },
  devops:     { color: '#3ddb72', bg: 'rgba(61,219,114,0.08)', border: 'rgba(61,219,114,0.25)'  },
  incident:   { color: '#e05050', bg: 'rgba(224,80,80,0.1)',   border: 'rgba(224,80,80,0.25)'   },
};

function TagPill({ tag }) {
  const c = TAG_COLOURS[tag] ?? { color: 'var(--muted-hi)', bg: 'transparent', border: 'var(--border-mid)' };
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.06em',
      textTransform: 'uppercase', padding: '3px 10px', borderRadius: '3px',
      color: c.color, background: c.bg, border: `1px solid ${c.border}`,
    }}>
      {tag}
    </span>
  );
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title:       `${post.title} — singer.systems`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const contentHtml = markdownToHtml(post.content);
  const all         = getAllPosts();
  const idx         = all.findIndex(p => p.slug === post.slug);
  const prev        = all[idx + 1] ?? null;
  const next        = all[idx - 1] ?? null;

  return (
    <div style={{ minHeight: '100vh', maxWidth: '1440px', margin: '0 auto' }}>
      <Nav />

      {/* breadcrumb */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/blog" style={{
          fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)',
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
          transition: 'color 0.15s',
        }}
          className="hover:text-[var(--muted-hi)]"
        >
          ← ./blog
        </Link>
      </div>

      {/* header */}
      <div style={{ padding: '48px 40px 40px', borderBottom: '1px solid var(--border)', maxWidth: '780px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {post.tags.map(t => <TagPill key={t} tag={t} />)}
          {post.priority === 1 && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--green)', padding: '3px 10px', borderRadius: '3px', background: 'rgba(61,219,114,0.07)', border: '1px solid rgba(61,219,114,0.25)' }}>
              pinned
            </span>
          )}
        </div>

        <h1 style={{
          fontFamily: 'var(--mono)', fontSize: '32px', fontWeight: '500',
          color: '#fff', lineHeight: '1.25', letterSpacing: '-0.02em', marginBottom: '16px',
        }}>
          {post.title}
        </h1>

        <p style={{ fontSize: '17px', color: 'var(--muted-hi)', lineHeight: '1.7', fontWeight: '300', marginBottom: '24px', maxWidth: '620px' }}>
          {post.excerpt}
        </p>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>
          <span>{formatDate(post.date)}</span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--muted)', display: 'inline-block' }} />
          <span>{post.readMin} min read</span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--muted)', display: 'inline-block' }} />
          <span>{post.author}</span>
        </div>
      </div>

      {/* body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '0' }}>
        <div style={{ padding: '48px 40px 64px', borderRight: '1px solid var(--border)' }}>
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>

        <aside style={{ padding: '28px 24px' }}>
          <div style={{ position: 'sticky', top: '24px' }}>

            {/* Tags */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                tags <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {post.tags.map(t => <TagPill key={t} tag={t} />)}
              </div>
            </div>

            {/* info */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                info <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
              </div>
              {[
                { lbl: 'published', val: formatDate(post.date) },
                { lbl: 'read time', val: `${post.readMin} min` },
              ].map(({ lbl, val }) => (
                <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{lbl}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted-hi)' }}>{val}</span>
                </div>
              ))}
            </div>

            {/* More posts */}
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                more posts <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
              </div>
              {[prev, next].filter(Boolean).map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--muted-hi)', lineHeight: '1.4', marginBottom: '2px', transition: 'color 0.15s' }}
                    className="hover:text-[var(--text)]">{p.title}</p>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>{p.readMin} min</p>
                </Link>
              ))}
              <Link href="/blog" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none', display: 'inline-block', marginTop: '8px', transition: 'color 0.15s' }}
                className="hover:text-[var(--muted-hi)]">
                ← all posts
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* prev / next */}
      <div style={{
        borderTop: '1px solid var(--border)', padding: '24px 40px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
      }}>
        {prev ? (
          <Link href={`/blog/${prev.slug}`} style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>← older</p>
            <p style={{ fontSize: '14px', color: 'var(--muted-hi)', transition: 'color 0.15s' }} className="hover:text-[var(--text)]">{prev.title}</p>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/blog/${next.slug}`} style={{ textDecoration: 'none', textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>newer →</p>
            <p style={{ fontSize: '14px', color: 'var(--muted-hi)', transition: 'color 0.15s' }} className="hover:text-[var(--text)]">{next.title}</p>
          </Link>
        ) : <div />}
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>© {new Date().getFullYear()} elliot singer · singer.systems</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[{ href: '/', label: './home' }, { href: '/blog', label: './blog' }, { href: '/homelab', label: './homelab' }].map(({ href, label }) => (
            <a key={label} href={href} className="footer-link" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.15s' }}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}