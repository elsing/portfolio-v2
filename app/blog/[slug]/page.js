import { notFound }      from 'next/navigation';
import { getPostBySlug, getAllPosts, formatDate } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdownToHtml';
import Nav                from '@/components/Nav';
import Link               from 'next/link';

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
    <span className="font-mono text-[11px] tracking-[0.06em] uppercase px-2.5 py-0.5 rounded-sm border"
      style={{ color: c.color, background: c.bg, borderColor: c.border }}>
      {tag}
    </span>
  );
}

function SidebarLabel({ children }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-site-muted mb-3">
      {children}
      <span className="flex-1 h-px bg-white/[0.07]" />
    </div>
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
  const all  = getAllPosts();
  const idx  = all.findIndex(p => p.slug === post.slug);
  const prev = all[idx + 1] ?? null;
  const next = all[idx - 1] ?? null;

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="max-w-[1440px] mx-auto">

        {/* Breadcrumb */}
        <div className="px-10 py-5 border-b border-white/[0.07]">
          <Link href="/blog"
            className="font-mono text-[12px] text-site-muted no-underline inline-flex items-center gap-1.5 hover:text-site-muted-hi transition-colors">
            ← ./blog
          </Link>
        </div>

        {/* Post header */}
        <div className="px-10 pt-12 pb-10 border-b border-white/[0.07] max-w-[780px]">
          <div className="flex gap-2 flex-wrap mb-5">
            {post.tags.map(t => <TagPill key={t} tag={t} />)}
            {post.priority === 1 && (
              <span className="font-mono text-[11px] text-site-green px-2.5 py-0.5 rounded-sm border border-site-green/25 bg-site-green/5">
                pinned
              </span>
            )}
          </div>

          <h1 className="font-mono text-[32px] font-medium text-white leading-[1.25] tracking-[-0.02em] mb-4">
            {post.title}
          </h1>

          <p className="text-[17px] text-site-muted-hi leading-[1.7] font-light mb-6 max-w-[620px]">
            {post.excerpt}
          </p>

          <div className="flex gap-5 items-center font-mono text-[12px] text-site-muted flex-wrap">
            <span>{formatDate(post.date)}</span>
            <span className="w-1 h-1 rounded-full bg-site-muted inline-block" />
            <span>{post.readMin} min read</span>
            <span className="w-1 h-1 rounded-full bg-site-muted inline-block" />
            <span>{post.author}</span>
          </div>
        </div>

        {/* Post body */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px]">

          <div className="px-10 py-12 pb-16 border-b lg:border-b-0 lg:border-r border-white/[0.07]">
            <div className="prose-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>

          {/* Sidebar */}
          <aside className="px-6 py-7">
            <div className="lg:sticky lg:top-6 space-y-7">

              {/* Tags */}
              <div>
                <SidebarLabel>tags</SidebarLabel>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map(t => <TagPill key={t} tag={t} />)}
                </div>
              </div>

              {/* Info */}
              <div>
                <SidebarLabel>info</SidebarLabel>
                {[
                  { lbl: 'published', val: formatDate(post.date) },
                  { lbl: 'read time', val: `${post.readMin} min` },
                ].map(({ lbl, val }) => (
                  <div key={lbl} className="flex justify-between py-1.5 border-b border-white/[0.07]">
                    <span className="font-mono text-[11px] text-site-muted">{lbl}</span>
                    <span className="font-mono text-[11px] text-site-muted-hi">{val}</span>
                  </div>
                ))}
              </div>

              {/* More posts */}
              {(prev || next) && (
                <div>
                  <SidebarLabel>more posts</SidebarLabel>
                  {[prev, next].filter(Boolean).map(p => (
                    <Link key={p.slug} href={`/blog/${p.slug}`}
                      className="block mb-3 no-underline group">
                      <p className="text-[13px] text-site-muted-hi leading-snug mb-0.5 group-hover:text-site-text transition-colors">{p.title}</p>
                      <p className="font-mono text-[10px] text-site-muted">{p.readMin} min</p>
                    </Link>
                  ))}
                  <Link href="/blog"
                    className="font-mono text-[11px] text-site-muted no-underline hover:text-site-muted-hi transition-colors mt-2 inline-block">
                    ← all posts
                  </Link>
                </div>
              )}

            </div>
          </aside>
        </div>

        {/* Prev / Next */}
        <div className="border-t border-white/[0.07] px-10 py-6 grid grid-cols-2 gap-5">
          {prev ? (
            <Link href={`/blog/${prev.slug}`} className="no-underline group">
              <p className="font-mono text-[10px] text-site-muted mb-1.5 tracking-[0.08em] uppercase">← older</p>
              <p className="text-[14px] text-site-muted-hi group-hover:text-site-text transition-colors">{prev.title}</p>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/blog/${next.slug}`} className="no-underline group text-right">
              <p className="font-mono text-[10px] text-site-muted mb-1.5 tracking-[0.08em] uppercase">newer →</p>
              <p className="text-[14px] text-site-muted-hi group-hover:text-site-text transition-colors">{next.title}</p>
            </Link>
          ) : <div />}
        </div>

        {/* Footer */}
        <footer className="border-t border-white/[0.07] px-10 py-4 flex justify-between items-center flex-wrap gap-3">
          <span className="font-mono text-[12px] text-site-muted">
            © {new Date().getFullYear()} elliot singer · singer.systems
          </span>
          <div className="flex gap-5">
            {[{href:'/',label:'./home'},{href:'/blog',label:'./blog'},{href:'/homelab',label:'./homelab'}].map(({href,label})=>(
              <a key={label} href={href} className="footer-link font-mono text-[12px] text-site-muted no-underline">{label}</a>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
}