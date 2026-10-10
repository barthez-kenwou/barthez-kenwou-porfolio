import { ADMIN_BASE, adminPath } from '@/shared/config/admin';

export type AdminNavItem = {
  path: string;
  labelFr: string;
  labelEn: string;
  /** Quiet typographic marker; avoids generic icon clutter */
  mark: string;
};

export type AdminNavGroup = {
  id: 'contenu' | 'profil' | 'communication' | 'compte';
  labelFr: string;
  labelEn: string;
  items: AdminNavItem[];
};

export const adminDashboardItem: AdminNavItem = {
  path: ADMIN_BASE,
  labelFr: 'Tableau de bord',
  labelEn: 'Dashboard',
  mark: '◆',
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: 'contenu',
    labelFr: 'Contenu',
    labelEn: 'Content',
    items: [
      { path: adminPath('blogs'), labelFr: 'Blogs', labelEn: 'Blogs', mark: '01' },
      { path: adminPath('projects'), labelFr: 'Projets', labelEn: 'Projects', mark: '02' },
      { path: adminPath('skills'), labelFr: 'Compétences', labelEn: 'Skills', mark: '03' },
      { path: adminPath('services'), labelFr: 'Services', labelEn: 'Services', mark: '04' },
    ],
  },
  {
    id: 'profil',
    labelFr: 'Profil CV',
    labelEn: 'CV profile',
    items: [
      {
        path: adminPath('certifications'),
        labelFr: 'Certifications',
        labelEn: 'Certifications',
        mark: '05',
      },
      {
        path: adminPath('education'),
        labelFr: 'Formations',
        labelEn: 'Education',
        mark: '06',
      },
      {
        path: adminPath('experiences'),
        labelFr: 'Expériences',
        labelEn: 'Experiences',
        mark: '07',
      },
      {
        path: adminPath('achievements'),
        labelFr: 'Réalisations',
        labelEn: 'Achievements',
        mark: '08',
      },
      {
        path: adminPath('languages'),
        labelFr: 'Langues',
        labelEn: 'Languages',
        mark: '09',
      },
      {
        path: adminPath('testimonials'),
        labelFr: 'Témoignages',
        labelEn: 'Testimonials',
        mark: '10',
      },
      {
        path: adminPath('references'),
        labelFr: 'Références pro.',
        labelEn: 'References',
        mark: '11',
      },
    ],
  },
  {
    id: 'communication',
    labelFr: 'Communication',
    labelEn: 'Communication',
    items: [
      {
        path: adminPath('contact-info'),
        labelFr: 'Coordonnées',
        labelEn: 'Contact info',
        mark: '12',
      },
      {
        path: adminPath('contact-responses'),
        labelFr: 'Messages reçus',
        labelEn: 'Messages',
        mark: '13',
      },
      {
        path: adminPath('newsletter'),
        labelFr: 'Newsletter',
        labelEn: 'Newsletter',
        mark: '14',
      },
    ],
  },
  {
    id: 'compte',
    labelFr: 'Compte',
    labelEn: 'Account',
    items: [
      {
        path: adminPath('account'),
        labelFr: 'Espace compte',
        labelEn: 'Account space',
        mark: '15',
      },
    ],
  },
];

export const adminNavItems: AdminNavItem[] = [
  adminDashboardItem,
  ...adminNavGroups.flatMap((g) => g.items),
];

export function findAdminNavItem(pathname: string): AdminNavItem | undefined {
  if (pathname === ADMIN_BASE || pathname === `${ADMIN_BASE}/`) {
    return adminDashboardItem;
  }
  return adminNavItems.find((item) => item.path !== ADMIN_BASE && pathname.startsWith(item.path));
}

const ACCOUNT_CRUMB_LABELS: Record<string, { fr: string; en: string }> = {
  account: { fr: 'Compte', en: 'Account' },
  audit: { fr: 'Audit', en: 'Audit' },
  permissions: { fr: 'Permissions', en: 'Permissions' },
};

/** Build header crumbs from pathname segments after /barthez-admin */
export function buildAdminCrumbs(pathname: string, language: 'fr' | 'en') {
  const rest = pathname.replace(ADMIN_BASE, '').replace(/^\//, '');
  const crumbs: Array<{ label: string; href?: string }> = [{ label: 'Admin', href: ADMIN_BASE }];
  if (!rest) return crumbs;

  const parts = rest.split('/').filter(Boolean);
  let acc = ADMIN_BASE;
  parts.forEach((part, i) => {
    acc = `${acc}/${part}`;
    const known = findAdminNavItem(acc);
    const isLast = i === parts.length - 1;
    const accountLabel = ACCOUNT_CRUMB_LABELS[part];
    const label =
      known && known.path === acc
        ? language === 'fr'
          ? known.labelFr
          : known.labelEn
        : accountLabel
          ? language === 'fr'
            ? accountLabel.fr
            : accountLabel.en
          : decodeURIComponent(part);
    crumbs.push({ label, href: isLast ? undefined : acc });
  });
  return crumbs;
}
