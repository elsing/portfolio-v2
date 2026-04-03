import fs     from 'fs';
import path   from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

// Frontmatter: title, date (YYYY-MM-DD), author, tags[], excerpt, priority (1 = pinned)

function computeReadTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function resolvePost(slug) {
  // Subfolder with index.md takes priority
  const subfolderPath = path.join(CONTENT_DIR, slug, 'index.md');
  if (fs.existsSync(subfolderPath)) return subfolderPath;

  // Flat .md file
  const flatPath = path.join(CONTENT_DIR, `${slug}.md`);
  if (fs.existsSync(flatPath)) return flatPath;

  return null;
}

export function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  const posts = entries.flatMap(entry => {
    let slug, filepath;

    if (entry.isDirectory()) {
      // Subfolder — look for index.md inside
      const candidate = path.join(CONTENT_DIR, entry.name, 'index.md');
      if (!fs.existsSync(candidate)) return [];
      slug     = entry.name;
      filepath = candidate;
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      slug     = entry.name.replace(/\.md$/, '');
      filepath = path.join(CONTENT_DIR, entry.name);
    } else {
      return [];
    }

    const raw               = fs.readFileSync(filepath, 'utf8');
    const { data, content } = matter(raw);

    return [{
      slug,
      title:    data.title    ?? slug,
      date:     data.date     ?? '',
      author:   data.author   ?? 'Elliot Singer',
      tags:     data.tags     ?? [],
      excerpt:  data.excerpt  ?? '',
      priority: data.priority ?? null,
      readMin:  computeReadTime(content),
    }];
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
  const filepath = resolvePost(slug);
  if (!filepath) return null;

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