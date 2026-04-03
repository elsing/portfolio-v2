import { getAllPosts } from '@/lib/posts';

const BASE_URL = 'https://singer.systems';

export default function sitemap() {
  const posts = getAllPosts();

  const blogRoutes = posts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    { url: BASE_URL,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/blog`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/homelab`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...blogRoutes,
  ];
}
