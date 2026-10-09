import { RouteConfig } from '@/app/routes/types/RouteTypes';
import { lazyPage } from '@/app/routes/utils/utils';

/**
 * Admin routes are nested under AdminLayout in App.tsx.
 * Login stays outside the protected shell.
 */
export const adminRoutes: RouteConfig[] = [
  {
    path: '/barthez-admin/login',
    component: lazyPage(() => import('@/pages/app/Admin/LoginPage'), 'AdminLoginPage'),
    meta: { title: 'Admin Login', layout: 'admin-auth' },
  },
];

export const adminChildRoutes = [
  {
    path: '',
    component: lazyPage(() => import('@/pages/app/Admin/DashboardPage'), 'AdminDashboardPage'),
  },
  {
    path: 'blogs',
    component: lazyPage(() => import('@/pages/app/Admin/BlogsPage'), 'AdminBlogsPage'),
  },
  {
    path: 'blogs/:blogId',
    component: lazyPage(
      () => import('@/pages/app/Admin/BlogsPage/BlogEditorPage'),
      'AdminBlogEditorPage',
    ),
  },
  {
    path: 'projects',
    component: lazyPage(() => import('@/pages/app/Admin/ProjectsPage'), 'AdminProjectsPage'),
  },
  {
    path: 'projects/:projectId',
    component: lazyPage(
      () => import('@/pages/app/Admin/ProjectsPage/ProjectEditorPage'),
      'AdminProjectEditorPage',
    ),
  },
  {
    path: 'skills',
    component: lazyPage(() => import('@/pages/app/Admin/SkillsPage'), 'AdminSkillsPage'),
  },
  {
    path: 'services',
    component: lazyPage(() => import('@/pages/app/Admin/ServicesPage'), 'AdminServicesPage'),
  },
  {
    path: 'certifications',
    component: lazyPage(
      () => import('@/pages/app/Admin/CertificationsPage'),
      'AdminCertificationsPage',
    ),
  },
  {
    path: 'education',
    component: lazyPage(() => import('@/pages/app/Admin/EducationPage'), 'AdminEducationPage'),
  },
  {
    path: 'experiences',
    component: lazyPage(() => import('@/pages/app/Admin/ExperiencesPage'), 'AdminExperiencesPage'),
  },
  {
    path: 'achievements',
    component: lazyPage(
      () => import('@/pages/app/Admin/AchievementsPage'),
      'AdminAchievementsPage',
    ),
  },
  {
    path: 'languages',
    component: lazyPage(() => import('@/pages/app/Admin/LanguagesPage'), 'AdminLanguagesPage'),
  },
  {
    path: 'testimonials',
    component: lazyPage(
      () => import('@/pages/app/Admin/TestimonialsPage'),
      'AdminTestimonialsPage',
    ),
  },
  {
    path: 'references',
    component: lazyPage(() => import('@/pages/app/Admin/ReferencesPage'), 'AdminReferencesPage'),
  },
  {
    path: 'contact-info',
    component: lazyPage(() => import('@/pages/app/Admin/ContactInfoPage'), 'AdminContactInfoPage'),
  },
  {
    path: 'contact-responses',
    component: lazyPage(
      () => import('@/pages/app/Admin/ContactResponsesPage'),
      'AdminContactResponsesPage',
    ),
  },
  {
    path: 'newsletter',
    component: lazyPage(() => import('@/pages/app/Admin/NewsletterPage'), 'AdminNewsletterPage'),
  },
] as const;
