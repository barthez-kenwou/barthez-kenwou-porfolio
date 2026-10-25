/** Markdown image: `![alt](url)` or `![alt](url "title")` */
const IMAGE_MD_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'))?\)/g;

export type MarkdownImageRef = {
  alt: string;
  url: string;
  /** Full matched markdown token */
  raw: string;
};

export function extractMarkdownImages(markdown: string): MarkdownImageRef[] {
  const out: MarkdownImageRef[] = [];
  const seen = new Set<string>();
  IMAGE_MD_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = IMAGE_MD_RE.exec(markdown)) !== null) {
    const url = match[2]?.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push({
      alt: (match[1] || '').trim(),
      url,
      raw: match[0],
    });
  }
  return out;
}

export function markdownContainsImageUrl(markdown: string, url: string): boolean {
  if (!url) return false;
  return markdown.includes(`](${url})`) || markdown.includes(`](${url} `);
}

export function buildImageMarkdown(alt: string, url: string): string {
  const safeAlt = (alt || 'Image').replace(/]/g, '');
  return `![${safeAlt}](${url})`;
}

/**
 * Append image blocks whose URL is missing from `target`.
 * Keeps order of `images`. Returns `{ next, added }`.
 */
export function appendMissingImages(
  target: string,
  images: Array<{ alt: string; url: string }>,
): { next: string; added: number } {
  let next = target;
  let added = 0;
  for (const img of images) {
    if (!img.url || markdownContainsImageUrl(next, img.url)) continue;
    const block = buildImageMarkdown(img.alt, img.url);
    const needsGap = next.trim().length > 0;
    next = needsGap ? `${next.replace(/\s+$/, '')}\n\n${block}\n` : `${block}\n`;
    added += 1;
  }
  return { next, added };
}
