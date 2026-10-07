/** Shared SEO generation constants - keep in sync with src/shared/config/site.ts */

export const SITE_URL = 'https://barthez-kenwou.dev';
export const SITE_NAME = 'Barthez Kenwou';
export const SITE_NAME_FULL = 'Barthez Kenwou - Portfolio';
export const DEFAULT_TITLE = 'Barthez Kenwou | Développeur Full Stack & Ingénieur DevOps';
export const DEFAULT_DESCRIPTION =
  'Portfolio de Barthez Kenwou - Développeur Full Stack JS & Ingénieur DevOps spécialiste AWS Cloud. Applications web modernes, CI/CD, Kubernetes et architectures cloud performantes.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-share.jpg`;
export const AUTHOR_EMAIL = 'kenwoubarthez@gmail.com';
export const AUTHOR_PHONE = '+237 655 646 688';
export const AUTHOR_LOCATION = 'Yaoundé, Cameroun';
export const SOCIAL = {
  github: 'https://github.com/barthez-kenwou',
  linkedin: 'https://linkedin.com/in/barthez-kenwou',
  whatsapp: 'https://wa.me/237655646688',
} as const;

export const TODAY = new Date().toISOString().split('T')[0];

export type StaticPage = {
  path: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  priority: number;
  changefreq: string;
  bodyFr: string;
  bodyEn: string;
};

