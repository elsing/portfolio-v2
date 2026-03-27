import fs   from 'fs';
import path  from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

/**
 * Returns all posts sorted by date descending.
 * Each post is read from content/blog/<slug>.md
 * Frontmatter fields expected:
 *   title, date (YYYY-MM-DD), tags (array), excerpt, pinned (bool, optional)
 */
export function getAllPosts() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

  return files
    .map(filename => {
      const slug    = filename.replace(/\.md$/, '');
      const raw     = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8');
      const { data, content } = matter(raw);

      // Estimate reading time: ~200 words per minute
      const wordCount = content.trim().split(/\s+/).length;
      const readMin   = Math.max(1, Math.round(wordCount / 200));

      return {
        slug,
        title:   data.title   ?? slug,
        date:    data.date     ?? '',
        tags:    data.tags     ?? [],
        excerpt: data.excerpt  ?? '',
        pinned:  data.pinned   ?? false,
        readMin,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Returns a single post with its raw markdown content.
 */
export function getPostBySlug(slug) {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, 'utf8');
  const { data, content } = matter(raw);

  const wordCount = content.trim().split(/\s+/).length;
  const readMin   = Math.max(1, Math.round(wordCount / 200));

  return {
    slug,
    title:   data.title   ?? slug,
    date:    data.date     ?? '',
    tags:    data.tags     ?? [],
    excerpt: data.excerpt  ?? '',
    pinned:  data.pinned   ?? false,
    readMin,
    content,
  };
}

/**
 * Formats a YYYY-MM-DD date string to "Mar 2026" style.
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}
