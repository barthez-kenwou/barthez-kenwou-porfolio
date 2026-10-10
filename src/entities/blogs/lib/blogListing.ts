import type { IBlog } from '../model/blog.type';

/** Newest published first (arrival / publication order). */
export function sortBlogsByArrival(posts: IBlog[]): IBlog[] {
  return posts
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function filterPublicBlogs(
  posts: IBlog[],
  opts: { category?: string; search?: string; language?: string },
): IBlog[] {
  const category = opts.category && opts.category !== 'All' ? opts.category : undefined;
  const q = opts.search?.trim().toLowerCase() ?? '';
  const fr = !opts.language || opts.language.startsWith('fr');

  return posts.filter((post) => {
    if (post.isPublished === false) return false;
    if (category && post.category !== category) return false;
    if (!q) return true;
    const title = fr ? post.titleFr : post.titleEn;
    return (
      title.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}

/**
 * Hero slot: admin pin if set, otherwise the most-read post.
 * Ties break toward the more recent article.
 */
export function pickMostReadBlog(posts: IBlog[]): IBlog | null {
  if (posts.length === 0) return null;

  const pinned = posts.find((p) => p.isFeatured);
  if (pinned) return pinned;

  return posts.reduce((best, post) => {
    const views = post.viewCount ?? 0;
    const bestViews = best.viewCount ?? 0;
    if (views > bestViews) return post;
    if (views === bestViews) {
      return new Date(post.date).getTime() > new Date(best.date).getTime() ? post : best;
    }
    return best;
  });
}

/** Stable mock views when the API/mocks omit `viewCount`. */
export function withMockViewCount(post: IBlog): IBlog {
  if (typeof post.viewCount === 'number') return post;
  const n = Number(post.id);
  const seed = Number.isFinite(n)
    ? n
    : [...String(post.id)].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return { ...post, viewCount: 350 + ((seed * 997) % 9200) };
}
