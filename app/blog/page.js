import { getAllPosts, formatDateShort } from '@/lib/posts';
import BlogClient from './BlogClient';

export const metadata = {
  title:       'Blog — Elliot Singer',
  description: 'Write-ups, incident reports, and homelab adventures.',
};

export default function BlogPage() {
  const raw   = getAllPosts();
  const posts = raw.map(p => ({ ...p, date: formatDateShort(p.date) }));
  return <BlogClient posts={posts} />;
}