export const STATIC_PAGES: StaticPage[] = [
  {
    path: '/',
    titleFr: DEFAULT_TITLE,
    titleEn: 'Barthez Kenwou | Full Stack Developer & DevOps Engineer',
    descriptionFr:
      'Passionné par le développement web et le cloud depuis plus de 3 ans. Applications web modernes, CI/CD, Kubernetes et architectures AWS performantes.',
    descriptionEn:
      'Passionate about web development and cloud for 3+ years. Modern web apps, CI/CD, Kubernetes and high-performance AWS architectures.',
    priority: 1.0,
    changefreq: 'weekly',
    bodyFr: `<h1>Barthez Kenwou</h1>
<p>Développeur Full Stack JS &amp; Ingénieur DevOps, spécialiste AWS Cloud, basé à Yaoundé (Cameroun).</p>
<p>Je conçois et déploie des applications web modernes, scalables et performantes : React, Node.js, Docker, Kubernetes, Terraform, CI/CD et observabilité.</p>
<nav><ul>
<li><a href="${SITE_URL}/about">À propos</a></li>
<li><a href="${SITE_URL}/services">Services</a></li>
<li><a href="${SITE_URL}/projects">Projets</a></li>
<li><a href="${SITE_URL}/skills">Compétences</a></li>
<li><a href="${SITE_URL}/blog">Blog</a></li>
<li><a href="${SITE_URL}/cv">CV</a></li>
<li><a href="${SITE_URL}/contact">Contact</a></li>
</ul></nav>`,
    bodyEn: `<h1>Barthez Kenwou</h1>
<p>Full Stack JS Developer &amp; DevOps Engineer, AWS Cloud specialist, based in Yaoundé (Cameroon).</p>
<p>I design and ship modern, scalable web applications: React, Node.js, Docker, Kubernetes, Terraform, CI/CD and observability.</p>
<nav><ul>
<li><a href="${SITE_URL}/about">About</a></li>
<li><a href="${SITE_URL}/services">Services</a></li>
<li><a href="${SITE_URL}/projects">Projects</a></li>
<li><a href="${SITE_URL}/skills">Skills</a></li>
<li><a href="${SITE_URL}/blog">Blog</a></li>
<li><a href="${SITE_URL}/cv">Resume</a></li>
<li><a href="${SITE_URL}/contact">Contact</a></li>
</ul></nav>`,
  },
  {
    path: '/about',
    titleFr: 'À propos | Barthez Kenwou',
    titleEn: 'About | Barthez Kenwou',
    descriptionFr:
      'Parcours, vision et expertise de Barthez Kenwou - Full Stack, DevOps et cloud AWS.',
    descriptionEn:
      'Background, vision and expertise of Barthez Kenwou - Full Stack, DevOps and AWS cloud.',
    priority: 0.9,
    changefreq: 'monthly',
    bodyFr: `<h1>À propos de Barthez Kenwou</h1>
<p>Ingénieur passionné par le craft logiciel et les infrastructures cloud. Je construis des produits numériques fiables, observés et déployés en continu.</p>
<p><a href="${SITE_URL}/cv">Voir mon CV</a> · <a href="${SITE_URL}/contact">Me contacter</a> · <a href="${SITE_URL}/projects">Mes projets</a></p>`,
    bodyEn: `<h1>About Barthez Kenwou</h1>
<p>Engineer focused on software craft and cloud infrastructure. I build reliable digital products with continuous delivery and observability.</p>
<p><a href="${SITE_URL}/cv">Resume</a> · <a href="${SITE_URL}/contact">Contact</a> · <a href="${SITE_URL}/projects">Projects</a></p>`,
  },
  {
    path: '/services',
    titleFr: 'Services | Barthez Kenwou',
    titleEn: 'Services | Barthez Kenwou',
    descriptionFr:
      'Développement Full Stack, DevOps, CI/CD, Kubernetes, sécurisation cloud AWS et accompagnement technique.',
    descriptionEn:
      'Full Stack development, DevOps, CI/CD, Kubernetes, AWS hardening and technical consulting.',
    priority: 0.9,
    changefreq: 'monthly',
    bodyFr: `<h1>Services</h1>
<ul>
<li>Développement d’applications web Full Stack (React, Node.js, TypeScript)</li>
<li>Architecture cloud AWS et déploiement scalable</li>
<li>Pipelines CI/CD, GitOps, Docker &amp; Kubernetes</li>
<li>Observabilité, sécurité et hardening serveur</li>
<li>Audit technique et accompagnement d’équipes</li>
</ul>
<p><a href="${SITE_URL}/contact">Demander un devis</a></p>`,
    bodyEn: `<h1>Services</h1>
<ul>
<li>Full Stack web apps (React, Node.js, TypeScript)</li>
<li>AWS cloud architecture and scalable delivery</li>
<li>CI/CD pipelines, GitOps, Docker &amp; Kubernetes</li>
<li>Observability, security and server hardening</li>
<li>Technical audits and team enablement</li>
</ul>
<p><a href="${SITE_URL}/contact">Get in touch</a></p>`,
  },
  {
    path: '/projects',
    titleFr: 'Projets | Barthez Kenwou',
    titleEn: 'Projects | Barthez Kenwou',
    descriptionFr: 'Études de cas : SaaS, PWA, ERP, DevSecOps, observabilité et plateformes cloud.',
    descriptionEn: 'Case studies: SaaS, PWA, ERP, DevSecOps, observability and cloud platforms.',
    priority: 0.9,
    changefreq: 'weekly',
    bodyFr: `<h1>Projets</h1>
<p>Sélection de réalisations Full Stack &amp; DevOps - ERP SaaS, PWA, plateformes cloud, sécurité et observabilité.</p>
<p><a href="${SITE_URL}/">Retour à l’accueil</a></p>`,
    bodyEn: `<h1>Projects</h1>
<p>Selected Full Stack &amp; DevOps work - SaaS ERP, PWAs, cloud platforms, security and observability.</p>
<p><a href="${SITE_URL}/">Back home</a></p>`,
  },
  {
    path: '/skills',
    titleFr: 'Compétences | Barthez Kenwou',
    titleEn: 'Skills | Barthez Kenwou',
    descriptionFr:
      'Stack technique : React, TypeScript, Node.js, AWS, Docker, Kubernetes, Terraform, CI/CD, observabilité.',
    descriptionEn:
      'Tech stack: React, TypeScript, Node.js, AWS, Docker, Kubernetes, Terraform, CI/CD, observability.',
    priority: 0.8,
    changefreq: 'monthly',
    bodyFr: `<h1>Compétences</h1>
<p>Frontend (React, TypeScript, Tailwind), Backend (Node.js, APIs), Cloud AWS, DevOps (Docker, K8s, Terraform, GitHub Actions), sécurité et monitoring.</p>
<p><a href="${SITE_URL}/projects">Voir les projets</a></p>`,
    bodyEn: `<h1>Skills</h1>
<p>Frontend (React, TypeScript, Tailwind), Backend (Node.js, APIs), AWS cloud, DevOps (Docker, K8s, Terraform, GitHub Actions), security and monitoring.</p>
<p><a href="${SITE_URL}/projects">See projects</a></p>`,
  },
  {
    path: '/blog',
    titleFr: 'Blog | Barthez Kenwou',
    titleEn: 'Blog | Barthez Kenwou',
    descriptionFr:
      'Tutoriels DevOps, AWS, Node.js, React, Kubernetes, sécurité et bonnes pratiques production.',
    descriptionEn:
      'Tutorials on DevOps, AWS, Node.js, React, Kubernetes, security and production best practices.',
    priority: 0.8,
    changefreq: 'weekly',
    bodyFr: `<h1>Blog technique</h1>
<p>Guides pratiques sur le CI/CD, AWS, la sécurité, Kubernetes et le développement Full Stack.</p>`,
    bodyEn: `<h1>Tech blog</h1>
<p>Practical guides on CI/CD, AWS, security, Kubernetes and Full Stack development.</p>`,
  },
  {
    path: '/cv',
    titleFr: 'CV | Barthez Kenwou',
    titleEn: 'Resume | Barthez Kenwou',
    descriptionFr:
      'Curriculum vitae de Barthez Kenwou - expériences, formations et compétences Full Stack &amp; DevOps.',
    descriptionEn:
      'Resume of Barthez Kenwou - experience, education and Full Stack &amp; DevOps skills.',
    priority: 0.8,
    changefreq: 'monthly',
    bodyFr: `<h1>Curriculum vitae</h1>
<p>Parcours professionnel, formations et compétences de Barthez Kenwou.</p>
<p><a href="${SITE_URL}/contact">Me recruter</a> · <a href="${SOCIAL.linkedin}">LinkedIn</a></p>`,
    bodyEn: `<h1>Resume</h1>
<p>Professional background, education and skills of Barthez Kenwou.</p>
<p><a href="${SITE_URL}/contact">Hire me</a> · <a href="${SOCIAL.linkedin}">LinkedIn</a></p>`,
  },
  {
    path: '/contact',
    titleFr: 'Contact | Barthez Kenwou',
    titleEn: 'Contact | Barthez Kenwou',
    descriptionFr:
      'Contactez Barthez Kenwou pour un projet web, DevOps ou cloud AWS. Email, WhatsApp, LinkedIn.',
    descriptionEn:
      'Contact Barthez Kenwou for web, DevOps or AWS cloud projects. Email, WhatsApp, LinkedIn.',
    priority: 0.7,
    changefreq: 'monthly',
    bodyFr: `<h1>Contact</h1>
<ul>
<li>Email : <a href="mailto:${AUTHOR_EMAIL}">${AUTHOR_EMAIL}</a></li>
<li>Téléphone : <a href="tel:${AUTHOR_PHONE.replace(/\s/g, '')}">${AUTHOR_PHONE}</a></li>
<li>WhatsApp : <a href="${SOCIAL.whatsapp}">Écrire sur WhatsApp</a></li>
<li>LinkedIn : <a href="${SOCIAL.linkedin}">barthez-kenwou</a></li>
<li>GitHub : <a href="${SOCIAL.github}">barthez-kenwou</a></li>
<li>Localisation : ${AUTHOR_LOCATION}</li>
</ul>`,
    bodyEn: `<h1>Contact</h1>
<ul>
<li>Email: <a href="mailto:${AUTHOR_EMAIL}">${AUTHOR_EMAIL}</a></li>
<li>Phone: <a href="tel:${AUTHOR_PHONE.replace(/\s/g, '')}">${AUTHOR_PHONE}</a></li>
<li>WhatsApp: <a href="${SOCIAL.whatsapp}">Chat on WhatsApp</a></li>
<li>LinkedIn: <a href="${SOCIAL.linkedin}">barthez-kenwou</a></li>
<li>GitHub: <a href="${SOCIAL.github}">barthez-kenwou</a></li>
<li>Location: ${AUTHOR_LOCATION}</li>
</ul>`,
  },
];

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}
