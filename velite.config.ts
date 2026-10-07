import { defineConfig, s } from 'velite';
import rehypeShiki from '@shikijs/rehype';

export default defineConfig({
  root: 'src/content',
  output: {
    data: '.velite',
    static: 'public/static',
    base: '/static/',
    name: '[name]-[hash].[ext]',
    clean: true,
  },
  collections: {
    blogs: {
      name: 'Blog',
      pattern: 'blogs/**/*.md',
      schema: s.object({
        id: s.string(),
        titleFr: s.string(),
        titleEn: s.string(),
        excerptFr: s.string(),
        excerptEn: s.string(),
        image: s.string(),
        category: s.string(),
        date: s.string(),
        readTime: s.string(),
        author: s.string(),
        tags: s.array(s.string()),
        // The body will be the content
        contentFr: s.markdown(), // We'll need to figure out how to handle both languages
        contentEn: s.markdown(),
      }),
    },
  },
  mdx: {
    rehypePlugins: [[rehypeShiki, { theme: 'github-dark' }]],
  },
  markdown: {
    rehypePlugins: [[rehypeShiki, { theme: 'github-dark' }]],
  },
});
