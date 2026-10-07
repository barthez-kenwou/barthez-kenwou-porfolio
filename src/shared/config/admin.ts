/** Private admin surface; intentionally not `/admin` to avoid trivial probing. */
export const ADMIN_BASE = '/barthez-admin';

export const adminPath = (...segments: string[]) => {
  const cleaned = segments
    .map((s) => s.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
  return cleaned ? `${ADMIN_BASE}/${cleaned}` : ADMIN_BASE;
};

export const ADMIN_LOGIN = adminPath('login');
