/**
 * URL slugs for blogs & projects: `{name-slug}-{4-digit-id}`
 * e.g. `/projects/combo-modular-saas-erp-0001`
 */

export function toSlug(text: string, maxLen = 80): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLen)
    .replace(/-+$/g, '');
}

export function formatId4(id: string | number): string {
  const digits = String(id).replace(/\D/g, '');
  return digits.padStart(4, '0').slice(-4);
}

export function isMongoObjectId(id: string | number): boolean {
  return typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id);
}

export function buildEntityPathSlug(
  name: string,
  id: string | number,
  existingSlug?: string,
): string {
  const base = (existingSlug?.trim() || toSlug(name)).replace(/^-+|-+$/g, '');
  return `${base}-${formatId4(id)}`;
}

/** Prefer English title as canonical slug source. */
export function getProjectPathSlug(project: {
  id: string | number;
  titleEn: string;
  titleFr?: string;
}): string {
  if (isMongoObjectId(project.id)) return String(project.id);
  return buildEntityPathSlug(project.titleEn || project.titleFr || 'project', project.id);
}

export function getBlogPathSlug(blog: {
  id: string | number;
  titleEn: string;
  titleFr?: string;
  slug?: string;
}): string {
  const cmsSlug = blog.slug?.trim();
  if (cmsSlug && isMongoObjectId(blog.id)) return cmsSlug;
  return buildEntityPathSlug(blog.titleEn || blog.titleFr || 'post', blog.id, blog.slug);
}

/** Strip `{slug}-0001` suffix for API lookups (CMS stores slug without suffix). */
export function stripTrailingPathIdSuffix(param: string): string {
  return param.replace(/-\d{4}$/, '');
}

/**
 * Resolve entity id from a route param.
 * Accepts Mongo ObjectId, legacy `/projects/12`, and slug form `/projects/name-0012`.
 */
export function parseEntityIdFromParam(param: string | undefined): string | null {
  if (!param) return null;
  if (isMongoObjectId(param)) return param;
  if (/^\d+$/.test(param)) return String(Number(param));
  const match = param.match(/-(\d{4})$/);
  if (match) return String(Number(match[1]));
  return null;
}

export function findByNumericId<T extends { id: string | number }>(
  items: T[],
  param: string | undefined,
): T | undefined {
  const id = parseEntityIdFromParam(param);
  if (id == null) return undefined;
  return items.find((item) => String(Number(item.id)) === id || String(item.id) === id);
}
