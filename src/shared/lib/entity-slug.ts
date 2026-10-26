/**
 * Readable public URLs for blogs & projects: `{name-slug}-{id-suffix}`
 * e.g. `/projects/combo-modular-saas-erp-0001`
 *      `/projects/nexus-restaurant-erp-a1b2c3d4` (Mongo: last 8 hex)
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

/** Short stable suffix for path URLs (numeric padded, or last 8 of ObjectId). */
export function formatPathIdSuffix(id: string | number): string {
  const raw = String(id);
  if (isMongoObjectId(raw)) return raw.slice(-8).toLowerCase();
  return formatId4(raw);
}

export function isMongoObjectId(id: string | number): boolean {
  return typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id);
}

export function buildEntityPathSlug(
  name: string,
  id: string | number,
  existingSlug?: string,
): string {
  const base = (existingSlug?.trim() || toSlug(name)).replace(/^-+|-+$/g, '') || 'item';
  return `${base}-${formatPathIdSuffix(id)}`;
}

type ProjectSlugInput = {
  id: string | number;
  titleEn: string;
  titleFr?: string;
  /** Optional CMS slug override (same idea as blogs). */
  slug?: string;
};

/** Always human-readable — never bare Mongo ObjectId alone. */
export function getProjectPathSlug(project: ProjectSlugInput): string {
  return buildEntityPathSlug(
    project.titleEn || project.titleFr || 'project',
    project.id,
    project.slug,
  );
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

/** Strip `{slug}-0001` or `{slug}-a1b2c3d4` suffix for CMS slug lookups. */
export function stripTrailingPathIdSuffix(param: string): string {
  return param.replace(/-(\d{4}|[a-f0-9]{8})$/i, '');
}

/**
 * Resolve a full entity id from a route param when possible.
 * Accepts Mongo ObjectId, legacy `/projects/12`, and numeric slug form `/projects/name-0012`.
 * Mongo short-suffix paths (`…-a1b2c3d4`) return null — resolve via list + getProjectPathSlug.
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

/** Match route param against readable path slug, bare id, or Mongo short suffix. */
export function findByPathSlug<T extends ProjectSlugInput>(
  items: readonly T[],
  param: string | undefined,
): T | undefined {
  if (!param) return undefined;
  const byExactSlug = items.find((p) => getProjectPathSlug(p) === param);
  if (byExactSlug) return byExactSlug;
  const byId = items.find((p) => String(p.id) === param);
  if (byId) return byId;
  const numeric = findByNumericId(items, param);
  if (numeric) return numeric;
  const mongoShort = param.match(/-([a-f0-9]{8})$/i);
  if (mongoShort) {
    const suffix = mongoShort[1].toLowerCase();
    return items.find((p) => isMongoObjectId(p.id) && String(p.id).toLowerCase().endsWith(suffix));
  }
  return undefined;
}
