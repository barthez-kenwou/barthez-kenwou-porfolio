# 📝 Blog Entity

The `Blog` entity manages articles, tutorials, and technical insights.

## Data Source

Blog posts are written in GitHub Flavored Markdown (GFM) and processed by **Velite** during build time.

## Attributes

- `slug`: URL-friendly identifier generated from the filename.
- `title`: Article title.
- `excerpt`: Brief summary for previews.
- `date`: Publication date.
- `content`: Markdown/Mdx content.
- `tags`: Categories (e.g., "AWS", "React", "DevOps").
- `readingTime`: Automatically calculated estimation.

## Rendering Engine

- **Markdown Parser**: `react-markdown`.
- **Syntax Highlighting**: `shiki` with `rolldown-vite` optimizations.
- **GFM Support**: `remark-gfm`.

## Folders

- Content: `content/blog/`
- Entity Logic: `src/entities/Article/`
