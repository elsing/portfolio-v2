import Link from 'next/link';
import { getAllPosts, formatDateShort } from '@/lib/posts';

export default function Posts() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="p-10 pb-12">
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-site-muted mb-7">
        latest posts
        <span className="flex-1 h-px bg-white/[0.07]" />
      </div>

      <div className="flex flex-col">
        {posts.map(({ slug, tags, title, date, readMin }, i) => (
          <Link
            key={slug}
            href={`/blog/${slug}`}
            className="group flex gap-4 items-start no-underline transition-transform duration-[180ms] hover:translate-x-1"
            style={{
              paddingTop:    i === 0 ? '0' : '16px',
              paddingBottom: '16px',
              borderBottom:  i < posts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <span className="font-mono text-[11px] text-site-muted min-w-[56px] pt-0.5 leading-snug shrink-0">
              {formatDateShort(date)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] tracking-[0.07em] uppercase text-site-amber mb-1.5">
                {(tags ?? [])[0] ?? ''}
              </p>
              <p className="text-[14px] leading-snug mb-1 text-site-muted-hi transition-colors duration-[180ms] group-hover:text-site-text">
                {title}
              </p>
              <p className="font-mono text-[10px] text-site-muted">{readMin} min read</p>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="font-mono text-xs text-site-muted">
            no posts yet — drop a .md file in content/blog/
          </p>
        )}
      </div>
    </div>
  );
}
