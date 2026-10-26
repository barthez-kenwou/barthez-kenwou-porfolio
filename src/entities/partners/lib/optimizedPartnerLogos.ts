/**
 * Local WebP stand-ins for partner logos (display ~120×40 / 2× retina).
 * Remote CMS originals are often 300–2000px PNGs (~1MB total on the home marquee).
 * Re-run optimization when partner IDs / logos change in CMS.
 */
const BY_PARTNER_ID: Record<string, string> = {
  '6acb84e4a56b65010f954213': '/images/partners/6acb84e4a56b65010f954213.webp', // GTA
  '6acb84afa56b65010f954210': '/images/partners/6acb84afa56b65010f954210.webp', // ZENORA
  '6acb8773a56b65010f954225': '/images/partners/6acb8773a56b65010f954225.webp', // NEXUS
  '6acb8741a56b65010f954222': '/images/partners/6acb8741a56b65010f954222.webp', // Worketyamo
  '6acb8526a56b65010f954216': '/images/partners/6acb8526a56b65010f954216.webp', // K&C
  '6acb86e1a56b65010f95421f': '/images/partners/6acb86e1a56b65010f95421f.webp', // ESOPA
  '6acb86a5a56b65010f95421c': '/images/partners/6acb86a5a56b65010f95421c.webp', // EYG
  '6acb8652a56b65010f954219': '/images/partners/6acb8652a56b65010f954219.webp', // CAFCA
  '6acf763b1d98e9625fda9232': '/images/partners/6acf763b1d98e9625fda9232.webp', // Cabinet CESR
};

/** Filename fragment → local path (survives CMS re-upload of same asset name). */
const BY_FILENAME_HINT: Array<[string, string]> = [
  ['logo-esopa', BY_PARTNER_ID['6acb86e1a56b65010f95421f']],
  ['logo-cafca', BY_PARTNER_ID['6acb8652a56b65010f954219']],
  ['logo-nexus', BY_PARTNER_ID['6acb8773a56b65010f954225']],
  ['zenora-logo', BY_PARTNER_ID['6acb84afa56b65010f954210']],
  ['logo-eyg', BY_PARTNER_ID['6acb86a5a56b65010f95421c']],
  ['logo-worketyamo', BY_PARTNER_ID['6acb8741a56b65010f954222']],
  ['logo-kc', BY_PARTNER_ID['6acb8526a56b65010f954216']],
  ['gta-ecosystem', BY_PARTNER_ID['6acb84e4a56b65010f954213']],
  ['dee480b2-c333-4246-85dd-07a03d9a09b3', BY_PARTNER_ID['6acf763b1d98e9625fda9232']],
];

export function resolvePartnerLogoUrl(partnerId: string | number, remoteUrl: string): string {
  const byId = BY_PARTNER_ID[String(partnerId)];
  if (byId) return byId;

  const lower = remoteUrl.toLowerCase();
  for (const [hint, path] of BY_FILENAME_HINT) {
    if (lower.includes(hint)) return path;
  }

  return remoteUrl;
}
