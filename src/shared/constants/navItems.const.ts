import { Home, User, Code2, Briefcase, Mail, Layers, BookOpen, FileText } from 'lucide-react';

/** Top bar + mobile dock destinations */
export const navItems = [
  { id: '/', icon: Home, labelKey: 'nav.home' },
  { id: '/about', icon: User, labelKey: 'nav.about' },
  { id: '/skills', icon: Code2, labelKey: 'nav.skills' },
  { id: '/projects', icon: Briefcase, labelKey: 'nav.projects' },
  { id: '/services', icon: Layers, labelKey: 'nav.services' },
  { id: '/blog', icon: BookOpen, labelKey: 'nav.blog' },
  { id: '/contact', icon: Mail, labelKey: 'nav.contact' },
];

/**
 * Desktop sidebar destinations.
 * Contact is intentionally omitted: the footer owns the Contact CTA.
 * CV is a destination link (top bar keeps the Download CV utility).
 */
export const sidebarNavItems = [
  { id: '/', icon: Home, labelKey: 'nav.home' },
  { id: '/about', icon: User, labelKey: 'nav.about' },
  { id: '/skills', icon: Code2, labelKey: 'nav.skills' },
  { id: '/projects', icon: Briefcase, labelKey: 'nav.projects' },
  { id: '/services', icon: Layers, labelKey: 'nav.services' },
  { id: '/blog', icon: BookOpen, labelKey: 'nav.blog' },
  { id: '/cv', icon: FileText, labelKey: 'nav.cvPage' },
];
