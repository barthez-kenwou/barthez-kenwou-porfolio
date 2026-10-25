/** Markdown image: `![alt](url)` or `![alt](url "title")` */
const IMAGE_MD_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'))?\)/g;
const HEADING_LINE_RE = /^(#{1,6})\s+(.+?)\s*$/;
const IMAGE_BLOCK_RE = /!\[[^\]]*]\([^)]+\)/g;

export type MarkdownImageRef = {
  alt: string;
  url: string;
  /** Full matched markdown token */
  raw: string;
  /** Character offset of the match in the source markdown */
  index: number;
};

export type PlacedMarkdownImage = MarkdownImageRef & {
  /** Normalized key of the nearest heading above the image */
  headingKey: string | null;
  /** Raw heading text (without #) */
  headingText: string | null;
  /** Heading level (1–6) of the preceding heading */
  headingLevel: number | null;
  /** 0-based index among headings of the same level in the source */
  headingOrdinal: number | null;
  /** 0–1 position in the source document */
  relativeOffset: number;
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
      index: match.index,
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

/** Strip every markdown image token (used before translation). */
export function stripAllMarkdownImages(markdown: string): string {
  return markdown
    .replace(IMAGE_BLOCK_RE, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripDiacritics(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '');
}

/**
 * Stable cross-locale heading fingerprint.
 * Prefers section numbers ("2.1") / PART N so FR↔EN titles still match.
 */
export function headingMatchKey(headingText: string): string {
  const text = stripDiacritics(headingText).trim();
  const part = text.match(/\bpart(?:ie)?\s*(\d+)\b/i);
  if (part) return `part:${part[1]}`;

  // Number at start OR standalone early in the title ("1. Foo" / "Chapter 1")
  const numberedStart = text.match(/^(\d+(?:\.\d+)*)\b/);
  if (numberedStart) return `n:${numberedStart[1]}`;

  const numberedAnywhere = text.match(/\b(\d+(?:\.\d+)*)\b/);
  if (numberedAnywhere && Number(numberedAnywhere[1].split('.')[0]) < 40) {
    return `n:${numberedAnywhere[1]}`;
  }

  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 56);
  return slug ? `t:${slug}` : 't:empty';
}

type HeadingHit = {
  key: string;
  text: string;
  level: number;
  lineStart: number;
  afterLine: number;
};

function listHeadings(markdown: string): HeadingHit[] {
  const hits: HeadingHit[] = [];
  let offset = 0;
  for (const line of markdown.split('\n')) {
    const m = HEADING_LINE_RE.exec(line);
    if (m) {
      const text = m[2].trim();
      hits.push({
        key: headingMatchKey(text),
        text,
        level: m[1].length,
        lineStart: offset,
        afterLine: offset + line.length + 1,
      });
    }
    offset += line.length + 1;
  }
  return hits;
}

function precedingHeading(markdown: string, atIndex: number): HeadingHit | null {
  const headings = listHeadings(markdown);
  let best: HeadingHit | null = null;
  for (const h of headings) {
    if (h.lineStart <= atIndex) best = h;
    else break;
  }
  return best;
}

function headingOrdinalAmongLevel(markdown: string, heading: HeadingHit): number {
  return listHeadings(markdown)
    .filter((h) => h.level === heading.level && h.lineStart <= heading.lineStart)
    .findIndex((h) => h.lineStart === heading.lineStart);
}

export function extractPlacedImages(markdown: string): PlacedMarkdownImage[] {
  const len = Math.max(markdown.length, 1);
  return extractMarkdownImages(markdown).map((img) => {
    const heading = precedingHeading(markdown, img.index);
    return {
      ...img,
      headingKey: heading?.key ?? null,
      headingText: heading?.text ?? null,
      headingLevel: heading?.level ?? null,
      headingOrdinal: heading ? headingOrdinalAmongLevel(markdown, heading) : null,
      relativeOffset: img.index / len,
    };
  });
}

function sectionEndAfter(markdown: string, heading: HeadingHit): number {
  const headings = listHeadings(markdown);
  const idx = headings.findIndex((h) => h.lineStart === heading.lineStart);
  if (idx < 0) return markdown.length;
  for (let i = idx + 1; i < headings.length; i++) {
    if (headings[i].level <= heading.level) return headings[i].lineStart;
  }
  return markdown.length;
}

function findHeadingByKey(markdown: string, key: string): HeadingHit | null {
  return listHeadings(markdown).find((h) => h.key === key) ?? null;
}

function findHeadingByOrdinal(
  markdown: string,
  level: number,
  ordinal: number,
): HeadingHit | null {
  const sameLevel = listHeadings(markdown).filter((h) => h.level === level);
  return sameLevel[ordinal] ?? null;
}

function insertBlockAt(markdown: string, at: number, block: string): string {
  const clamped = Math.max(0, Math.min(at, markdown.length));
  const before = markdown.slice(0, clamped).replace(/\s+$/, '');
  const after = markdown.slice(clamped).replace(/^\s+/, '');
  if (!before) return `${block}\n\n${after}`.replace(/\s+$/, '\n');
  if (!after) return `${before}\n\n${block}\n`;
  return `${before}\n\n${block}\n\n${after}`;
}

function insertIndexInHeadingSection(
  target: string,
  heading: HeadingHit,
  imagesAboveInSection: number,
): number {
  const end = sectionEndAfter(target, heading);
  const section = target.slice(heading.afterLine, end);
  const imagesInSection = extractMarkdownImages(section);

  if (imagesAboveInSection <= 0 || imagesInSection.length === 0) {
    return heading.afterLine;
  }
  const anchor =
    imagesInSection[Math.min(imagesAboveInSection, imagesInSection.length) - 1];
  return heading.afterLine + anchor.index + anchor.raw.length;
}

/**
 * Prefer: same section heading (number / PART / slug).
 * Else: same heading ordinal at same level (FR h2 #3 → EN h2 #3).
 * Else: relative offset in the document.
 */
function resolveInsertIndex(
  target: string,
  placement: Pick<
    PlacedMarkdownImage,
    'headingKey' | 'headingLevel' | 'headingOrdinal' | 'relativeOffset'
  >,
  imagesAboveInSection: number,
): number {
  if (placement.headingKey) {
    const heading = findHeadingByKey(target, placement.headingKey);
    if (heading) {
      return insertIndexInHeadingSection(target, heading, imagesAboveInSection);
    }
  }

  if (
    placement.headingLevel != null &&
    placement.headingOrdinal != null &&
    placement.headingOrdinal >= 0
  ) {
    const heading = findHeadingByOrdinal(
      target,
      placement.headingLevel,
      placement.headingOrdinal,
    );
    if (heading) {
      return insertIndexInHeadingSection(target, heading, imagesAboveInSection);
    }
  }

  // Prefer paragraph boundary in the *prose* (images already stripped from target
  // during sync, so offsets map to text structure).
  const approx = Math.floor(placement.relativeOffset * Math.max(target.length, 1));
  const beforeBreak = target.lastIndexOf('\n\n', approx);
  if (beforeBreak > 0) return beforeBreak + 2;
  const afterBreak = target.indexOf('\n\n', approx);
  if (afterBreak > 0) return afterBreak + 2;
  // Never dump at absolute end if there is content — place before last paragraph
  const lastBreak = target.lastIndexOf('\n\n');
  if (lastBreak > 0 && placement.relativeOffset < 0.92) return lastBreak + 2;
  return target.length;
}

/** Remove every `![…](url)` occurrence (keeps surrounding prose). */
export function removeImageByUrl(markdown: string, url: string): string {
  if (!url) return markdown;
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(
    `\\n{0,2}!\\[[^\\]]*\\]\\(${escaped}(?:\\s+(?:"[^"]*"|'[^']*'))?\\)\\n{0,2}`,
    'g',
  );
  return markdown
    .replace(re, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()
    .concat(markdown.endsWith('\n') ? '\n' : '');
}

function captionForUrl(markdown: string, url: string, fallback: string): string {
  const hit = extractMarkdownImages(markdown).find((img) => img.url === url);
  return hit?.alt?.trim() || fallback;
}

/**
 * Align images from `source` into `target` under matching sections.
 * Existing sibling captions are preserved; end-of-article dumps are relocated.
 */
export function syncMissingImagesFromSource(
  source: string,
  target: string,
): { next: string; added: number; moved: number } {
  const placed = extractPlacedImages(source);
  let next = target;
  let added = 0;
  let moved = 0;

  for (const img of placed) {
    if (!img.url) continue;

    const existed = markdownContainsImageUrl(next, img.url);
    const alt = captionForUrl(next, img.url, img.alt);
    if (existed) {
      next = removeImageByUrl(next, img.url);
      moved += 1;
    } else {
      added += 1;
    }

    const siblingsBefore = placed.filter(
      (p) =>
        p.url !== img.url &&
        p.index < img.index &&
        (p.headingKey || `__ord:${p.headingLevel}:${p.headingOrdinal}`) ===
          (img.headingKey || `__ord:${img.headingLevel}:${img.headingOrdinal}`),
    );
    const alreadyAbove = siblingsBefore.filter((p) =>
      markdownContainsImageUrl(next, p.url),
    ).length;

    const at = resolveInsertIndex(next, img, alreadyAbove);
    next = insertBlockAt(next, at, buildImageMarkdown(alt, img.url));
  }

  return { next, added, moved };
}

/**
 * Mirror one newly inserted image into the sibling locale near the same
 * heading as `sourceCursor` in the source document.
 */
export function mirrorImageIntoSibling(
  source: string,
  sourceCursor: number,
  target: string,
  image: { alt: string; url: string },
): { next: string; added: number } {
  if (!image.url || markdownContainsImageUrl(target, image.url)) {
    return { next: target, added: 0 };
  }

  const heading = precedingHeading(source, sourceCursor);
  const len = Math.max(source.length, 1);
  const placement: Pick<
    PlacedMarkdownImage,
    'headingKey' | 'headingLevel' | 'headingOrdinal' | 'relativeOffset'
  > = {
    headingKey: heading?.key ?? null,
    headingLevel: heading?.level ?? null,
    headingOrdinal: heading ? headingOrdinalAmongLevel(source, heading) : null,
    relativeOffset: sourceCursor / len,
  };

  let imagesAbove = 0;
  if (heading) {
    const targetHeading =
      findHeadingByKey(target, heading.key) ||
      findHeadingByOrdinal(target, heading.level, headingOrdinalAmongLevel(source, heading));
    if (targetHeading) {
      const end = sectionEndAfter(target, targetHeading);
      imagesAbove = extractMarkdownImages(target).filter(
        (img) => img.index >= targetHeading.afterLine && img.index < end,
      ).length;
    }
  }

  const at = resolveInsertIndex(target, placement, imagesAbove);
  return {
    next: insertBlockAt(target, at, buildImageMarkdown(image.alt, image.url)),
    added: 1,
  };
}

/**
 * Fallback: append missing images at the end (no structural placement).
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
