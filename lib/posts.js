import fs     from 'fs';
import path   from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

// Frontmatter: title, date (YYYY-MM-DD), author, tags[], excerpt, priority (1 = pinned)

function computeReadTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

  const posts = files.map(filename => {
    const slug              = filename.replace(/\.md$/, '');
    const raw               = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8');
    const { data, content } = matter(raw);

    return {
      slug,
      title:    data.title    ?? slug,
      date:     data.date     ?? '',
      author:   data.author   ?? 'Elliot Singer',
      tags:     data.tags     ?? [],
      excerpt:  data.excerpt  ?? '',
      priority: data.priority ?? null,
      readMin:  computeReadTime(content),
    };
  });

  // priority asc, then date desc
  return posts.sort((a, b) => {
    const aPri = a.priority ?? Infinity;
    const bPri = b.priority ?? Infinity;
    if (aPri !== bPri) return aPri - bPri;
    return a.date < b.date ? 1 : -1;
  });
}

export function getPostBySlug(slug) {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw               = fs.readFileSync(filepath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title:    data.title    ?? slug,
    date:     data.date     ?? '',
    author:   data.author   ?? 'Elliot Singer',
    tags:     data.tags     ?? [],
    excerpt:  data.excerpt  ?? '',
    priority: data.priority ?? null,
    readMin:  computeReadTime(content),
    content,
  };
}

/** "2026-03-10" → "10 Mar 2026" */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "2026-03-10" → "Mar 2026" (compact, for listing rows) */
export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}