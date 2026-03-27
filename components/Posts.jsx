import Link            from 'next/link';
import { getAllPosts, formatDateShort } from '@/lib/posts';

/**
 * Server component — reads live from content/blog/*.md
 * No hardcoded array. Add a .md file and it appears here automatically.
 * Shows the 3 highest-priority / most recent posts.
 */
export default function Posts() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div style={{ padding: '40px 40px 48px' }}>
      <div className="flex items-center gap-2" style={{
        fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '28px',
      }}>
        latest posts
        <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
      </div>

      <div className="flex flex-col">
        {posts.map(({ slug, tag, tags, title, date, readMin }, i) => (
          <Link key={slug} href={`/blog/${slug}`} className="post-link" style={{
            paddingTop:    i === 0 ? '0' : '16px',
            paddingBottom: '16px',
            borderBottom:  i < posts.length - 1 ? '1px solid var(--border-soft)' : 'none',
          }}>
            {/* Date column */}
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
              minWidth: '56px', paddingTop: '2px', lineHeight: '1.4', flexShrink: 0,
            }}>
              {formatDateShort(date)}
            </span>

            <div style={{ flex: 1 }}>
              {/* First tag as label */}
              <p style={{
                fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '5px',
              }}>
                {(tags ?? [])[0] ?? ''}
              </p>
              <p className="post-link-title">{title}</p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
                {readMin} min read
              </p>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>
            no posts yet — drop a .md file in content/blog/
          </p>
        )}
      </div>
    </div>
  );
}
